const JSZip = require('jszip');
const { marked } = require('marked');
const { BASE_STYLESHEET } = require('./styles.js');
const { generateSvgCover } = require('./coverGenerator.js');

const EpubEngine = {
  validateProject(book) {
    const issues = [];
    if (!book || typeof book !== 'object') {
      return { isValid: false, issues: [{ level: 'error', code: 'INVALID_PAYLOAD', text: 'Book manuscript payload must be a JSON object.' }] };
    }
    if (!book.title || !String(book.title).trim()) {
      issues.push({ level: 'error', code: 'TITLE_REQUIRED', text: 'Book title is required.' });
    }
    if (!book.author || !String(book.author).trim()) {
      issues.push({ level: 'warning', code: 'AUTHOR_MISSING', text: 'Author is empty, defaulting to Anonymous.' });
    }
    if (!Array.isArray(book.sections) || book.sections.length === 0) {
      issues.push({ level: 'error', code: 'NO_SECTIONS', text: 'Manuscript must contain at least one section or chapter in `sections`.' });
    }

    const tocSections = (book.sections || []).filter(s => s && s.includeInToc !== false);
    if (tocSections.length === 0 && book.sections && book.sections.length > 0) {
      issues.push({ level: 'warning', code: 'NO_TOC_SECTIONS', text: 'No sections are marked for the Table of Contents.' });
    }

    return {
      isValid: issues.filter(i => i.level === 'error').length === 0,
      issues
    };
  },

  escapeXml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  },

  makeValidXml(html) {
    if (!html) return '';
    return html
      .replace(/<br>/gi, '<br/>')
      .replace(/<hr([^>]*)>/gi, '<hr$1/>')
      .replace(/<img([^>]*)>/gi, (m) => m.endsWith('/>') ? m : m.replace(/>$/, '/>'))
      .replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
  },

  sanitizeManuscriptHtml(html) {
    if (!html) return '';
    return html
      .replace(/style\s*=\s*(["'])([\s\S]*?)\1/gi, (match, quote, styleStr) => {
        const cleaned = styleStr
          .replace(/(?:background(?:-color)?|color)\s*:[^;]+;?/gi, '')
          .trim();
        return cleaned ? `style="${cleaned}"` : '';
      })
      .replace(/<font\b[^>]*>/gi, '')
      .replace(/<\/font>/gi, '');
  },

  applyDropCapMarkup(html) {
    if (!html) return '';
    // Look for first <p> tag with text
    return html.replace(/<p\b([^>]*)>(\s*)([A-Za-z0-9"“'‘])([\s\S]*?)<\/p>/, (match, pAttrs, leadSpace, firstChar, rest) => {
      return `<p${pAttrs} class="first-paragraph">${leadSpace}<span class="drop-cap">${firstChar}</span>${rest}</p>`;
    });
  },

  normalizeChapterHeading(bodyHtml, title, showHeader) {
    if (!bodyHtml) return bodyHtml;
    const headingPattern = /^(\s*(?:<p>\s*(?:<br\s*\/?>|&nbsp;)?\s*<\/p>|<div[^>]*>|\s*)*)<h([12])\b[^>]*>([\s\S]*?)<\/h\2>(\s*)/i;
    const match = bodyHtml.match(headingPattern);

    if (match) {
      const leadingEmpty = match[1];
      const headingInner = match[3];
      const headingTextClean = headingInner.replace(/<[^>]+>/g, '').trim();

      const isChapterOrTitle = /^chapter\s+[0-9ivxlcdm]+/i.test(headingTextClean) ||
        /^chapter\b/i.test(headingTextClean) ||
        (title && headingTextClean.toLowerCase().includes(title.toLowerCase().substring(0, 10))) ||
        (title && title.toLowerCase().includes(headingTextClean.toLowerCase().substring(0, 10)));

      if (showHeader && isChapterOrTitle) {
        return bodyHtml.replace(headingPattern, leadingEmpty);
      }
    }
    return bodyHtml;
  },

  formatSectionContent(rawContent) {
    if (!rawContent) return '<p></p>';
    const trimmed = String(rawContent).trim();

    // If content looks like Markdown (no leading HTML tags), parse it
    if (!/^<[a-z][\s\S]*>/i.test(trimmed)) {
      return marked.parse(trimmed);
    }
    return trimmed;
  },

  async compile(book, options = {}) {
    const validation = this.validateProject(book);
    if (!validation.isValid) {
      const err = new Error('Manuscript validation failed: ' + validation.issues.map(i => i.text).join('; '));
      err.issues = validation.issues;
      throw err;
    }

    const zip = new JSZip();
    const bookId = book.identifier || book.id || 'urn:uuid:' + Math.random().toString(36).substring(2) + '-' + Date.now();
    const modifiedDate = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    const lang = book.language || 'en';
    const title = (book.title || 'Untitled Work').trim();
    const author = (book.author || 'Anonymous').trim();
    const publisher = (book.publisher || 'EpubCraft').trim();
    const description = (book.description || '').trim();

    // 1. mimetype (MUST be first, uncompressed "STORE")
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

    // 2. META-INF/container.xml
    const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
    zip.file('META-INF/container.xml', containerXml);

    // 3. OEBPS/styles/stylesheet.css
    const stylesheetContent = BASE_STYLESHEET + (options.customCss ? `\n\n/* Custom Overrides */\n${options.customCss}` : '');
    zip.file('OEBPS/styles/stylesheet.css', stylesheetContent);

    // 4. Cover Handling
    let coverMediaType = 'image/svg+xml';
    let coverExtension = 'svg';
    let coverData = null;

    if (book.coverImage && typeof book.coverImage === 'string') {
      if (book.coverImage.startsWith('data:')) {
        const parts = book.coverImage.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        if (mimeMatch) {
          coverMediaType = mimeMatch[1];
          coverExtension = coverMediaType.includes('png') ? 'png' : coverMediaType.includes('svg') ? 'svg' : 'jpg';
        }
        coverData = Buffer.from(parts[1], 'base64');
      } else if (book.coverImage.startsWith('<svg')) {
        coverMediaType = 'image/svg+xml';
        coverExtension = 'svg';
        coverData = Buffer.from(book.coverImage, 'utf8');
      }
    }

    // If no cover supplied, generate elegant typographic SVG cover
    if (!coverData) {
      coverMediaType = 'image/svg+xml';
      coverExtension = 'svg';
      const svgCover = generateSvgCover({
        title,
        subtitle: book.subtitle || '',
        author,
        coverPreset: book.coverPreset || options.coverPreset || 'obsidian_gold'
      });
      coverData = Buffer.from(svgCover, 'utf8');
    }

    zip.file(`OEBPS/images/cover.${coverExtension}`, coverData);

    // 5. OEBPS/text/cover.xhtml
    const coverXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${lang}">
<head>
  <title>Cover</title>
  <link rel="stylesheet" type="text/css" href="../styles/stylesheet.css"/>
  <style type="text/css">
    @page { padding: 0; margin: 0; }
    body { margin: 0; padding: 0; text-align: center; background-color: #000000; }
    .cover-svg { width: 100%; height: 100vh; max-width: 100%; max-height: 100vh; }
  </style>
</head>
<body>
  <div class="cover-wrapper" epub:type="cover">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="cover-svg" viewBox="0 0 1600 2400" preserveAspectRatio="xMidYMid meet">
      <image width="1600" height="2400" xlink:href="../images/cover.${coverExtension}"/>
    </svg>
  </div>
</body>
</html>`;
    zip.file('OEBPS/text/cover.xhtml', coverXhtml);

    // 6. Section XHTML Processing
    const manifestItems = [];
    const spineItems = [];
    const tocItems = [];

    // Manifest references for cover
    manifestItems.push(`<item id="cover-image" href="images/cover.${coverExtension}" media-type="${coverMediaType}" properties="cover-image"/>`);
    manifestItems.push(`<item id="cover-page" href="text/cover.xhtml" media-type="application/xhtml+xml" properties="svg"/>`);
    spineItems.push(`<itemref idref="cover-page" linear="yes"/>`);

    manifestItems.push(`<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`);
    manifestItems.push(`<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>`);
    manifestItems.push(`<item id="stylesheet" href="styles/stylesheet.css" media-type="text/css"/>`);

    const themeClass = book.theme || options.theme || 'theme-bookerly';
    const paragraphStyleClass = book.paragraphStyle || options.paragraphStyle || 'style-indented';

    book.sections.forEach((sec, idx) => {
      const fileId = `sec_${idx + 1}`;
      const fileName = `ch_${idx + 1}.xhtml`;
      manifestItems.push(`<item id="${fileId}" href="text/${fileName}" media-type="application/xhtml+xml"/>`);
      spineItems.push(`<itemref idref="${fileId}"/>`);

      const secTitle = (sec.title || `Section ${idx + 1}`).trim();
      const includeInToc = sec.includeInToc !== false;

      if (includeInToc) {
        const tocTitle = sec.chapterNumber ? `${sec.chapterNumber}: ${secTitle}` : secTitle;
        tocItems.push({
          title: tocTitle,
          href: `text/${fileName}`,
          id: fileId
        });
      }

      let contentBody = this.formatSectionContent(sec.content);
      contentBody = this.sanitizeManuscriptHtml(contentBody);

      const showHeader = sec.showHeader !== false;
      const secType = sec.type || 'chapter';

      if (secType === 'chapter') {
        contentBody = this.normalizeChapterHeading(contentBody, secTitle, showHeader);
      }

      if (sec.hasDropCap) {
        contentBody = this.applyDropCapMarkup(contentBody);
      }

      contentBody = this.makeValidXml(contentBody);

      let headerMarkup = '';
      if (showHeader) {
        headerMarkup = `
          <div class="chapter-header">
            ${sec.chapterNumber ? `<span class="chapter-number">${this.escapeXml(sec.chapterNumber)}</span>` : ''}
            <h1 class="chapter-title">${this.escapeXml(secTitle)}</h1>
            ${sec.subtitle ? `<div class="chapter-subtitle">${this.escapeXml(sec.subtitle)}</div>` : ''}
          </div>
        `;
      }

      const chapterXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${lang}">
<head>
  <title>${this.escapeXml(secTitle)}</title>
  <link rel="stylesheet" type="text/css" href="../styles/stylesheet.css"/>
</head>
<body class="${themeClass} ${paragraphStyleClass}">
  <section class="chapter-container" epub:type="${secType}">
    ${headerMarkup}
    ${contentBody}
  </section>
</body>
</html>`;

      zip.file(`OEBPS/text/${fileName}`, chapterXhtml);
    });

    // 7. OEBPS/nav.xhtml (EPUB 3 Navigation Document)
    const navXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${lang}">
<head>
  <title>Table of Contents</title>
  <link rel="stylesheet" type="text/css" href="styles/stylesheet.css"/>
</head>
<body class="${themeClass}">
  <nav epub:type="toc" id="toc">
    <h1 class="chapter-title">Table of Contents</h1>
    <ol>
      ${tocItems.map(item => `<li><a href="${item.href}">${this.escapeXml(item.title)}</a></li>`).join('\n      ')}
    </ol>
  </nav>
  <nav epub:type="landmarks" hidden="">
    <h2>Landmarks</h2>
    <ol>
      <li><a epub:type="cover" href="text/cover.xhtml">Cover</a></li>
      <li><a epub:type="toc" href="nav.xhtml">Table of Contents</a></li>
      ${tocItems.length > 0 ? `<li><a epub:type="bodymatter" href="${tocItems[0].href}">Start of Content</a></li>` : ''}
    </ol>
  </nav>
</body>
</html>`;
    zip.file('OEBPS/nav.xhtml', navXhtml);

    // 8. OEBPS/toc.ncx (EPUB 2 / Kindle Fallback Navigation)
    const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${this.escapeXml(bookId)}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${this.escapeXml(title)}</text>
  </docTitle>
  <docAuthor>
    <text>${this.escapeXml(author)}</text>
  </docAuthor>
  <navMap>
    <navPoint id="navpoint-cover" playOrder="1">
      <navLabel><text>Cover</text></navLabel>
      <content src="text/cover.xhtml"/>
    </navPoint>
    ${tocItems.map((item, i) => `
    <navPoint id="navpoint-${i + 2}" playOrder="${i + 2}">
      <navLabel><text>${this.escapeXml(item.title)}</text></navLabel>
      <content src="${item.href}"/>
    </navPoint>`).join('')}
  </navMap>
</ncx>`;
    zip.file('OEBPS/toc.ncx', tocNcx);

    // 9. OEBPS/content.opf (Master Package Document)
    const contentOpf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:identifier id="BookId">${this.escapeXml(bookId)}</dc:identifier>
    <dc:title>${this.escapeXml(title)}</dc:title>
    <dc:language>${this.escapeXml(lang)}</dc:language>
    <dc:creator id="creator">${this.escapeXml(author)}</dc:creator>
    <meta refines="#creator" property="role" scheme="marc:relators">aut</meta>
    <dc:publisher>${this.escapeXml(publisher)}</dc:publisher>
    ${description ? `<dc:description>${this.escapeXml(description)}</dc:description>` : ''}
    <meta property="dcterms:modified">${modifiedDate}</meta>
    <meta name="cover" content="cover-image"/>
    <meta property="ibooks:specified-fonts">true</meta>
  </metadata>
  <manifest>
    ${manifestItems.join('\n    ')}
  </manifest>
  <spine toc="ncx">
    ${spineItems.join('\n    ')}
  </spine>
  <guide>
    <reference type="cover" title="Cover" href="text/cover.xhtml"/>
    <reference type="toc" title="Table of Contents" href="nav.xhtml"/>
    ${tocItems.length > 0 ? `<reference type="text" title="Beginning" href="${tocItems[0].href}"/>` : ''}
  </guide>
</package>`;
    zip.file('OEBPS/content.opf', contentOpf);

    // 10. Generate Final Binary Buffer
    const epubBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
      mimeType: 'application/epub+zip'
    });

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'ebook';

    return {
      filename: `${slug}.epub`,
      sizeBytes: epubBuffer.length,
      buffer: epubBuffer,
      validation: {
        isValid: true,
        issues: validation.issues,
        chaptersCompiled: book.sections.length,
        tocEntries: tocItems.length,
        bookId,
        modifiedDate
      }
    };
  }
};

module.exports = EpubEngine;

