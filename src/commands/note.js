const chalk = require('chalk');
const ora = require('ora');
const { 
  addGitNote, 
  appendGitNote, 
  removeGitNote, 
  showGitNote, 
  listGitNotes,
  getCurrentCommitHash 
} = require('../utils/git');

async function addNote(message, options = {}) {
  const spinner = ora('Adding git note...').start();
  
  try {
    const commitHash = options.commit || 'HEAD';
    
    if (options.append) {
      await appendGitNote(message, commitHash);
      spinner.succeed(`Note appended to commit ${commitHash === 'HEAD' ? 'HEAD' : commitHash.substring(0, 7)}`);
    } else {
      await addGitNote(message, commitHash);
      spinner.succeed(`Note added to commit ${commitHash === 'HEAD' ? 'HEAD' : commitHash.substring(0, 7)}`);
    }
    
    console.log(chalk.gray(`💬 "${message}"`));
    
  } catch (error) {
    spinner.fail('Failed to add git note');
    console.error(chalk.red('Error:', error.message));
    
    if (error.message.includes('Note already exists')) {
      console.log(chalk.yellow('\n💡 Tip: Use --append to add to existing note or --force to overwrite'));
    }
  }
}

async function showNote(options = {}) {
  const spinner = ora('Retrieving git note...').start();
  
  try {
    const commitHash = options.commit || 'HEAD';
    const note = await showGitNote(commitHash);
    
    if (note) {
      spinner.succeed(`Note found for commit ${commitHash === 'HEAD' ? 'HEAD' : commitHash.substring(0, 7)}`);
      console.log(chalk.cyan('\n📝 Git Note:'));
      console.log(chalk.white(note));
    } else {
      spinner.succeed('No note found');
      console.log(chalk.yellow(`\n⚠️  No note found for commit ${commitHash === 'HEAD' ? 'HEAD' : commitHash.substring(0, 7)}`));
    }
    
  } catch (error) {
    spinner.fail('Failed to retrieve git note');
    console.error(chalk.red('Error:', error.message));
  }
}

async function removeNote(options = {}) {
  const spinner = ora('Removing git note...').start();
  
  try {
    const commitHash = options.commit || 'HEAD';
    await removeGitNote(commitHash);
    spinner.succeed(`Note removed from commit ${commitHash === 'HEAD' ? 'HEAD' : commitHash.substring(0, 7)}`);
    
  } catch (error) {
    spinner.fail('Failed to remove git note');
    console.error(chalk.red('Error:', error.message));
  }
}

async function listNotes() {
  const spinner = ora('Listing git notes...').start();
  
  try {
    const notes = await listGitNotes();
    
    if (notes.length > 0) {
      spinner.succeed(`Found ${notes.length} git notes`);
      console.log(chalk.cyan('\n📋 Git Notes:'));
      
      for (const noteLine of notes) {
        const [noteHash, commitHash] = noteLine.split(' ');
        if (commitHash) {
          console.log(chalk.gray(`  • ${commitHash.substring(0, 7)} - Note: ${noteHash.substring(0, 12)}...`));
        }
      }
    } else {
      spinner.succeed('No git notes found');
      console.log(chalk.yellow('\n⚠️  No git notes found in this repository'));
    }
    
  } catch (error) {
    spinner.fail('Failed to list git notes');
    console.error(chalk.red('Error:', error.message));
  }
}

module.exports = { 
  addNote, 
  showNote, 
  removeNote, 
  listNotes 
}; 