const chalk = require('chalk');
const boxen = require('boxen');
const gradient = require('gradient-string');

const bannerText = `
 ██████╗██╗   ██╗██████╗ ███████╗ ██████╗ ██████╗      █████╗ ██╗    ██████╗ ███████╗██╗   ██╗██╗███████╗██╗    ██╗
██╔════╝██║   ██║██╔══██╗██╔════╝██╔═══██╗██╔══██╗    ██╔══██╗██║    ██╔══██╗██╔════╝██║   ██║██║██╔════╝██║    ██║
██║     ██║   ██║██████╔╝███████╗██║   ██║██████╔╝    ███████║██║    ██████╔╝█████╗  ██║   ██║██║█████╗  ██║ █╗ ██║
██║     ██║   ██║██╔══██╗╚════██║██║   ██║██╔══██╗    ██╔══██║██║    ██╔══██╗██╔══╝  ╚██╗ ██╔╝██║██╔══╝  ██║███╗██║
╚██████╗╚██████╔╝██║  ██║███████║╚██████╔╝██║  ██║    ██║  ██║██║    ██║  ██║███████╗ ╚████╔╝ ██║███████╗╚███╔███╔╝
 ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝    ╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚═╝╚══════╝ ╚══╝╚══╝ 
`;

async function showBanner() {
  console.clear();
  
  // Create gradient effect
  const gradientBanner = gradient(['#00f5ff', '#0080ff'])(bannerText);
  
  // Create info box
  const infoBox = boxen(
    chalk.white.bold('🚀 AI-Powered Code Review\n') +
    chalk.gray('Starting intelligent code review process...\n') +
    chalk.cyan('✨ Analyzing your changes with AI precision'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      backgroundColor: '#000000'
    }
  );
  
  console.log(gradientBanner);
  console.log(infoBox);
  
  // Add a small delay for effect
  await new Promise(resolve => setTimeout(resolve, 1000));
}

module.exports = { showBanner };