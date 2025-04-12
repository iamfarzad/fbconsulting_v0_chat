import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // Make the check more specific - only protect actual chat routes if they exist
      // Or remove if we don't have specific /chat routes to protect
      // For now, let's assume chat lives under /chat/* 
      const isOnProtectedChat = nextUrl.pathname.startsWith('/chat'); 
      const isOnRegister = nextUrl.pathname.startsWith('/register');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isOnArtifact = nextUrl.pathname.startsWith('/artifact');
      const isOnRoot = nextUrl.pathname === '/';

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      if (isOnRegister || isOnLogin) {
        return true; // Always allow access to register and login pages
      }

      // Allow access to root and artifact pages regardless of login status
      if (isOnRoot || isOnArtifact) {
          return true;
      }

      // Protect specific chat routes if they exist
      if (isOnProtectedChat) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      // If logged in and trying to access something else, maybe redirect to root?
      // Or just allow? Let's allow for now.
      // if (isLoggedIn) {
      //   return Response.redirect(new URL('/', nextUrl as unknown as URL));
      // }

      // Default: Allow access if none of the above conditions met
      // (could be API routes, public assets, etc.)
      return true; 
    },
  },
} satisfies NextAuthConfig;
