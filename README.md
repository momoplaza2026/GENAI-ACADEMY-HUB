# 🎓 GenAI Academy & Hub

A dual-purpose, state-of-the-art AI research workspace and interactive learning hub designed for casual readers and deep-dive machine learning researchers. 

This monorepo brings together advanced AI interactions, side-by-side document analysis, real-time presentation generation, and automated vector search capabilities into a unified, high-performance web interface.

---

## 🚀 Key Features

### 1. ⇔ Synced side-by-side Document Comparison
* Compare two academic papers simultaneously.
* **Synchronized Scroll**: Navigate through two PDF views in lockstep.
* **Topic Comparison Modal**: Generates side-by-side comparisons of core focus, research domains, authors, timeline, and abstract metrics.
* **Report Exporter**: Download compiled comparative text files (`Comparison_Report.txt`) for offline study.

### 2. ⚡ AI Presentation Maker (PPTX Generator)
* Converts academic papers or custom text topics into structured slide decks instantly.
* **Dynamic Layouts**: Generates Executive Summary, Objectives, Scope, Timeline, Resource Allocation, and Conclusion slides.
* **Image Extractor**: Pulls charts/figures directly from source PDF files and displays them in slides.
* **Interactive Presentation Viewer**: Play, pause, or manually step through animated slides in full-screen modes.
* **Native Download**: Generates fully-styled, editable `.pptx` presentations using `pptxgenjs`.

### 3. 🕸️ Interactive System Architecture Visualizer
* Generates live flowchart diagrams representing a paper's system architecture.
* Automatically parses abstract data to detect inputs (images, language, audio), preprocessing layers (embeddings, tokenization), core models (Transformers, CNNs, GNNs, Diffusion, etc.), outputs, and metrics.
* Displays responsive diagrams rendered via `mermaid` with zoom, pan, and SVG download capability.

### 4. 🧠 Hybrid Vector RAG Chatbot
* **Document Ingestion**: Extracts text from papers (using arXiv HTML translation servers for layout fidelity).
* **Local Embedding Cache**: Computes chunk embeddings and stores them as local JSON cache files (in `data/rag-cache` or Vercel's `/tmp` in serverless).
* **Gemini Integration**: Utilizes `gemini-embedding-2` for similarity dot-products and `gemini-3.5-flash` for generative QA.
* **Algorithmic Fallback**: Operates fully offline/without API keys using local NLP string similarity metrics.

### 5. 🔊 High-Fidelity Text-To-Speech (TTS) Deck
* **Full-Paper Audio**: Listen to entire research papers, abstracts, or custom sections.
* **Clipboard Reader**: Highlight a paragraph in the PDF, copy it, and hit "Read Copied Text" to generate speech on-the-fly.
* **Advanced Aggregator API**: Circumvents Google Translate API's length limits by tokenizing text on word boundaries, fetching speech segments in parallel, and stitching buffers into a single high-quality `.mp3` stream.
* **Audio Deck UI**: Custom player bar with play, pause, speed control, and navigation features.

### 6. 📝 AI Note Sharer Workspace
* **Visual Notes**: Write rich markdown notes styled with customizable gradients and glassmorphism.
* **Database-Less Sharing**: Encodes and serializes the complete note content and aesthetic configuration directly into a URL-safe base64 string. Share the hyperlink to share the note instantly without server storage.
* **Synthesized Voice Over**: Generates immediate TTS speech guides of your notes for accessible proofing.

### 7. 🕷️ Automated arXiv Scraper & Seeder
* Queries arXiv API automatically for the latest machine learning and computational linguistics publications.
* Downloads full PDFs, creates structured databases, and seeds metadata records.

---

## 🛠️ Tech Stack

### Monorepo Structure & Tools
* **PackageManager**: npm Workspaces
* **Frontend Framework**: Next.js 16 (App Router), React 19, TypeScript
* **Styling**: Tailwind CSS v4, Lucide Icons, Glassmorphic UI design
* **Database & ORM**: PostgreSQL, Prisma ORM (with `pgvector` compatibility)
* **Libraries**:
  * `@google/genai` (Official Google Gemini API)
  * `pptxgenjs` (Client-side presentation builder)
  * `jspdf` (PDF assembly utilities)
  * `mermaid` (SVG diagram rendering)
  * `react-virtual` (Virtual rendering of large paper libraries)

---

## 📂 Project Structure

```
my-genai-hub/
├── apps/
│   └── web/                   # Next.js 16 web application UI & API endpoints
│       ├── src/
│       │   ├── app/           # App router layouts, page components & API routes
│       │   ├── components/    # Reusable UI controls (Modals, Audio Deck, Chat)
│       │   ├── lib/           # Core helpers (RAG logic, NLP, courses utils)
│       │   └── data/          # Local RAG cache folder
│       └── package.json
├── packages/
│   ├── database/              # PostgreSQL Prisma schema configuration
│   │   └── prisma/
│   │       └── schema.prisma  # Resource schemas and relations
│   ├── scrapers/              # Node/TS scripts for arXiv queries & DB seeding
│   └── tts/                   # Background audio synthesis packages
├── docker-compose.yml         # Dev database config (Postgres)
├── package.json               # Monorepo configuration
└── README.md                  # System instruction and documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in `apps/web/` (or set them globally in your system environment):

| Variable | Description | Required / Optional |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string (e.g. `postgresql://user:pass@localhost:5432/hub`) | **Required** |
| `GEMINI_API_KEY` | Google AI Studio Developer key for LLM & embeddings. | **Optional** (App falls back to NLP if empty) |
| `PROXY_URL` | Route queries through proxy if accessing behind corporate walls. | **Optional** |

---

## ⚡ Getting Started

Ensure you have **Node.js 20+** and **Docker** installed.

### 1. Install Workspace Dependencies
Execute the command below from the root of the project:
```bash
npm install
```

### 2. Start PostgreSQL Database
Boot up the pre-configured database instance via Docker Compose:
```bash
docker-compose up -d
```

### 3. Initialize the Schema
Migrate and sync the schema with the local database:
```bash
# Generate Prisma Client
npm run prisma:generate --workspace=@my-genai-hub/database

# Push the schema to PostgreSQL
npm run prisma:push --workspace=@my-genai-hub/database
```

### 4. Seed Seed Data & Scrape papers
Add baseline learning courses and scrape computer science papers:
```bash
# Seed default courses
npm run seed --workspace=@my-genai-hub/scrapers

# Query and save latest arXiv publications
npm run dev --workspace=@my-genai-hub/scrapers
```

### 5. Launch the Development Server
Start the frontend interface:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) inside your web browser.

---

## 🔮 RAG & Caching Mechanism

To optimize performance and avoid repeating API calls, the vector database operates on a local cache:
1. **HTML Parsing**: When a user opens a research paper, the backend scrapes the arXiv HTML translation page.
2. **Text Cleansing**: Formulas, formatting anomalies, and LaTeX codes are stripped out to retain clean text.
3. **Embedding Batching**: Chunks are processed via `gemini-embedding-2` in parallel batches to prevent rate-limiting.
4. **Local DB Saving**: The resulting vector array is saved as a JSON file inside the `data/rag-cache/` directory. Subsequent prompts load the data instantaneously from the disk cache.
