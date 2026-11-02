const fs = require('fs');
const path = require('path');
const EpubEngine = require('./lib/epubEngine.js');
const sampleBook = require('./lib/sampleBook.js');

async function runTest() {
  console.log('Testing EpubEngine compilation...');
  try {
    const result = await EpubEngine.compile(sampleBook);
    console.log('✅ Compilation succeeded!');
    console.log('Filename:', result.filename);
    console.log('Size:', result.sizeBytes, 'bytes');
    console.log('Validation:', JSON.stringify(result.validation, null, 2));

    const outputPath = path.join(__dirname, 'test_output.epub');
    fs.writeFileSync(outputPath, result.buffer);
    console.log('Saved test EPUB to:', outputPath);
  } catch (err) {
    console.error('❌ Compilation failed:', err);
    process.exit(1);
  }
}

runTest();

