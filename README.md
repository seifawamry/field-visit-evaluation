# Field Visit Evaluation Tool

A modern, responsive web application for evaluating pharmaceutical and medical representatives during field visits.

![Field Visit Evaluation](https://img.shields.io/badge/React-19-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8-purple.svg)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)
![Icons](https://img.shields.io/badge/Icons-Lucide%20React-orange.svg)
![Mobile Ready](https://img.shields.io/badge/Mobile-Compatible-success.svg)

---

## How to Open and Use

### Option 1: Double-Click Direct Launch (No Terminal / No Server Needed)
You can open the app **immediately** by double-clicking:
👉 **`field-visit-app.html`** (or `dist/index.html`)

This is a 100% standalone, self-contained single-file bundle containing all React components, Tailwind styles, and Lucide icons inlined. It works in any browser (Chrome, Edge, Safari, Firefox) on laptops, tablets, and phones without running Node.js or a server, and without CORS / blank-page issues.

---

### Option 2: One-Click Windows Launcher (`start.bat`)
Double-click **`start.bat`** in the project directory.
It will:
1. Launch the local development server with network sharing enabled (`--host`).
2. Automatically open `http://localhost:5173` in your default browser.

---

### Option 3: Command Line (Developer Mode)

```powershell
# 1. Navigate to project
cd field-visit-evaluation

# 2. Start dev server
npm run dev

# 3. Build standalone production bundle
npm run build
```

---

## Mobile Compatibility

The application is built and tested for mobile devices:
- **Responsive Layout**: Adapts seamlessly to smartphone screens (360px+), tablets, and desktop displays.
- **Touch-Friendly Controls**: 44px+ tap targets on rating buttons, large Yes/No selection pills, and smooth collapsible accordion cards.
- **iOS Safari Optimized**: Form input font sizing is calibrated to prevent automatic unwanted iOS Safari viewport zooming.
- **Network Sharing**: Run `start.bat` or `npm run dev -- --host` and access the tool from your phone browser via the displayed Network URL (e.g. `http://192.168.1.X:5173`).
- **Mobile Print & Save PDF**: Generates formatted evaluation reports directly on mobile or desktop.

---

## Features

- **7-Part Comprehensive Assessment**:
  1. **Part 1: Assessment Details** &mdash; Assessor, Representative, titles, date, territory, and visited accounts.
  2. **Part 2: Medical Background & Product Knowledge** &mdash; Disease pathophysiology, product MoA & safety, clinical trials, medical inquiries handling.
  3. **Part 3: Market & Competitive Intelligence** &mdash; Market dynamics, competitor intelligence checklist, pharmacy stock checks & prescription feedback.
  4. **Part 4: Territory and Time Management** &mdash; Routing efficiency, punctuality, call frequency targets, waiting-room vs. detailing balance.
  5. **Part 5: Sales Call Execution** &mdash; Pre-call planning, opening statement, probing, objection handling, commitment closing, CRM logging.
  6. **Part 6: Marketing Messages & E-Detailing** &mdash; Material readiness checklist, strategic messaging, product positioning.
  7. **Part 7: Appearance, Language, and Soft Skills** &mdash; Professional dress, speech clarity, vocal pacing, non-verbal posture, HCP & clinic rapport.
- **SMART 30-Day Action Plan**: Input field for structured developmental goals.
- **Automated Scoring & Grading Engine**:
  - Calculates subscores for each section and total score out of 113.
  - Automatically calculates percentage and performance grading (*Exceptional*, *Exceeds Expectations*, *Meets Expectations*, or *Development Needed*).
- **Algorithmic Qualitative Feedback**:
  - Automatically identifies key strengths and coaching areas based on scores.
- **Google Sheets Integration**:
  - Connect a Google Apps Script Web App URL to sync all submissions directly into a Google Sheet in real time.
- **Print & PDF Export**:
  - Clean print CSS styles and one-click PDF generation via `html2pdf.js`.
  - Signature blocks for Evaluator and Medical Representative.

---

## Exporting to GitHub

To push this project to your GitHub account:

```powershell
cd field-visit-evaluation

# Stage and commit all updates
git add .
git commit -m "Enhance mobile compatibility and standalone HTML support"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# Push to main branch
git push -u origin main
```
