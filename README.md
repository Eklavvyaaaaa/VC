# Antigravity 🪐

**Antigravity** is a next-generation discovery and intelligence platform built for modern Venture Capital analysts. It replaces scattered spreadsheets and manual data entry with a streamlined, editorial interface that actively hydrates company profiles using live web data and AI analysis.

---

### 🚀 Core Features

- **Live Dealflow Generation:** Dynamically pulls the top 50 highly-voted technology companies directly from the ProductHunt GraphQL API in real-time.
- **Agentic Enrichment:** Employs an on-demand AI pipeline for deep-diving into companies.
  - Uses **Firecrawl** to silently scrape the company's live DOM and convert it to clean markdown.
  - Uses **Groq (Llama-3.1-8b)** to synthesize the markdown, extracting real-world tags, summaries, and derived business signals.
- **Editorial Design System:** A handcrafted, premium typography-focused UI inspired by Notion and Stripe. Built without heavy shadows, gradients, or glassmorphism to prioritize readability and intelligence density.
- **Local Persistence & Pipelines:** Create custom thematic lists (e.g., "AI Infra", "Q1 Targets") and save companies directly into them. All actions, including notes, are safely stored and hydrated via the browser's native Local Storage.

---

### 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Root Variable Theme)
- **Typography:** `Instrument Serif`, `DM Sans`, and `IBM Plex Mono` (via `next/font/google`)
- **Icons:** Lucide React
- **AI Infrastructure:** Groq SDK + Firecrawl API

---

### ⚙️ Local Development Setup

#### 1. Requirements
Ensure you have Node.js and `npm` installed on your machine.

#### 2. Clone and Install
```bash
git clone https://github.com/Eklavvyaaaaa/VC.git antigravity
cd antigravity
npm install
```

#### 3. Environment Variables
Create a `.env.local` file in the root directory of the project. You will need to obtain API keys for the three core data pipelines:

```env
# ProductHunt Developer Token (GraphQL)
PRODUCTHUNT_API_KEY=your_producthunt_key

# Firecrawl API Key (Web Scraping)
FIRECRAWL_API_KEY=your_firecrawl_key

# Groq API Key (LLM Synthesis)
GROQ_API_KEY=your_groq_key
```
> **Security Note:** These keys are strictly read by the Next.js backend API routes (`/api/companies` and `/api/enrich`) and are never exposed to the client browser.

#### 4. Run the Server
Start the Next.js fast development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

### 📂 Architecture Overview

- `/src/components`: Top-level static structural shell elements (`Sidebar.tsx`, `Header.tsx`).
- `/src/lib`: Data wrappers and LocalStorage controllers (`producthunt.ts`, `storage.ts`, `data.ts`).
- `/src/app/api`: NextJS API Routes acting as secure proxies to prevent client-side CORS and API Key exposure (`/api/companies`, `/api/enrich`).
- `/src/app/companies/[id]`: The heavy-lifting intelligence view containing the dual-column layout and the AI Enrichment triggering interface.

---

*Designed and engineered for speed, utility, and absolute conviction.*
