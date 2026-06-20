<!-- BEGIN:nextjs-agent-rules -->
# ManaSutra AI Student Wellness Platform - Agent & Developer Guide

Welcome to the **मनःसूत्र (ManaSutra)** project guide. This document serves as the single source of truth for agents and developers modifying, expanding, or testing the codebase. It details the system architecture, features, security/accessibility standards, and testing methodologies.

---

## 1. Project Overview & Objective

**ManaSutra** is a next-generation AI-powered student wellness tracker designed specifically for students preparing for high-stakes examinations (e.g., JEE, NEET, UPSC, GATE, CAT). The platform tracks mental fatigue, exhaustion, and daily routine patterns to help students manage stress, avoid burnout, and discover hidden cognitive and emotional triggers.

---

## 2. Technical Stack & Architecture

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19) utilising Turbopack and Server Actions.
- **Styling**: Vanilla CSS with Tailwind CSS utilities. Utilises CSS custom variables (`oklch`) inside [globals.css](file:///Users/arjun/Desktop/arjun/manasutra/src/app/globals.css) for dynamic light/dark mode support.
- **Database**: [Firebase Firestore (Lite version)](https://firebase.google.com/docs/firestore) for extremely fast, stateless document querying.
- **AI Core**: [Google Gemini 2.5 Flash API](https://ai.google.dev/) (via the `@google/genai` client library) for emotional analysis, dialogue simulation, and pattern matching.
- **Visualisations**: [Recharts](https://recharts.org/) charts wrapped in responsive viewport structures.

---

## 3. Features & Data Flow

### A. AI Wellness Journal
- **Path**: `/` ([AIJournal.tsx](file:///Users/arjun/Desktop/arjun/manasutra/src/components/AIJournal.tsx))
- **Logic**: Students write text or record audio logs via the browser Speech Recognition API.
- **Analysis**: Submits logs to the `analyzeJournalEntry` server action. Gemini parses the log into structured JSON (dominant emotions, stress indicator list, burnout risk, confidence level, intensity, and triggers).
- **Storage**: Saves the sanitized text and analysis results into Firestore `journals` collection under the unique `userId`.

### B. Wellness Companion Chat
- **Path**: `/companion` ([CompanionChat.tsx](file:///Users/arjun/Desktop/arjun/manasutra/src/components/CompanionChat.tsx))
- **Logic**: Interactive chat panel offering real-time supportive dialogue.
- **Context**: Calls `chatWithCompanion` with the current chat history, guiding the AI wellness assistant to suggest coping mechanisms and motivational guidance while staying inside safe clinical boundaries.

### C. Predictive AI Alert & Hidden Triggers
- **Paths**: [PredictiveAlert.tsx](file:///Users/arjun/Desktop/arjun/manasutra/src/components/PredictiveAlert.tsx) / [TriggerEngine.tsx](file:///Users/arjun/Desktop/arjun/manasutra/src/components/TriggerEngine.tsx)
- **Logic**: Queries the last 7-15 journal documents from Firestore. Gemini compiles predictive trends ("Your stress risk may rise by 15% next week due to sleeping less") and formats distinct stress triggers.

### D. Study-Wellness Routine Balance
- **Path**: `/insights` ([StudyWellnessBalance.tsx](file:///Users/arjun/Desktop/arjun/manasutra/src/components/StudyWellnessBalance.tsx))
- **Logic**: Interactive evaluator where students input hours of study, sleep, and exercise. A server action validates bounds and outputs an optimized routine analysis.

### E. Exam Crisis Mode
- **Logic**: Automatically monitors the rolling burnout risk. If the score exceeds 80, [CrisisMode.tsx](file:///Users/arjun/Desktop/arjun/manasutra/src/components/CrisisMode.tsx) activates an immediate clinical/mental cooldown checklist.

---

## 4. Accessibility (a11y) & Security Standards

### Accessibility (WCAG 2.1 compliance)
- **Linked Input Elements**: All form controls in [StudyWellnessBalance.tsx](file:///Users/arjun/Desktop/arjun/manasutra/src/components/StudyWellnessBalance.tsx) must be linked to `<label>` elements via exact matching `id` and `htmlFor` properties.
- **Descriptive Labels**: Interactive components (buttons, textareas, inputs) must define `aria-label` or `aria-describedby` when labels are not explicitly visible.
- **Live Regions**: Submitting/loading overlays must configure `aria-live="polite"` to update assistive tools.

### Security
- **XSS Prevention**: Inputs must pass through `sanitizeText()` in [actions.ts](file:///Users/arjun/Desktop/arjun/manasutra/src/app/actions.ts). Only sanitized strings (`safeText`) may be saved to Firestore databases or supplied as input prompt segments.
- **Boundaries Validation**: All client variables sent to Server Actions must be boundary-checked (e.g. daily hours mapped strictly to the `[0, 24]` range) before being processed.
- **Resource Conservation**: Firestore collection queries must define strict document limits (`limit(30)`) to prevent unnecessary database load and query cost.

---

## 5. Testing & Verification

- Run unit tests with `npm test`.
- **Component Mocking**: Always mock layout-sensitive third-party packages in test suites (e.g., mock `recharts` to render standard `<svg>` and `<g>` groupings, mock `ScrollArea`, `Slider` and `framer-motion` to avoid layout warning logs).
- **State Updates**: Ensure all async test assertions are wrapped inside `await waitFor(...)` blocks to avoid un-act-wrapped React state warnings.

---

## 6. Next.js 16 & React 19 Developer Rules

- **Framework API deprecation notices**: Follow Next.js guidelines regarding file structure and Server Action serialization.
- **Pure Rendering**: Do not trigger impure functions (like `Math.random()`, date creators, or external calls) directly during render loops. Set initial values inside `useEffect` or wrap them inside state setters.
- **Card UI styling**: All cards must use the premium solid `.glass` CSS layout. Do not introduce custom translucent gradients or backdrop-blurs. Keep overlays clear and clean.

---
<!-- END:nextjs-agent-rules -->
