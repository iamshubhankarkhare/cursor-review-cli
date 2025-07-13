const fs = require('fs').promises;
const path = require('path');
const { getCurrentCommitHash } = require('./git');

const STATE_FILE = '.cursor-review-state.json';

async function getReviewState() {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

async function createReviewState(files) {
  const commitHash = await getCurrentCommitHash();
  const sessionId = `review-${Date.now()}`;
  
  const state = {
    sessionId,
    currentCommit: commitHash,
    reviewStarted: new Date().toISOString(),
    files: {},
    summary: {
      totalFiles: files.length,
      reviewedFiles: 0,
      pendingFiles: files.length
    }
  };
  
  // Initialize all files as pending
  files.forEach(file => {
    state.files[file] = {
      status: 'pending',
      batchId: null
    };
  });
  
  await saveReviewState(state);
  return state;
}

async function updateReviewState(files, status, batchId) {
  let state = await getReviewState();
  
  if (!state) {
    // Create new state if it doesn't exist
    const { getChangedFiles } = require('./git');
    const allFiles = await getChangedFiles();
    state = await createReviewState(allFiles);
  }
  
  // Update files
  files.forEach(file => {
    if (state.files[file]) {
      state.files[file].status = status;
      state.files[file].reviewedAt = new Date().toISOString();
      if (batchId) {
        state.files[file].batchId = batchId;
      }
    }
  });
  
  // Update summary
  const reviewedCount = Object.values(state.files).filter(f => f.status === 'reviewed').length;
  state.summary.reviewedFiles = reviewedCount;
  state.summary.pendingFiles = state.summary.totalFiles - reviewedCount;
  
  await saveReviewState(state);
  
  return {
    completed: reviewedCount,
    total: state.summary.totalFiles
  };
}

async function saveReviewState(state) {
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}

async function clearReviewState() {
  try {
    await fs.unlink(STATE_FILE);
  } catch (error) {
    // File doesn't exist, that's fine
  }
}

module.exports = {
  getReviewState,
  createReviewState,
  updateReviewState,
  clearReviewState
};