# MahaSahayak (महासहायक)

> **"Government Services, Simplified for Every Citizen."**
> 
> *शासकीय सेवा, प्रत्येक नागरिकासाठी सोप्या पद्धतीने.*

---

## 🇮🇳 Project Vision

**MahaSahayak** is an AI-powered citizen guidance and navigation engine designed specifically for **Maharashtra, India**.

Navigating government portals like Aaple Sarkar, UIDAI, and Parivahan can be overwhelming due to bureaucratic jargon, ambiguous eligibility criteria, and confusing document requirements. Citizens often turn to unauthorized touts who charge exorbitant fees.

**MahaSahayak changes this:**
Citizens can explain their situation in natural everyday language (in **English**, **मराठी (Marathi)**, or **हिन्दी (Hindi)**) or upload an official utility bill, notice, or document. MahaSahayak's AI engine instantly pinpoints the exact government service, provides an interactive document preparation checklist, guides them with step-by-step instructions, links directly to the official government portal, and provides curated search-based video tutorials.

---

## 🚀 Key Features

### 1. 🔍 Natural Language AI Requirement Understanding
- Citizens can type queries such as:
  - *"I want to update my address after moving to Pune"*
  - *"Need income certificate for engineering scholarship"*
  - *"माझ्या मुलाच्या शाळेसाठी उत्पन्नाचा दाखला कसा काढायचा?"*
  - *"ड्राइविंग लाइसेंस का नवीनीकरण कैसे करें?"*
- Powered by Google Gemini 2.5 Flash API with structured JSON output.
- **Fail-safe fallback**: An intelligent local rule and semantic knowledge base runs offline or when no API key is provided, ensuring reliable demo execution.

### 2. 📄 Document & Requirement Upload (Safe & Private)
- Upload files in **PDF**, **JPG**, **PNG**, or **TXT** format (up to 5 MB).
- In-browser file preview with thumbnail display.
- Optional natural language situation notes.
- **Strict Privacy Safeguards**:
  - Zero storage of Aadhaar numbers, PANs, passwords, or bank OTPs.
  - Client-side in-session processing only.
  - Mandatory citizen privacy consent acknowledgment before analysis.

### 3. 📋 Interactive Service Assistant Dashboard
- **Overview**: Plain-language description, statutory eligibility conditions, and fraud-prevention warnings.
- **Required Documents Checklist**: Interactive checkboxes with a real-time readiness progress bar (e.g., *"3 of 6 documents ready"*).
- **Step-by-Step Process**: Clean numbered timeline mapping the entire application lifecycle from portal registration to certificate download.
- **Official Links**: Clickable links to verified government servers ending in `.gov.in` and `.nic.in`.
- **Search-Based Video Tutorials**: Direct search URLs to verified YouTube walk-throughs and official channels (MahaOnline, UIDAI, Parivahan).
- **Interactive FAQs & Follow-up AI**: Ask custom follow-up questions for instant guidance.
- **Print / Save Checklist**: One-click printable checklist formatted for offline use.

### 4. 🏛️ Maharashtra & Central Service Directory
- Searchable and filterable catalog including:
  1. **Income Certificate** (*उत्पन्नाचा दाखला*) — Revenue Dept, Maharashtra
  2. **Caste Certificate** (*जातीचे प्रमाणपत्र*) — Revenue & Social Justice Dept
  3. **Domicile Certificate** (*अधिवास प्रमाणपत्र*) — 15 years Maharashtra residence proof
  4. **Non-Creamy Layer Certificate (NCL)** (*नॉन-क्रिमीलेअर*) — OBC/VJNT/SBC quota
  5. **Birth Certificate** (*जन्म प्रमाणपत्र*) — Civil Registration System (CRS)
  6. **Death Certificate** (*मृत्यू प्रमाणपत्र*) — CRS & Municipal Corporations
  7. **Ration Card Services** (*रेशन कार्ड सेवा*) — MahaFood RCMS
  8. **Aadhaar Services** (*आधार सेवा*) — UIDAI myAadhaar
  9. **Driving Licence Services** (*वाहन परवाना*) — Parivahan Sarathi (MoRTH & RTO)
  10. **PAN Card Services** (*पॅन कार्ड सेवा*) — Income Tax Department & NSDL
  11. **Aaple Sarkar Citizen Services Hub** (*आपले सरकार*) — Single-window state delivery portal

### 5. 🌐 Trilingual Accessibility
- Full native UI support for:
  - **English**
  - **मराठी (Marathi)**
  - **हिन्दी (Hindi)**
- Instant language toggle in the navigation bar and hero section with localStorage persistence.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (with custom Deep Navy `#0A2240`, Saffron `#FF9933`, and Green `#138808` government-tech palette)
- **Icons**: Lucide React
- **AI Integration**: Google Gen AI SDK (`@google/genai`) with Gemini 2.5 Flash
- **Linter**: Oxlint (0 warnings, 0 errors)

---

## 📦 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/mahasahayak.git
cd mahasahayak
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note**: If `VITE_GEMINI_API_KEY` is not provided or remains a placeholder, MahaSahayak will automatically activate its built-in verified Maharashtra knowledge base matcher.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

### 5. Lint
```bash
npm run lint
```

---

## 🛡️ Official Disclaimer

*MahaSahayak is an independent citizen assistance platform built for an innovation challenge and is not affiliated with or endorsed by any government authority. Information is provided for guidance only. Always verify current requirements through official government portals (`.gov.in`).*
