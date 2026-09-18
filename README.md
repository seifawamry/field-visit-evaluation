# Field Visit Evaluation Tool

A modern, responsive single-page web application built with **React**, **Vite**, and **Tailwind CSS** for evaluating pharmaceutical and medical representatives during field visits.

![Field Visit Evaluation](https://img.shields.io/badge/React-19-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8-purple.svg)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)
![Icons](https://img.shields.io/badge/Icons-Lucide%20React-orange.svg)

---

## Features

- **Comprehensive 7-Part Assessment**:
  1. **Part 1: Assessment Details** &mdash; Assessor & Rep info, titles, date, territory/governorate, and visited account types.
  2. **Part 2: Medical Background & Product Knowledge** &mdash; Disease pathophysiology, product MoA & safety, clinical trials, handling medical inquiries.
  3. **Part 3: Market & Competitive Intelligence** &mdash; Patient flow & purchasing power, competitor activity tracking, pharmacy stock checks & prescription rates.
  4. **Part 4: Territory & Time Management** &mdash; Routing efficiency, briefing punctuality, call frequency targets, waiting-room vs. detailing balance.
  5. **Part 5: Sales Call Execution** &mdash; Pre-call planning, opening statement, probing, objection handling, commitment closing, post-call CRM logging.
  6. **Part 6: Marketing Messages & E-Detailing** &mdash; Tablet and materials readiness, strategy alignment, competitor positioning.
  7. **Part 7: Appearance, Language & Soft Skills** &mdash; Professional dress, speech clarity, vocal pacing, non-verbal posture, HCP & clinic rapport.
- **Action Planning**: Formulate SMART action plans for the next 30 days.
- **Automated Scoring & Grading Engine**:
  - Computes subscores for every category and total score out of 113.
  - Automatically calculates percentage and performance grading (*Exceptional*, *Exceeds Expectations*, *Meets Expectations*, or *Development Needed*).
- **Algorithmic Qualitative Feedback**:
  - Automatically highlights key strengths and coaching opportunities based on ratings.
- **Google Sheets Integration**:
  - Connect a Google Apps Script Web App URL to sync all evaluation entries directly into a Google Sheet in real time.
- **Print & PDF Export**:
  - Clean, dedicated print CSS styles.
  - Built-in one-click PDF generation using `html2pdf.js`.
  - Signature blocks for Evaluator and Medical Representative.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Export**: [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)

---

## Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+) and **npm** installed.

### Installation

1. Clone or navigate to the repository folder:
   ```bash
   cd field-visit-evaluation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser at the URL shown (typically `http://localhost:5173`).

### Production Build

To build the static production files for deployment:
```bash
npm run build
```
The optimized output will be in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## Exporting to GitHub

To push this project to your GitHub account:

1. **Create a new empty repository** on GitHub (e.g. `field-visit-evaluation`).
2. Run the following commands in the project root:
   ```bash
   # Initialize git if not already done
   git init -b main

   # Stage and commit all files
   git add .
   git commit -m "Initial commit: Field Visit Evaluation React application"

   # Link to your remote GitHub repository
   git remote add origin https://github.com/<your-username>/field-visit-evaluation.git

   # Push to main
   git push -u origin main
   ```

---

## Google Sheets Integration (Optional)

To automatically record evaluation results to Google Sheets:

1. Create a Google Sheet named `Nutrition-Field Visit Evaluation Responses`.
2. In Google Sheets, open **Extensions > Apps Script**.
3. Create a `doPost(e)` function that parses JSON data and appends rows with the evaluation fields.
4. Deploy the script as a **Web App** (Execute as: *Me*, Who has access: *Anyone*).
5. Copy the Web App URL (`https://script.google.com/macros/s/.../exec`).
6. Click **Google Sheet Settings** in the app header, paste the URL, and submit. The URL will be saved in your browser's local storage.
