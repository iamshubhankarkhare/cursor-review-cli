const chalk = require('chalk');
const { updateReviewState } = require('../utils/state');

async function markFiles(files, options) {
  console.log(chalk.cyan.bold('\n📝 Marking files as reviewed...'));
  
  try {
    const result = await updateReviewState(files, 'reviewed', options.batchId);
    
    console.log(chalk.green('✅ Files marked as reviewed:'));
    files.forEach(file => {
      console.log(chalk.gray(`  • ${file}`));
    });
    
    console.log(chalk.white(`\n📊 Progress: ${result.completed}/${result.total} files reviewed`));
    
    if (result.completed === result.total) {
      console.log(chalk.green.bold('\n🎉 All files reviewed! Ready to finalize.'));
      console.log(chalk.white('Run: cursor-review finalize'));
    }
    
  } catch (error) {
    console.error(chalk.red('Error marking files:', error.message));
  }
}

module.exports = { markFiles };