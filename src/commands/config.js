const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

const CONFIG_FILE = '.cursor-review-config.json';

const DEFAULT_CONFIG = {
  targetBranch: 'develop',
  batchSize: 3,
  autoDetectRepo: true,
  gitHubIntegration: true,
  maxRetries: 3,
  timeoutMs: 30000
};

async function getConfig() {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch (error) {
    return DEFAULT_CONFIG;
  }
}

async function saveConfig(config) {
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

async function setConfig(key, value) {
  console.log(chalk.cyan.bold('\n⚙️  Setting Configuration'));
  
  try {
    const config = await getConfig();
    
    // Validate key
    if (!DEFAULT_CONFIG.hasOwnProperty(key)) {
      console.log(chalk.red(`❌ Invalid configuration key: ${key}`));
      console.log(chalk.white('Valid keys:'));
      Object.keys(DEFAULT_CONFIG).forEach(validKey => {
        console.log(chalk.gray(`  • ${validKey}`));
      });
      return;
    }
    
    // Convert value to appropriate type
    let convertedValue = value;
    if (key === 'batchSize' || key === 'maxRetries' || key === 'timeoutMs') {
      convertedValue = parseInt(value);
      if (isNaN(convertedValue)) {
        console.log(chalk.red(`❌ ${key} must be a number`));
        return;
      }
    } else if (key === 'autoDetectRepo' || key === 'gitHubIntegration') {
      convertedValue = value.toLowerCase() === 'true';
    }
    
    config[key] = convertedValue;
    await saveConfig(config);
    
    console.log(chalk.green(`✅ Configuration updated:`));
    console.log(chalk.white(`   ${key}: ${convertedValue}`));
    
  } catch (error) {
    console.error(chalk.red('Error setting config:', error.message));
  }
}

async function getConfigValue(key) {
  try {
    const config = await getConfig();
    
    if (key) {
      if (config.hasOwnProperty(key)) {
        console.log(chalk.white(`${key}: ${config[key]}`));
      } else {
        console.log(chalk.red(`❌ Invalid configuration key: ${key}`));
      }
    } else {
      console.log(chalk.cyan.bold('\n⚙️  Current Configuration:'));
      Object.entries(config).forEach(([configKey, configValue]) => {
        console.log(chalk.white(`  ${configKey}: ${chalk.yellow(configValue)}`));
      });
    }
    
    return config;
    
  } catch (error) {
    console.error(chalk.red('Error getting config:', error.message));
  }
}

async function resetConfig() {
  console.log(chalk.cyan.bold('\n⚙️  Resetting Configuration'));
  
  try {
    await saveConfig(DEFAULT_CONFIG);
    console.log(chalk.green('✅ Configuration reset to defaults'));
    
    console.log(chalk.white('Default configuration:'));
    Object.entries(DEFAULT_CONFIG).forEach(([key, value]) => {
      console.log(chalk.gray(`  ${key}: ${value}`));
    });
    
  } catch (error) {
    console.error(chalk.red('Error resetting config:', error.message));
  }
}

async function listConfigOptions() {
  console.log(chalk.cyan.bold('\n⚙️  Configuration Options:'));
  
  const descriptions = {
    targetBranch: 'Branch to compare changes against (default: develop)',
    batchSize: 'Number of files to review in each batch (default: 3)', 
    autoDetectRepo: 'Automatically detect repository info (default: true)',
    gitHubIntegration: 'Enable GitHub API integration (default: true)',
    maxRetries: 'Maximum API retry attempts (default: 3)',
    timeoutMs: 'Request timeout in milliseconds (default: 30000)'
  };
  
  Object.entries(descriptions).forEach(([key, description]) => {
    console.log(chalk.white(`${chalk.yellow(key)}: ${description}`));
  });
  
  console.log(chalk.gray('\nUsage:'));
  console.log(chalk.gray('  cursor-review config set <key> <value>'));
  console.log(chalk.gray('  cursor-review config get [key]'));
  console.log(chalk.gray('  cursor-review config reset'));
}

module.exports = { 
  getConfig, 
  setConfig, 
  getConfigValue, 
  resetConfig, 
  listConfigOptions 
};