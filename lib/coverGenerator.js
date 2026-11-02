/**
 * Dynamic SVG Book Cover Generator for Amazon KDP
 * Ensures 1600x2400 resolution (1:1.5 KDP aspect ratio)
 */

const PRESETS = {
  obsidian_gold: {
    bg1: '#0a0d14',
    bg2: '#161b26',
    border: '#d4af37',
    title: '#f7e7b4',
    subtitle: '#c5b382',
    accent: '#d4af37',
    fontTitle: 'Cinzel, Georgia, serif'
  },
  midnight_sapphire: {
    bg1: '#07111e',
    bg2: '#102a45',
    border: '#38bdf8',
    title: '#ffffff',
    subtitle: '#93c5fd',
    accent: '#38bdf8',
    fontTitle: 'system-ui, sans-serif'
  },
  crimson_mystery: {
    bg1: '#1a050a',
    bg2: '#380c16',
    border: '#ef4444',
    title: '#ffffff',
    subtitle: '#fca5a5',
    accent: '#ef4444',
    fontTitle: 'Georgia, serif'
  },
  emerald_legacy: {
    bg1: '#06140f',
    bg2: '#12382b',
    border: '#10b981',
    title: '#ffffff',
    subtitle: '#a7f3d0',
    accent: '#10b981',
    fontTitle: 'Cinzel, serif'
  },
  minimalist_slate: {
    bg1: '#0f172a',
    bg2: '#1e293b',
    border: '#64748b',
    title: '#f8fafc',
    subtitle: '#cbd5e1',
    accent: '#38bdf8',
    fontTitle: 'system-ui, -apple-system, sans-serif'
  }
};

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text, maxCharsPerLine = 22) {
  const words = String(text || '').trim().split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function generateSvgCover(options = {}) {
  const title = options.title || 'Untitled Work';
  const author = options.author || 'Anonymous';
  const subtitle = options.subtitle || '';
  const presetKey = options.coverPreset && PRESETS[options.coverPreset] ? options.coverPreset : 'obsidian_gold';
  const theme = PRESETS[presetKey];

  const titleLines = wrapText(title, 20);
  const subtitleLines = wrapText(subtitle, 32);

  const titleStartY = 950 - ((titleLines.length - 1) * 60);

  const titleTspans = titleLines.map((line, idx) => 
    `<tspan x="800" y="${titleStartY + (idx * 110)}" text-anchor="middle">${escapeXml(line)}</tspan>`
  ).join('\n        ');

  const subtitleStartY = titleStartY + (titleLines.length * 110) + 40;
  const subtitleTspans = subtitleLines.map((line, idx) => 
    `<tspan x="800" y="${subtitleStartY + (idx * 55)}" text-anchor="middle">${escapeXml(line)}</tspan>`
  ).join('\n        ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 2400" width="1600" height="2400">
  <defs>
    <linearGradient id="coverBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="50%" stop-color="${theme.bg2}"/>
      <stop offset="100%" stop-color="${theme.bg1}"/>
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1600" height="2400" fill="url(#coverBg)"/>

  <!-- Ornate Decorative Frame -->
  <rect x="70" y="70" width="1460" height="2260" fill="none" stroke="${theme.border}" stroke-width="4" opacity="0.8"/>
  <rect x="90" y="90" width="1420" height="2220" fill="none" stroke="${theme.border}" stroke-width="1.5" opacity="0.5"/>

  <!-- Corner Flourishes -->
  <path d="M 120 180 L 120 120 L 180 120" fill="none" stroke="${theme.accent}" stroke-width="3"/>
  <path d="M 1480 180 L 1480 120 L 1420 120" fill="none" stroke="${theme.accent}" stroke-width="3"/>
  <path d="M 120 2220 L 120 2280 L 180 2280" fill="none" stroke="${theme.accent}" stroke-width="3"/>
  <path d="M 1480 2220 L 1480 2280 L 1420 2280" fill="none" stroke="${theme.accent}" stroke-width="3"/>

  <!-- Top Seal / Insignia -->
  <circle cx="800" cy="380" r="48" fill="none" stroke="${theme.accent}" stroke-width="2" opacity="0.6"/>
  <circle cx="800" cy="380" r="38" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.4"/>
  <text x="800" y="392" text-anchor="middle" font-family="${theme.fontTitle}" font-size="34" fill="${theme.accent}" letter-spacing="4">❖</text>

  <!-- Title -->
  <text font-family="${theme.fontTitle}" font-size="88" font-weight="700" fill="${theme.title}" letter-spacing="2" filter="url(#softGlow)">
    ${titleTspans}
  </text>

  <!-- Subtitle -->
  ${subtitle ? `
  <text font-family="${theme.fontTitle}" font-size="38" font-style="italic" fill="${theme.subtitle}" letter-spacing="1">
    ${subtitleTspans}
  </text>` : ''}

  <!-- Divider Ribbon -->
  <line x1="600" y1="${subtitle ? subtitleStartY + (subtitleLines.length * 55) + 60 : titleStartY + (titleLines.length * 110) + 60}" x2="1000" y2="${subtitle ? subtitleStartY + (subtitleLines.length * 55) + 60 : titleStartY + (titleLines.length * 110) + 60}" stroke="${theme.border}" stroke-width="2" opacity="0.7"/>

  <!-- Author byline -->
  <text x="800" y="2100" text-anchor="middle" font-family="${theme.fontTitle}" font-size="44" font-weight="600" fill="${theme.title}" letter-spacing="4">
    ${escapeXml(author).toUpperCase()}
  </text>
</svg>`;
}

module.exports = {
  PRESETS,
  generateSvgCover
};

