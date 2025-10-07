#!/usr/bin/env node

/**
 * Pre-Deployment Checker for Netlify
 * Verifies all requirements before deploying to Netlify
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Netlify Deployment Requirements...\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: package.json exists
console.log('1️⃣  Checking package.json...');
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check required dependencies
  const requiredDeps = [
    'react',
    'react-dom',
    'react-router-dom',
    'axios',
    'react-scripts'
  ];
  
  const missing = requiredDeps.filter(dep => !pkg.dependencies[dep]);
  
  if (missing.length > 0) {
    console.log('   ❌ Missing dependencies:', missing.join(', '));
    hasErrors = true;
  } else {
    console.log('   ✅ All required dependencies present');
  }
  
  // Check build script
  if (pkg.scripts && pkg.scripts.build) {
    console.log('   ✅ Build script found:', pkg.scripts.build);
  } else {
    console.log('   ❌ Build script missing in package.json');
    hasErrors = true;
  }
} else {
  console.log('   ❌ package.json not found');
  hasErrors = true;
}

// Check 2: config.js exists
console.log('\n2️⃣  Checking src/config.js...');
if (fs.existsSync('src/config.js')) {
  const config = fs.readFileSync('src/config.js', 'utf8');
  if (config.includes('API_BASE_URL')) {
    console.log('   ✅ API_BASE_URL configured');
  } else {
    console.log('   ❌ API_BASE_URL not found in config.js');
    hasErrors = true;
  }
} else {
  console.log('   ❌ src/config.js not found');
  hasErrors = true;
}

// Check 3: _redirects file
console.log('\n3️⃣  Checking public/_redirects...');
if (fs.existsSync('public/_redirects')) {
  const redirects = fs.readFileSync('public/_redirects', 'utf8');
  if (redirects.includes('/*') && redirects.includes('/index.html')) {
    console.log('   ✅ SPA redirect rule configured');
  } else {
    console.log('   ⚠️  _redirects file exists but may be misconfigured');
    hasWarnings = true;
  }
} else {
  console.log('   ⚠️  public/_redirects not found (SPA routing may not work)');
  hasWarnings = true;
}

// Check 4: netlify.toml
console.log('\n4️⃣  Checking netlify.toml...');
if (fs.existsSync('netlify.toml')) {
  console.log('   ✅ netlify.toml found');
} else {
  console.log('   ⚠️  netlify.toml not found (using default settings)');
  hasWarnings = true;
}

// Check 5: .env file (should NOT be committed)
console.log('\n5️⃣  Checking .env configuration...');
if (fs.existsSync('.env')) {
  console.log('   ⚠️  .env file found locally (good for development)');
  console.log('   ℹ️  Remember to set environment variables in Netlify dashboard');
  hasWarnings = true;
} else {
  console.log('   ℹ️  No .env file (set variables in Netlify dashboard)');
}

// Check 6: Hardcoded localhost URLs
console.log('\n6️⃣  Checking for hardcoded localhost URLs...');
const filesToCheck = [
  'src/config.js',
  'src/reg/UserModel.js',
  'src/contactUS/ContactUS.jsx',
  'src/service/Service.jsx'
];

let foundLocalhost = false;
filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('localhost:5000') && !content.includes('//') && !content.includes('/*')) {
      console.log(`   ⚠️  Found localhost:5000 in ${file}`);
      foundLocalhost = true;
      hasWarnings = true;
    }
  }
});

if (!foundLocalhost) {
  console.log('   ✅ No hardcoded localhost URLs found');
}

// Check 7: Build test
console.log('\n7️⃣  Testing build command...');
console.log('   ℹ️  Run "npm run build" to test locally before deploying');

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 SUMMARY\n');

if (hasErrors) {
  console.log('❌ ERRORS FOUND - Fix these before deploying:');
  console.log('   - Check the error messages above');
  console.log('   - Fix all ❌ items');
  console.log('   - Run this script again\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  WARNINGS FOUND - Review these:');
  console.log('   - Check the warning messages above');
  console.log('   - Fix ⚠️  items if needed');
  console.log('   - Deployment should work but may have issues\n');
} else {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('   - Ready for Netlify deployment');
  console.log('   - Run "npm run build" to test locally');
  console.log('   - Set environment variables in Netlify dashboard\n');
}

console.log('📚 Next Steps:');
console.log('   1. Run: npm run build');
console.log('   2. Test: npx serve -s build');
console.log('   3. Deploy to Netlify');
console.log('   4. Set REACT_APP_API_BASE in Netlify dashboard\n');

console.log('='.repeat(50));
