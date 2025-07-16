const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');
const { clearReviewState } = require('../utils/state');

async function resetReview() {
  console.log(chalk.cyan.bold('\n🔄 Reset Review Session'));
  
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
    
    // Delete PR review summary file if it exists
    const summaryFile = path.join('.cursor', '@pr-review-summary.md');
    try {
      await fs.unlink(summaryFile);
      console.log(chalk.green('✅ Cleanup completed'));
      console.log(chalk.gray('  • Removed .cursor-review-state.json'));
      console.log(chalk.gray('  • Removed .cursor/@pr-review-summary.md'));
      console.log(chalk.gray('  • Cleared temporary files'));
    } catch (error) {
      // File doesn't exist, that's fine - just report what we did clean up
      console.log(chalk.green('✅ Cleanup completed'));
      console.log(chalk.gray('  • Removed .cursor-review-state.json'));
      console.log(chalk.gray('  • .cursor/@pr-review-summary.md (not found)'));
      console.log(chalk.gray('  • Cleared temporary files'));
    }
  } catch (error) {
    console.error(chalk.red('Error during cleanup:', error.message));
  }
}

module.exports = { resetReview, cleanupFiles };