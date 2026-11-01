# 📚 EpubCraft API
### Headless EPUB 3 & Amazon KDP Document Compiler API

Turn raw JSON, Markdown, and HTML manuscripts into pristine, 100% EPUBCheck, Amazon KDP, and Apple Books compliant EPUB archives in under 50ms.

---

## ⚡ Key Capabilities
- **Standards Compliant:** EPUB 3.2 + legacy EPUB 2 NCX spine fallback for older Kindle devices.
- **KDP-Ready:** Generates uncompressed `mimetype`, `META-INF/container.xml`, and clean `content.opf`.
- **Typographic Themes:** Kindle Bookerly, Heritage Garamond, Modern Ember, Cinematic Fantasy, and Executive Non-Fiction.
- **Dynamic Cover Art:** Auto-generates 1600×2400 KDP-ratio SVG covers with 5 luxury presets if no custom cover is supplied.
- **Drop Caps & Formatting:** Built-in drop cap insertion, scene dividers, blockquotes, code blocks, and table styling.
- **Fast Execution:** Sub-50ms serverless compilation on Vercel Edge.

---

## 🚀 Commercial Endpoints
- `POST /v1/epub/compile` — Compiles manuscript into binary `.epub` or base64 JSON.
- `POST /v1/epub/validate` — Pre-flight audit, word count, reading time, and structural check.
- `GET /v1/epub/sample.epub` — Instant test download of pre-compiled book.
- `GET /v1/epub/themes` — Metadata listing available typography themes and cover templates.
- `POST /api/sandbox` — Public sandbox endpoint for developer console testing.

---

## 🛠️ Local Development
```bash
npm install
npm test
npm start
```
Server runs at `http://localhost:3007`.
Live interactive developer console available at `/index.html`.
