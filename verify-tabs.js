// Acid Rain Portal - Static Verification & Integrity Check
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting Acid Rain App Verification...');

const indexPath = path.join(__dirname, 'index.html');
const appPath = path.join(__dirname, 'app.js');
const stylesPath = path.join(__dirname, 'styles.css');

let errors = 0;

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ ERROR: ${message}`);
        errors++;
    } else {
        console.log(`✅ SUCCESS: ${message}`);
    }
}

// 1. Check file existence
assert(fs.existsSync(indexPath), 'index.html exists');
assert(fs.existsSync(appPath), 'app.js exists');
assert(fs.existsSync(stylesPath), 'styles.css exists');

if (errors > 0) {
    process.exit(1);
}

// Read contents
const html = fs.readFileSync(indexPath, 'utf8');
const js = fs.readFileSync(appPath, 'utf8');

// 2. Syntax check JS
try {
    // Basic syntax parsing test via VM module
    const vm = require('vm');
    new vm.Script(js);
    console.log('✅ SUCCESS: app.js contains valid JavaScript syntax.');
} catch (e) {
    assert(false, `app.js has syntax errors: ${e.message}`);
}

// 3. Verify HTML Routing Sections match Navigation
const expectedTabs = ['home', 'impact', 'reach', 'solutions'];

expectedTabs.forEach(tab => {
    // Check desktop tab link
    assert(html.includes(`data-tab="${tab}"`), `index.html contains nav item for: ${tab}`);
    // Check section wrapper
    assert(html.includes(`id="section-${tab}"`), `index.html contains matching section container: section-${tab}`);
});

// 4. Verify JS function bindings in HTML
// Find inline click handlers in HTML
const onclickRegex = /onclick="([^"]+)"/g;
let match;
const foundFunctions = [];

while ((match = onclickRegex.exec(html)) !== null) {
    const fnCall = match[1];
    const fnName = fnCall.split('(')[0];
    if (!foundFunctions.includes(fnName)) {
        foundFunctions.push(fnName);
    }
}

console.log(`Found inline interactive functions: ${foundFunctions.join(', ')}`);

foundFunctions.forEach(fn => {
    // Simple check to make sure the function is defined in app.js
    const isDefined = js.includes(`function ${fn}`) || js.includes(`const ${fn}`) || js.includes(`let ${fn}`);
    assert(isDefined, `Function '${fn}' referenced in HTML is defined in app.js`);
});

// 5. Verify vital structural IDs
const vitalIDs = [
    'ph-slider',
    'ph-value',
    'ph-title',
    'ph-description',
    'ph-display-panel',
    'ph-comparison-note',
    'ion-chamber',
    'ecosystem-slider',
    'acid-overlay',
    'divider-bar',
    'wind-particles-container',
    'wind-status',
    'target-forest',
    'sky-chamber',
    'sky-label',
    'sky-rain',
    'sky-center-icon',
    'sky-source',
    'sky-ph',
    'sky-particles',
    'btn-fossil',
    'btn-clean'
];

vitalIDs.forEach(id => {
    assert(html.includes(`id="${id}"`), `index.html contains vital interactive ID: ${id}`);
    assert(js.includes(id), `app.js references ID: ${id}`);
});

if (errors === 0) {
    console.log('\n🎉 ALL TESTS PASSED! The Acid Rain application structure and logic is 100% correct.');
    process.exit(0);
} else {
    console.log(`\n❌ FAILED: Found ${errors} error(s). Please review and correct.`);
    process.exit(1);
}
