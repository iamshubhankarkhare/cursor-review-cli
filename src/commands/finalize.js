const chalk = require('chalk');
const ora = require('ora');
const { postToGitHub } = require('../utils/github');
const { getReviewState } = require('../utils/state');
const { addGitNote, appendGitNote } = require('../utils/git');

async function finalize(message, options = {}) {
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
    
    // Add git note if message provided
    if (message) {
      const noteSpinner = ora('Adding review note...').start();
      try {
        const commitHash = options.commit || 'HEAD';
        
        if (options.append) {
          await appendGitNote(message, commitHash);
          noteSpinner.succeed(`Review note appended to commit ${commitHash === 'HEAD' ? 'HEAD' : commitHash.substring(0, 7)}`);
        } else {
          await addGitNote(message, commitHash);
          noteSpinner.succeed(`Review note added to commit ${commitHash === 'HEAD' ? 'HEAD' : commitHash.substring(0, 7)}`);
        }
        
        console.log(chalk.gray(`💬 "${message}"`));
      } catch (noteError) {
        noteSpinner.warn('Failed to add git note');
        console.log(chalk.yellow('Warning:', noteError.message));
        if (noteError.message.includes('Note already exists')) {
          console.log(chalk.gray('💡 Use --append to add to existing note'));
        }
      }
    }
    
    console.log(chalk.green.bold('\n✅ Review Complete!'));
    console.log(chalk.white('📊 Summary:'));
    console.log(chalk.gray(`  • Files reviewed: ${state.completed}`));
    console.log(chalk.gray(`  • Review session: ${state.sessionId}`));
    console.log(chalk.gray(`  • Status posted to GitHub`));
    if (message) {
      console.log(chalk.gray(`  • Git note added: "${message}"`));
    }
    
    console.log(chalk.cyan.bold('\n🎉 Your PR is now ready for human review!'));
    
  } catch (error) {
    spinner.fail('Failed to finalize review');
    console.error(chalk.red('Error:', error.message));
  }
}

module.exports = { finalize };