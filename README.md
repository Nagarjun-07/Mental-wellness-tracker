# मनःसूत्र (ManaSutra) - AI Student Wellness Platform

**मनःसूत्र (ManaSutra)** is a full-stack, AI-powered mental wellness and exhaustion-tracking platform specifically designed for students preparing for high-stakes competitive examinations and board tests (e.g., JEE, NEET, UPSC, GATE, CAT, and board exams). 

By analyzing daily journal entries, wellness routines, and fatigue indicators, the platform exposes hidden stress triggers and cognitive burnout trends before they manifest as severe academic exhaustion.

---

## 🚀 Key Features & Modules

### 1. Cognitive Emotional Analysis Engine (AI Wellness Journal)
- **Speech-to-Text & Writing Panel**: Students type their thoughts or use the integrated Web Speech API for voice journaling.
- **Deep Sentiment Extraction**: Google Gemini 2.5 Flash API analyzes journal text to capture dominant emotions, emotional intensity, confidence metrics, and hidden stressors.
- **Stateless Database Integration**: Journal records are sanitized and indexed in Firebase Firestore Lite.

### 2. Empathetic Wellness Coach (Companion Chat)
- **Preserved Dialogue Context**: Students chat with a virtual assistant designed with supportive dialogue context boundaries.
- **Actionable Coping Mechanisms**: Offers real-time cognitive behavioral tools, guided breathing exercises, and motivational support tailored to academic stress.
- **Clinical Safety Boundaries**: Recognizes severe distress levels and safely directs students to professional resources.

### 3. Predictive AI Alert Engine
- **Rolling Stress Analysis**: Pulls the student's historical Firestore logs and utilizes Google Gemini to predict emotional burnout and stress swings for the next 7 days in a single actionable statement.

### 4. Hidden Triggers Engine
- **Cross-Journal Trend Analysis**: Automatically scans recent entries to isolate environmental or behavioral trigger groups (e.g. sleep deprivation, screen time, night study sessions) and generates confidence percentages.

### 5. Study-Wellness Routine Balance Check
- **Interactive Matrix**: Students log daily study hours, sleep durations, and exercise sessions.
- **Input Boundary Constraints Validation**: Secure server actions validate parameters and utilize Gemini to suggest routine optimizations.

### 6. Exam Crisis Mode Activation
- **Automated Cooldown Framework**: If rolling burnout indices surpass a critical score of 80, the interface triggers an immediate mental checklist (cooldown pauses, hydration guidelines, and deep breathing routines).

---

## 🛠️ Architecture & Technology Stack

- **Framework**: **Next.js 16** (utilizing React 19, Turbopack, and Server Actions).
- **Core Styles**: Modern Tailwind CSS utility styling configured with an oklch dark-mode palette.
- **Database Layer**: **Firebase Firestore Lite** for high-performance, stateless data writes.
- **AI Core**: **Google Gemini 2.5 Flash API** (utilizing `@google/genai` library client).
- **Visualizations**: **Recharts** charts rendering dynamic emotional timeline grids and exhaustion gauges.

---

## ♿ Accessibility (a11y) & Usability Standards

Designed strictly to align with **WCAG 2.1 AA** specifications:
- **Semantic HTML5 Layouts**: Implemented with `<aside>`, `<nav>`, `<main>`, `<svg>`, and `<g>` containers.
- **Linked Label Configurations**: Form elements map to text descriptions via explicit `id` and `htmlFor` variables.
- **Accessible Attributes**: Intermediary controllers include explicit `aria-label`, `aria-live="polite"`, and `aria-pressed` states.
- **Focus & Contrast Integrity**: High-contrast components with readable color palettes and visual focus rings.

---

## 🔒 Security Architecture

- **Cross-Site Scripting (XSS) Mitigation**: Journal inputs and messages undergo strict regex sanitization before database insertion to block stored and reflected XSS.
- **Boundary Validation Constraints**: Server Actions validate boundary thresholds (e.g., hours bound to `[0, 24]`) to prevent query injections or parameter manipulation.
- **Firestore Load Throttling**: Direct queries enforce stateless document bounds (`limit(30)`) to guard against token exhaustion and query floods.

---

## 🧪 Testing & Verification Strategy

- **Test Suite Framework**: Jest & React Testing Library.
- **Component Mocking**: Standard mocks isolate Framer Motion, Firebase collections, Gemini AI, and Recharts.
- **Pure State Updates**: Tests wrap state triggers in `await waitFor(...)` blocks to avoid un-act-wrapped React state alerts.
- **Linter Integration**: 100% clean ESLint checks ensure type safety.
