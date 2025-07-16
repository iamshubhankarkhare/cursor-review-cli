const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { getCurrentCommitHash } = require('./git');
const { execSync } = require('child_process');

// Load environment variables from multiple sources
function loadEnvVariables() {
  const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
  
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      const envContent = fs.readFileSync(envFile, 'utf8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        const [key, value] = line.split('=');
        if (key && value && key.trim() === 'GITHUB_TOKEN') {
          process.env.GITHUB_TOKEN = value.trim().replace(/['"]/g, '');
          console.log(`Found GITHUB_TOKEN in ${envFile}`);
          return;
        }
      }
    }
  }
  
  // Check .npmrc for GitHub token
  const npmrcPath = path.join(process.env.HOME || process.env.USERPROFILE, '.npmrc');
  if (fs.existsSync(npmrcPath)) {
    const npmrcContent = fs.readFileSync(npmrcPath, 'utf8');
    const lines = npmrcContent.split('\n');
    
    for (const line of lines) {
      if (line.includes('//npm.pkg.github.com/:_authToken=')) {
        const token = line.split('=')[1];
        if (token) {
          process.env.GITHUB_TOKEN = token.trim();
          console.log('Found GITHUB_TOKEN in .npmrc');
          return;
        }
      }
    }
  }
}

async function postToGitHub(reviewState) {
  loadEnvVariables();
  
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || 'atlanhq/atlan-frontend';
  
  if (!token) {
    throw new Error(`GITHUB_TOKEN not found... Please add it to one of these files:
    - .env
    - .env.local  
    - .env.development
    - .env.production
    - ~/.npmrc (as //npm.pkg.github.com/:_authToken=TOKEN)`);
  }

  // Check if we're ahead of remote
  try {
    const aheadCount = execSync('git rev-list --count HEAD ^origin/HEAD', { encoding: 'utf8' }).trim();
    if (parseInt(aheadCount) > 0) {
      console.warn(`Warning: You have ${aheadCount} unpushed commits. Consider pushing before posting status.`);
    }
  } catch (e) {
    console.warn('Could not check if commits are pushed. Proceeding anyway...');
  }

  const [owner, repoName] = repo.split('/');
  const commitHash = await getCurrentCommitHash();
  
  const statusData = {
    state: 'success',
    target_url: `https://github.com/${owner}/${repoName}/commit/${commitHash}`,
    description: `AI Review: ${reviewState.summary.reviewedFiles}/${reviewState.summary.totalFiles} files reviewed`,
    context: 'cursor-ai-review'
  };
  
  try {
    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repoName}/statuses/${commitHash}`,
      statusData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`GitHub API Error: ${error.response.status} - ${error.response.data.message}`);
    } else {
      throw new Error(`Network Error: ${error.message}`);
    }
  }
}

module.exports = { postToGitHub };