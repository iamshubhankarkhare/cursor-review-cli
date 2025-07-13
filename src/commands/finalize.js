const chalk = require('chalk');
const ora = require('ora');
const { postToGitHub } = require('../utils/github');
const { getReviewState } = require('../utils/state');

async function finalize() {
  console.log(chalk.cyan.bold('\n🚀 Finalizing review...'));
  
  const spinner = ora('Posting review results to GitHub...').start();
  
  try {
    const state = await getReviewState();
    
    if (!state) {
      spinner.fail('No review session found');
      return;
    }
    
    if (state.completed !== state.total) {
      spinner.fail('Review not complete');
      console.log(chalk.red(`Only ${state.completed}/${state.total} files reviewed`));
      return;
    }
    
    // Post to GitHub
    await postToGitHub(state);
    
    spinner.succeed('Review results posted to GitHub');
    
    console.log(chalk.green.bold('\n✅ Review Complete!'));
    console.log(chalk.white('📊 Summary:'));
    console.log(chalk.gray(`  • Files reviewed: ${state.completed}`));
    console.log(chalk.gray(`  • Review session: ${state.sessionId}`));
    console.log(chalk.gray(`  • Status posted to GitHub`));
    
    console.log(chalk.cyan.bold('\n🎉 Your PR is now ready for human review!'));
    
  } catch (error) {
    spinner.fail('Failed to finalize review');
    console.error(chalk.red('Error:', error.message));
  }
}

module.exports = { finalize };