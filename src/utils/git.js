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

module.exports = {
  getChangedFiles,
  getCurrentCommitHash,
  getCurrentBranch
};