const { THEMES } = require('../lib/styles.js');
const { PRESETS } = require('../lib/coverGenerator.js');
const validateRapidApiSecret = require('../lib/auth.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host, X-RapidAPI-Proxy-Secret');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (!validateRapidApiSecret(req)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Unauthorized access',
      message: 'This endpoint must be accessed through RapidAPI Marketplace.',
      marketplace: 'https://rapidapi.com'
    }));
    return;
  }

  const coverPresetsList = Object.keys(PRESETS).map(key => ({
    id: key,
    palette: {
      background: [PRESETS[key].bg1, PRESETS[key].bg2],
      accent: PRESETS[key].accent,
      border: PRESETS[key].border
    },
    typography: PRESETS[key].fontTitle
  }));

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({
    success: true,
    typographyThemes: THEMES,
    coverPresets: coverPresetsList,
    paragraphStyles: [
      { id: 'style-indented', description: 'Traditional fiction book layout with 1.5em indent and no blank paragraph lines.' },
      { id: 'style-blocked', description: 'Modern non-fiction layout with no indent and 0.85em spacing between paragraphs.' }
    ],
    supportedSectionTypes: [
      'cover',
      'title_page',
      'copyright',
      'dedication',
      'epigraph',
      'foreword',
      'preface',
      'prologue',
      'chapter',
      'epilogue',
      'afterword',
      'conclusion',
      'acknowledgments',
      'about-author'
    ]
  }, null, 2));
};

