import Script from 'next/script';
import { NavBar } from '@/components/layout/Navbar'; // Corrected import path

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <div className="flex flex-col min-h-screen bg-white">
        <NavBar />
        <div className="flex-1 container max-w-4xl mx-auto px-4">
          <main className="flex-1 pt-4">{children}</main>
        </div>
      </div>
    </>
  );
}
