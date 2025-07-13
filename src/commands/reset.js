const chalk = require('chalk');
const { clearReviewState } = require('../utils/state');
const inquirer = require('inquirer');

async function resetReview() {
  console.log(chalk.cyan.bold('\n🔄 Reset Review Session'));
  
  // Confirm reset
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to reset the current review session?',
      default: false
    }
  ]);
  
  if (!confirm) {
    console.log(chalk.yellow('Reset cancelled.'));
    return;
  }
  
  try {
    await clearReviewState();
    console.log(chalk.green('✅ Review session reset successfully'));
    console.log(chalk.white('You can now start a new review with: cursor-review start'));
  } catch (error) {
    console.error(chalk.red('Error resetting review:', error.message));
  }
}

async function cleanupFiles() {
  console.log(chalk.cyan.bold('\n🧹 Cleanup Review Files'));
  
  try {
    await clearReviewState();
    console.log(chalk.green('✅ Cleanup completed'));
    console.log(chalk.gray('  • Removed .cursor-review-state.json'));
    console.log(chalk.gray('  • Cleared temporary files'));
  } catch (error) {
    console.error(chalk.red('Error during cleanup:', error.message));
  }
}

module.exports = { resetReview, cleanupFiles };