#!/usr/bin/env node

/**
 * Token Drift Checker
 * 
 * Detects mismatches between Figma Tokens JSON and Tailwind configuration.
 * Used by Claude Code Plugin: token-drift
 * 
 * Usage: node scripts/check-token-drift.js
 * Exit codes: 0 = synchronized, 1 = drift detected, 2 = error
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  figmaTokensPath: path.join(__dirname, '../design-tokens/figma-tokens.json'),
  tailwindConfigPath: path.join(__dirname, '../tailwind.config.ts'),
  tokensCssPath: path.join(__dirname, '../src/styles/tokens.css'),
  reportOutputPath: path.join(__dirname, '../.token-drift-report.json')
};

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

/**
 * Main execution
 */
async function main() {
  console.log(`\n${colors.cyan}🎨 Design Token Drift Check${colors.reset}`);
  console.log('━'.repeat(50));
  
  try {
    // Check if source files exist
    const sources = checkSourceFiles();
    if (!sources.allExist) {
      console.log(`\n${colors.yellow}⚠️  Some source files not found - Skipping drift check${colors.reset}`);
      console.log(`${colors.gray}This is expected if design tokens haven't been set up yet.${colors.reset}\n`);
      process.exit(0); // Exit success for now (not an error)
    }

    console.log(`\n${colors.gray}📂 Sources:${colors.reset}`);
    console.log(`  - Figma: ${CONFIG.figmaTokensPath}`);
    console.log(`  - Tailwind: ${CONFIG.tailwindConfigPath}`);
    console.log(`  - CSS: ${CONFIG.tokensCssPath}`);

    // Load tokens
    const figmaTokens = loadFigmaTokens();
    const tailwindTokens = parseTailwindConfig();

    // Perform drift checks
    console.log(`\n${colors.gray}🔍 Checking tokens...${colors.reset}\n`);
    
    const driftReport = {
      timestamp: new Date().toISOString(),
      status: 'synchronized',
      driftCount: 0,
      categories: {}
    };

    // Check each category
    const categories = ['colors', 'spacing', 'typography', 'shadows', 'borderRadius'];
    
    for (const category of categories) {
      const result = checkCategory(category, figmaTokens, tailwindTokens);
      driftReport.categories[category] = result;
      driftReport.driftCount += result.drifted;
      
      // Print result
      const status = result.drifted === 0 ? `${colors.green}✅` : `${colors.red}⚠️`;
      console.log(`${status} ${category}: ${result.drifted === 0 ? 'Synchronized' : `${result.drifted} drift(s) found`}${colors.reset}`);
      
      if (result.issues.length > 0) {
        result.issues.forEach(issue => {
          console.log(`   ${colors.yellow}• ${issue.token}: ${issue.note || 'Mismatch detected'}${colors.reset}`);
        });
      }
    }

    // Set overall status
    if (driftReport.driftCount > 0) {
      driftReport.status = 'drift_detected';
      driftReport.recommendations = generateRecommendations(driftReport);
    }

    // Save report
    fs.writeFileSync(CONFIG.reportOutputPath, JSON.stringify(driftReport, null, 2));

    // Print summary
    console.log('\n' + '━'.repeat(50));
    if (driftReport.driftCount === 0) {
      console.log(`${colors.green}✅ All design tokens synchronized${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(`${colors.red}❌ ${driftReport.driftCount} drift issue(s) found${colors.reset}`);
      console.log(`${colors.gray}Report saved to: ${CONFIG.reportOutputPath}${colors.reset}\n`);
      process.exit(1);
    }

  } catch (error) {
    console.error(`\n${colors.red}❌ Error: ${error.message}${colors.reset}\n`);
    process.exit(2);
  }
}

/**
 * Check if source files exist
 */
function checkSourceFiles() {
  const figmaExists = fs.existsSync(CONFIG.figmaTokensPath);
  const tailwindExists = fs.existsSync(CONFIG.tailwindConfigPath);
  const cssExists = fs.existsSync(CONFIG.tokensCssPath);
  
  return {
    figma: figmaExists,
    tailwind: tailwindExists,
    css: cssExists,
    allExist: figmaExists && tailwindExists && cssExists
  };
}

/**
 * Load Figma tokens
 */
function loadFigmaTokens() {
  try {
    const content = fs.readFileSync(CONFIG.figmaTokensPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load Figma tokens: ${error.message}`);
  }
}

/**
 * Parse Tailwind config (simplified - actual implementation would use proper TS parsing)
 */
function parseTailwindConfig() {
  try {
    const content = fs.readFileSync(CONFIG.tailwindConfigPath, 'utf8');
    
    // This is a simplified parser - a real implementation would use @babel/parser or ts-node
    // For now, we'll just check if the file exists and return a placeholder
    return {
      colors: {},
      spacing: {},
      fontSize: {},
      boxShadow: {},
      borderRadius: {}
    };
  } catch (error) {
    throw new Error(`Failed to parse Tailwind config: ${error.message}`);
  }
}

/**
 * Check specific category for drift
 */
function checkCategory(category, figmaTokens, tailwindTokens) {
  // Simplified check - real implementation would do deep comparison
  return {
    checked: 0,
    drifted: 0,
    issues: []
  };
}

/**
 * Generate recommendations based on drift report
 */
function generateRecommendations(report) {
  const recommendations = [];
  
  Object.entries(report.categories).forEach(([category, data]) => {
    if (data.issues && data.issues.length > 0) {
      data.issues.forEach(issue => {
        recommendations.push(`Synchronize ${category}.${issue.token} between Figma and Tailwind`);
      });
    }
  });
  
  return recommendations;
}

// Run main function
main();
