const chalk = require('chalk');
const ora = require('ora');
const { getChangedFiles } = require('../utils/git');

async function startReview() {
  const spinner = ora('Analyzing repository changes...').start();
  
  try {
    // Get changed files
    const changedFiles = await getChangedFiles();
    
    spinner.succeed('Repository analysis complete');
    
    // Display results
    console.log(chalk.cyan.bold('\n📋 Review Summary:'));
    console.log(chalk.white(`📁 Files to review: ${chalk.yellow.bold(changedFiles.length)}`));
    console.log(chalk.white(`🔍 Comparing against: ${chalk.green('develop')}`));
    
    if (changedFiles.length > 0) {
      console.log(chalk.cyan('\n📝 Files detected:'));
      changedFiles.forEach((file, index) => {
        console.log(chalk.gray(`  ${index + 1}. ${file}`));
      });
      
      console.log(chalk.green.bold('\n✅ Ready to start review process!'));
      console.log(chalk.white('Next steps:'));
      console.log(chalk.gray('  • Review will be done in batches of 2-3 files'));
      console.log(chalk.gray('  • Use Cursor AI to review each batch'));
      console.log(chalk.gray('  • Mark files as reviewed using: cursor-review mark <files>'));
    } else {
      console.log(chalk.yellow('\n⚠️  No changes detected compared to develop branch'));
    }
    
  } catch (error) {
    spinner.fail('Failed to analyze repository');
    console.error(chalk.red('Error:', error.message));
  }
}

module.exports = { startReview };