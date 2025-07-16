const { execSync } = require('child_process');

async function getChangedFiles() {
  try {
    // Get files changed compared to develop branch
    const output = execSync('git diff --name-only develop', { encoding: 'utf8' });
    const files = output.trim().split('\n').filter(file => file.length > 0);
    
    return files;
  } catch (error) {
    // Fallback to comparing with origin/develop
    try {
      const output = execSync('git diff --name-only origin/develop', { encoding: 'utf8' });
      const files = output.trim().split('\n').filter(file => file.length > 0);
      return files;
    } catch (fallbackError) {
      throw new Error('Unable to get changed files. Make sure you are in a git repository.');
    }
  }
}

async function getCurrentCommitHash() {
  try {
    const hash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    return hash;
  } catch (error) {
    throw new Error('Unable to get current commit hash');
  }
}

async function getCurrentBranch() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    return branch;
  } catch (error) {
    throw new Error('Unable to get current branch');
  }
}

async function addGitNote(message, commitHash = 'HEAD') {
  try {
    // Escape the message for shell execution
    const escapedMessage = message.replace(/'/g, "'\"'\"'");
    const command = `git notes add -m '${escapedMessage}' ${commitHash}`;
    execSync(command, { encoding: 'utf8' });
    return true;
  } catch (error) {
    if (error.message.includes('Cannot add notes. Found existing notes')) {
      throw new Error('Note already exists for this commit. Use --force to overwrite or remove the existing note first.');
    }
    throw new Error(`Failed to add git note: ${error.message}`);
  }
}

async function appendGitNote(message, commitHash = 'HEAD') {
  try {
    const escapedMessage = message.replace(/'/g, "'\"'\"'");
    const command = `git notes append -m '${escapedMessage}' ${commitHash}`;
    execSync(command, { encoding: 'utf8' });
    return true;
  } catch (error) {
    throw new Error(`Failed to append git note: ${error.message}`);
  }
}

async function removeGitNote(commitHash = 'HEAD') {
  try {
    const command = `git notes remove ${commitHash}`;
    execSync(command, { encoding: 'utf8' });
    return true;
  } catch (error) {
    if (error.message.includes('No note found')) {
      throw new Error('No note found for this commit.');
    }
    throw new Error(`Failed to remove git note: ${error.message}`);
  }
}

async function showGitNote(commitHash = 'HEAD') {
  try {
    const command = `git notes show ${commitHash}`;
    const output = execSync(command, { encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    if (error.message.includes('No note found')) {
      return null;
    }
    throw new Error(`Failed to show git note: ${error.message}`);
  }
}

async function listGitNotes() {
  try {
    const command = 'git notes list';
    const output = execSync(command, { encoding: 'utf8' });
    return output.trim().split('\n').filter(line => line.length > 0);
  } catch (error) {
    return [];
  }
}

module.exports = {
  getChangedFiles,
  getCurrentCommitHash,
  getCurrentBranch,
  addGitNote,
  appendGitNote,
  removeGitNote,
  showGitNote,
  listGitNotes
};