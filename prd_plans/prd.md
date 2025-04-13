# Project Requirements Document (PRD) - FB Consulting AI Website

## 1. Project Goal

* Integrate the visual design and key components/structures from the `Oreginal_project` (overall site styling) and `conversational-ui` (chat structure/components) into the current Vercel AI SDK-based project.
* Ensure the implementation adheres to the guidelines specified in `.cursor/rules/desing_rules.md` (Tailwind v4, OKLCH, 8pt grid, typography rules, etc.).

## 2. Phase 1: Global Style Integration

* **Objective:** Establish the foundational visual theme from `Oreginal_project`.
* **Requirements:**
  * Apply the neutral color palette (grays, blacks, whites) from `Oreginal_project`.
  * Incorporate the specific orange accent color (`#fe5a1d`).
  * Implement the `.glassmorphism-base` effect.
  * Include utility styles: `.animate-subtle-bounce`, `.subtle-grid`, `.text-gradient`, `.text-highlight`.
  * Set base border radius (`--radius: 0.5rem`).
* **Implementation Plan:**
  * Convert HSL/Hex colors (neutral theme + orange) to OKLCH format.
  * Modify `app/globals.css`:
    * Use `@theme` directive.
    * Define OKLCH CSS variables for the theme colors (light/dark) and `--brand-orange`.
    * Define `--radius`.
    * Add the specified utility classes/animations.
  * Modify `tailwind.config.ts`:
    * Add `'brand-orange': 'oklch(var(--brand-orange))'` to `theme.extend.colors`.

## 3. Phase 2: Layout Integration (Future)

* **Objective:** Replicate the Navbar and Footer structure and styling from `Oreginal_project`.
* **Requirements:** Match the layout, appearance, and responsiveness of the Navbar/Footer from `Oreginal_project`.
* **Implementation Plan:** Analyze original components, rebuild/adapt using shadcn/ui & Tailwind, integrate into `app/layout.tsx`.

## 4. Phase 3: Hero Section Integration (Future)

* **Objective:** Replicate the Hero section layout and styling from `Oreginal_project` as the primary user entry point ("Herochat").
* **Requirements:** Match the visual structure (Headline, Subheadline, Chat Input container, CTA button) and styling described by the user. Ensure the chat input uses the `.glassmorphism-base` style.
* **Implementation Plan:** Analyze original component, adapt/rebuild for `app/page.tsx`.

## 5. Phase 4: Chat Interface Design Integration (Future)

* **Objective:** Apply desired styling and potentially structure to the chat components within the Vercel AI SDK framework.
* **Requirements:**
  * Style chat messages, input area, sidebars etc., primarily using the visual aesthetic derived from `Oreginal_project` (colors, glassmorphism where appropriate).
  * **Reference `conversational-ui`** for potential structural patterns, component ideas (e.g., Agent-related displays if applicable), or specific UI element implementations that can be adapted to the Vercel AI SDK context.
  * Ensure compatibility with `useChat` hook data flow.
* **Implementation Plan:** Analyze relevant components from `conversational-ui`. Adapt/style existing Vercel AI SDK components (`components/chat.tsx`, `chat-list.tsx`, etc.) using Tailwind/CSS, potentially incorporating structural ideas from `conversational-ui`.

## 6. Design Constraints

* Strict adherence to `.cursor/rules/desing_rules.md`.

Here’s a detailed overview of the Vercel AI Chatbot template’s layout and architecture, focusing on its structure, key components, and how they interconnect.

⸻

1. Project Structure

The Vercel AI Chatbot template is organized as follows:
 • app/: Contains route handlers and page components. ￼
 • page.tsx: Main entry point rendering the chat interface.
 • api/chat/route.ts: API endpoint handling chat requests. ￼
 • components/: Houses reusable UI components.
 • chat/: Components related to the chat interface.
 • layout/: Layout components defining the page structure. ￼
 • hooks/: Custom React hooks for managing state and logic.
 • lib/: Utility functions and configurations.
 • public/: Static assets like images and icons.
 • tailwind.config.ts: Tailwind CSS configuration.
 • tsconfig.json: TypeScript configuration.

⸻

2. Layout Components

ChatLayout.tsx

Defines the overall layout of the chat application, including:
 • Header: Contains navigation and branding.
 • Sidebar: Displays chat history or additional options.
 • Main Content Area: Renders the chat interface.

⸻

3. Chat Interface

ChatInput.tsx

Manages user input, including:
 • Text Input Field: For user messages. ￼
 • Submit Button: To send messages. ￼
 • File Upload: Allows users to upload files.

ChatMessages.tsx

Displays the conversation history, handling:
 • User Messages: Styled differently from AI responses.
 • AI Responses: Includes support for streaming responses.
 • Artifacts: Renders special content like images, code snippets, or documents.

⸻

4. API Integration

route.ts

Handles incoming chat requests:
 • Receives Messages: From the frontend. ￼
 • Processes with AI SDK: Utilizes models like OpenAI’s GPT. ￼
 • Streams Responses: Back to the client for real-time interaction.

⸻

5. State Management

useChat Hook

Provided by the AI SDK, it manages: ￼
 • Messages State: Keeps track of the conversation.
 • Input Handling: Manages the current input value. ￼
 • Submission Logic: Handles sending messages and receiving responses.
 • Streaming Status: Indicates if a response is being streamed.

⸻

6. Styling

Utilizes Tailwind CSS for styling:
 • Responsive Design: Ensures compatibility across devices.
 • Custom Themes: Defined in tailwind.config.ts for consistent styling.
 • Utility Classes: Used throughout components for layout and design.

⸻

7. Authentication and Persistence

While the base template doesn’t include authentication or data persistence, it can be extended with: ￼
 • Auth.js: For user authentication. ￼
 • Supabase or Vercel Postgres: To store chat history and user data. ￼

⸻

This overview provides a comprehensive understanding of the Vercel AI Chatbot template’s layout and architecture.

Here’s your PRD for the Fullscreen Voice Orb Mode — structured for implementation, design alignment, and developer handoff.

⸻

🧾 PRD – Fullscreen Voice Orb Mode (Dark & Light Theme Support)

✅ Objective

Create an immersive fullscreen voice interaction mode triggered from the homepage or chat. Integrate a central voice orb, dynamic prompt/transcript, and minimal controls with full dark/light mode compatibility. All functionality must preserve the underlying logic of the Vercel AI SDK Chatbot.

⸻

📦 Scope

Included Not Included
Fullscreen transition Text-only layout changes
Orb animation and voice state visuals Model training or audio quality upgrades
Live transcript Backend voice-to-text logic
Dark/light toggle and persistence User auth or session saving

⸻

🧱 Layout Overview

Component Zones

<VoiceFullScreenLayout>
 ├── <VoiceOrb>              // Centered, animated, responds to state
 ├── <VoicePromptBubble>     // Initial prompt or transcript (fades in/out)
 ├── <VoiceControls>         // Play / Stop / Retry buttons
 ├── <ExitButton>            // Top-right close X
 └── (optional) <VoiceTranscriptHistory> // Left-side log

⸻

🎨 Visual Behavior

Voice Orb

State Behavior
Idle Dimmed orb, pulsing softly, tooltip: “Click to talk”
Listening Orb glows, pulsing with amplitude, tooltip: “Listening…”
Thinking Orb glows with slower pulse or rotation
Responding Orb shrinks subtly while text is shown
Error Orb pulses red briefly or shows alert icon

Prompt Bubble
 • Shows:
 • Initial user prompt (e.g., “How can AI automation help my business?”)
 • Real-time voice transcript while listening
 • Position: Just above orb, centered
 • Animates in/out based on state change

Controls (Play / Retry / Stop)
 • Always anchored under orb (centered bottom)
 • Icons:
 • ▶️ (Start/Resume)
 • ⏹️ (Stop)
 • 🔄 (Reset/Retry)
 • Auto-hide after inactivity (optional, unless listening === true)

Dark vs. Light Mode

Theme Orb BG Rings Text BG
Dark Soft orange-red Warm radial glow Light gray #000
Light Light blue-white Cool-toned ripple Dark gray #f8f8f8

⸻

🧠 Interaction Flow

 1. User clicks “Talk to Eve”
 2. Page transitions to fullscreen mode
 3. Orb becomes active – displays voice state
 4. User speaks → real-time transcript shown in prompt bubble
 5. Message ends → assistant responds, orb changes state
 6. Exit icon (top-right) returns to normal chat or homepage

⸻

🛠 Technical Implementation Plan

Component Tasks

Component File Task
VoiceFullScreenLayout.tsx components/voice/ New wrapper layout. Handles dark/light theme, fullscreen state, ESC key exit.
VoiceOrb.tsx components/voice/ Core orb element. State-driven animation. Use Framer Motion.
VoicePromptBubble.tsx components/voice/ Optional. Positioned above orb. Fade in/out. Pull from voice transcript.
VoiceControls.tsx components/voice/ Play/Stop/Retry actions. Icons, centered below orb.
useVoiceState.ts hooks/ Custom hook for managing voice state transitions (idle → listening → responding).
theme.ts or Tailwind config global Define orb colors, ring gradients for both themes.

⸻

🧪 Acceptance Criteria
 • ✅ Orb transitions clearly between all states (idle → listening → thinking → done).
 • ✅ Fullscreen view disables scroll, hides nav, adds ESC support.
 • ✅ Light/dark themes switch seamlessly with orb adapting visually.
 • ✅ Voice prompt shown as tooltip or inline bubble during listening.
 • ✅ Controls (play, stop, retry) are clearly visible and responsive.
 • ✅ Works on desktop and mobile (responsive layout).

⸻

⏳ Timeline (Est. 1 Dev, 1 Designer)

Week Task
1 Layout skeleton, voice state logic, orb animation (basic)
2 Full visual design, prompt overlay, dark/light theming
3 Transcripts integration, control logic, final testing
4 QA, polish, deployment hooks

⸻

🧩 Optional Enhancements (Post MVP)
 • Ambient sound wave around orb
 • Whisper.js integration
 • Voice avatar expression (pulse reacts to tone)
 • Small log of transcript (left panel with history)

⸻
[oreginal vercel repo.](https://github.com/vercel/ai-chatbot)
