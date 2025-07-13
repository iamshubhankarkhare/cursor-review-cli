const axios = require('axios');
const { getCurrentCommitHash } = require('./git');

async function postToGitHub(reviewState) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || 'atlanhq/atlan-frontend';
  
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required');
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