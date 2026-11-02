# 🚀 RapidAPI Listing Dossier: EpubCraft API

Use this cheat sheet to list **EpubCraft API** on the [RapidAPI Provider Studio](https://rapidapi.com/provider) in under 2 minutes.

---

## 1. General Information
* **API Name:** `EpubCraft API`
* **Short Description:** Headless EPUB 3 & Amazon KDP Compliant Document Compiler API
* **Category:** `Tools` (or `Media` / `Text Analysis`)
* **Logo Asset:** [`logo.png`](file:///c:/Users/jewel/Desktop/Tink/epub-craft-api/logo.png) *(1:1 square ratio ready)*
* **Website / Documentation URL:** `https://epub-craft-api.vercel.app`
* **Terms of Service:** Standard RapidAPI Terms

---

## 2. API Definition & Gateway Routing
* **Import Method:** Click **"Upload OpenAPI Spec"** and select:
  [`rapidapi-openapi.json`](file:///c:/Users/jewel/Desktop/Tink/epub-craft-api/rapidapi-openapi.json)
* **Base URL / Target Gateway:**
  ```text
  https://epub-craft-api.vercel.app
  ```
* **Endpoints Auto-Imported:**
  - `POST /v1/epub/compile` (Core)
  - `POST /v1/epub/validate` (Pre-flight)
  - `GET /v1/epub/sample.epub` (Instant Test Download)
  - `GET /v1/epub/themes` (Metadata & Presets)

---

## 3. Marketplace Long Description (Copy & Paste into Markdown Box)

```markdown
# 📚 EpubCraft API — Headless EPUB 3 & Amazon KDP Document Compiler

Compile raw **JSON, Markdown, and HTML** manuscripts into pristine, **100% EPUBCheck and Amazon KDP compliant EPUB archives** in under 50 milliseconds.

Building an EPUB compiler in-house is notoriously painful: uncompressed `mimetype` containers, OPF package manifests, NCX fallback navigation spines, XML namespace compliance, and Kindle styling bugs. **EpubCraft API** handles the entire packaging pipeline so you can focus on building your AI writing app, newsletter publishing engine, or documentation exporter.

---

### ⚡ Key Capabilities
- **100% Amazon KDP & Apple Books Compliant:** Passes EPUBCheck 4.x validation with zero warnings.
- **Dynamic 1600x2400 Cover Art:** Generates 5 luxury typographic SVG cover templates automatically if no custom cover is uploaded.
- **Built-in Typographic Themes:** Includes literary Bookerly, Heritage Garamond, Modern Ember, Cinematic Fantasy, and Executive Non-Fiction.
- **Drop Caps & Stylistic Formatting:** Automatic drop cap spans, scene break dividers (`✦ ✦ ✦`), blockquotes, code syntax highlighting, and table support.
- **Multi-Format Output:** Receive the raw binary file stream (`application/epub+zip`) or a JSON object with base64 data.
- **Edge Performance:** Sub-50ms compile velocity hosted on Vercel Serverless Edge.

---

### 🛠️ Quick Example Payload (POST /v1/epub/compile)

```json
{
  "title": "The Art of Strategy",
  "author": "Sun Tzu",
  "subtitle": "Principles of Leadership",
  "theme": "theme-bookerly",
  "coverPreset": "obsidian_gold",
  "sections": [
    {
      "title": "Chapter 1: Laying Plans",
      "chapterNumber": "Chapter I",
      "type": "chapter",
      "hasDropCap": true,
      "includeInToc": true,
      "content": "The art of war is of vital importance to the State..."
    }
  ]
}
```

---

### 🚀 Who Uses EpubCraft API?
- **AI Novel & Ebook Generators:** Instant export for ChatGPT, Claude, and Gemini long-form book writers.
- **Newsletters & Blogs:** Bundle top posts or monthly editions into downloadable eBooks.
- **Documentation Platforms:** Export GitBook / Docusaurus docs into portable offline EPUBs.
- **Author Platforms:** Automated formatting and pre-flight validation before uploading to KDP.
```

---

## 4. Monetization & Pricing Tiers

Navigate to **Plans & Pricing** in RapidAPI Provider Studio and configure these 4 tiers:

| Tier | Price | Monthly Quota | Overage Fee | Rate Limit |
| :--- | :--- | :--- | :--- | :--- |
| **Basic (Free)** | **$0.00** | 50 calls / mo | $0.05 / call | 5 requests / min |
| **Pro** | **$19.00 / mo** | 1,500 calls / mo | $0.02 / call | 60 requests / min |
| **Ultra** | **$49.00 / mo** | 10,000 calls / mo | $0.01 / call | 300 requests / min |
| **Mega** | **$149.00 / mo** | 50,000 calls / mo | $0.005 / call | 1,000 requests / min |

---

## 5. Security / Secret Handshake (Optional Vercel Protection)
* RapidAPI generates an **`X-RapidAPI-Proxy-Secret`** in your API gateway settings.
* To lock your Vercel endpoint so only paying RapidAPI subscribers can call it, add this secret to your Vercel project environment variables:
  * Variable Name: `RAPIDAPI_PROXY_SECRET`
  * Variable Value: *(Copy from RapidAPI Gateway settings)*
