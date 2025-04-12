# Project Tasks

## Critical Priorities

### Immediate Fixes

- [ ] Fix Hero section text overlapping other elements
- [ ] Fix expandable widget button showing on `/chat` page
- [ ] Fix input text visibility in `MultimodalInput`
- [ ] Add fullscreen button/link to `/chat` page from widget header

### UI Integration

- [ ] Integrate `ChatInterface` into Hero section
- [ ] Add VoiceOrb visualization
- [ ] Add Canvas background animation (from Vercel template)
- [ ] Integrate canva function to fullscreen chat

## Completed Core Features ✅

### Chat Functionality

- [x] Setup base chat interface using Vercel AI SDK (`useChat` hook)
- [x] Implement basic message display (`components/messages.tsx`)
- [x] Create core chat UI wrapper (`components/ChatInterface.tsx`)
- [x] Refactor `ChatInterface` to accept props from `useChat`
- [x] Create multimodal input component (`components/multimodal-input.tsx`)
- [x] Integrate `MultimodalInput` into `ChatInterface`

### Voice Integration

- [x] Integrate `useVoiceRecording` hook into `MultimodalInput`
- [x] Add microphone button to `MultimodalInput`
- [x] Implement start/stop recording logic via button
- [x] Display transcription in the input field
- [x] Show "Listening..." / "Transcribing..." status indicator
- [x] Handle browser speech recognition support check

### UI Components

- [x] Basic Hero section layout (`components/sections/Hero.tsx`)
- [x] Create `components/ExpandableChatWidget.tsx`
- [x] Add toggle button fixed to bottom-right
- [x] Implement animated chat panel opening/closing
- [x] Integrate `ChatInterface` into the widget panel
- [x] Add logic to hide widget on `/chat` page
- [x] Restructure Navbar layout
- [x] Add placeholder action buttons
- [x] Update mobile menu layout

## Pending Features

### Chat UI Enhancements

- [ ] Integrate visual `VoiceOrb` component
- [ ] Implement 3D Logo component (`components/ui/Logo3D.tsx`)
- [ ] Implement theme toggle functionality
- [ ] Implement search functionality

### Fullscreen Chat Page (`/chat`)

- [x] Basic page structure (needs review)
- [x] `ChatInterface` renders correctly
- [ ] Ensure `MultimodalInput` functions correctly
- [ ] Add smooth UI transitions

## Deferred Tasks

### Backend Implementation

- [ ] Setup Python server with GCP
- [ ] Integrate Google Gemini Pro 2.5 multimodal API
- [ ] Implement FastAPI structure
- [ ] Setup database integration

### Additional Features

- [ ] Add Blog functionality (Sanity/Firebase)
- [ ] Add Example pages
- [ ] Add Quote page
- [ ] Implement rate limiting
- [ ] Add comprehensive testing suite

## Reference Resources

- Original UI designs: `/oldproject/conversational-ui/`
- Widget implementation: `/oldproject/AIChatWidgets/`
- Vercel AI SDK documentation
- Google Gemini Pro 2.5 API documentation

## Development Notes

- Focus on using Vercel AI SDK as-is - avoid breaking core functionality
- Maintain clean component architecture
- Follow Pages Router structure
- Use Tailwind CSS exclusively for styling
- Track all changes in Progress_update.md
