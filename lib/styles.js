/**
 * PressCraft / EpubCraft Master Stylesheet
 * Engineered for 100% Amazon KDP, Apple Books, Kobo & E-Reader Compatibility
 */
const BASE_STYLESHEET = `@charset "utf-8";
@page {
  margin: 5pt;
}

html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  margin: 0;
  padding: 0;
  line-height: 1.6;
  text-rendering: optimizeLegibility;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
}

/* Typography Themes */
body.theme-bookerly {
  font-family: "Bookerly", "Charis SIL", "Georgia", "Palatino", serif;
  color: #1a1a1a;
}

body.theme-garamond {
  font-family: "EB Garamond", "Garamond", "Baskerville", "Times New Roman", serif;
  color: #151515;
}

body.theme-ember {
  font-family: "Amazon Ember", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #111111;
  line-height: 1.65;
}

body.theme-fantasy {
  font-family: "Crimson Pro", "Minion Pro", "Georgia", serif;
  color: #181512;
}
body.theme-fantasy h1, 
body.theme-fantasy h2,
body.theme-fantasy .chapter-number {
  font-family: "Cinzel", "Cinzel Decorative", "Trajan Pro", serif;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

body.theme-nonfiction {
  font-family: "Merriweather", "Georgia", serif;
  color: #1a1a1a;
  line-height: 1.7;
}
body.theme-nonfiction h1,
body.theme-nonfiction h2,
body.theme-nonfiction h3 {
  font-family: "Inter", -apple-system, "Segoe UI", sans-serif;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* Paragraph Formatting */
body.style-indented p {
  text-indent: 1.5em;
  margin-top: 0;
  margin-bottom: 0;
  text-align: justify;
}
body.style-indented p.first-paragraph,
body.style-indented .chapter-header + p,
body.style-indented .scene-break + p {
  text-indent: 0;
}

body.style-blocked p {
  text-indent: 0;
  margin-top: 0;
  margin-bottom: 0.85em;
  text-align: left;
}

/* Headings & Headers */
.chapter-header {
  text-align: center;
  margin: 3.5rem 0 2.5rem 0;
  page-break-inside: avoid;
}

.chapter-number {
  display: block;
  font-size: 0.95rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #666666;
  margin-bottom: 0.5rem;
}

.chapter-title {
  font-size: 1.85rem;
  font-weight: 700;
  margin: 0.25rem 0 0.5rem 0;
  line-height: 1.25;
}

.chapter-subtitle {
  font-size: 1.05rem;
  font-style: italic;
  color: #555555;
  margin-top: 0.5rem;
}

/* Drop Caps */
.drop-cap {
  float: left;
  font-size: 3.6em;
  line-height: 0.8;
  padding-top: 0.08em;
  padding-right: 0.12em;
  padding-bottom: 0.02em;
  font-family: inherit;
  font-weight: bold;
}

/* Scene Breaks & Dividers */
.scene-break {
  text-align: center;
  margin: 2rem 0;
  font-size: 1.2rem;
  letter-spacing: 0.35em;
  color: #777777;
  page-break-inside: avoid;
}

/* Quotes, Code, Lists */
blockquote {
  margin: 1.5rem 1.5rem;
  padding-left: 1rem;
  border-left: 3px solid #999999;
  font-style: italic;
  color: #333333;
}

pre, code {
  font-family: "JetBrains Mono", "Courier New", Courier, monospace;
  font-size: 0.9em;
  background-color: #f4f4f4;
  border-radius: 3px;
}
pre {
  padding: 0.85rem;
  overflow-x: auto;
  margin: 1rem 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}
th, td {
  border: 1px solid #cccccc;
  padding: 0.5rem 0.75rem;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem auto;
}
`;

const THEMES = [
  { id: 'theme-bookerly', name: 'Kindle Bookerly (Literary Fiction)', font: 'Bookerly, Georgia, serif' },
  { id: 'theme-garamond', name: 'Heritage Garamond (Classic Literature)', font: 'EB Garamond, Garamond, serif' },
  { id: 'theme-ember', name: 'Modern Ember (Clean Non-Fiction / Tech)', font: 'Amazon Ember, Inter, sans-serif' },
  { id: 'theme-fantasy', name: 'Cinematic / Fantasy (Ornate Display)', font: 'Crimson Pro, Cinzel, serif' },
  { id: 'theme-nonfiction', name: 'Executive Editorial (Crisp Non-Fiction)', font: 'Merriweather, Inter, serif' }
];

module.exports = {
  BASE_STYLESHEET,
  THEMES
};
