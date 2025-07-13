const chalk = require('chalk');
const { getReviewState } = require('../utils/state');

async function showStatus() {
  console.log(chalk.cyan.bold('\n📊 Review Status:'));
  
  try {
    const state = await getReviewState();
    
    if (!state) {
      console.log(chalk.yellow('⚠️  No active review session found'));
      console.log(chalk.white('Run: cursor-review start'));
      return;
    }
    
    const { completed, total, files } = state;
    const percentage = Math.round((completed / total) * 100);
    
    console.log(chalk.white(`🔍 Session: ${state.sessionId}`));
    console.log(chalk.white(`📈 Progress: ${completed}/${total} files (${percentage}%)`));
    
    // Show progress bar
    const progressBar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
    console.log(chalk.green(`[${progressBar}] ${percentage}%`));
    
    // Show file status
    console.log(chalk.cyan('\n📝 File Status:'));
    Object.entries(files).forEach(([file, info]) => {
      const status = info.status === 'reviewed' ? 
        chalk.green('✅ Reviewed') : 
        chalk.yellow('⏳ Pending');
      console.log(chalk.gray(`  ${status} ${file}`));
    });
    
    if (completed === total) {
      console.log(chalk.green.bold('\n🎉 Review complete! Ready to finalize.'));
    }
    
  } catch (error) {
    console.error(chalk.red('Error getting status:', error.message));
  }
}

module.exports = { showStatus };