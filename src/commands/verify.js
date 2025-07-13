const chalk = require('chalk');
const { getReviewState } = require('../utils/state');
const { getChangedFiles, getCurrentCommitHash } = require('../utils/git');
const crypto = require('crypto');
const fs = require('fs');

async function verifyCompletion(options = {}) {
  console.log(chalk.cyan.bold('\n🔍 Verifying Review Completion'));
  
  try {
    const state = await getReviewState();
    
    if (!state) {
      const result = {
        completed: false,
        reason: 'No review session found',
        code: 'NO_SESSION'
      };
      
      if (options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(chalk.red('❌ No review session found'));
        console.log(chalk.white('Run: cursor-review start'));
      }
      return result;
    }
    
    const allFilesReviewed = state.summary.reviewedFiles === state.summary.totalFiles;
    const currentCommit = await getCurrentCommitHash();
    const reviewUpToDate = state.currentCommit === currentCommit;
    
    const result = {
      completed: allFilesReviewed && reviewUpToDate,
      sessionId: state.sessionId,
      reviewedFiles: state.summary.reviewedFiles,
      totalFiles: state.summary.totalFiles,
      upToDate: reviewUpToDate,
      timestamp: state.reviewStarted
    };
    
    if (options.format === 'json') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      if (result.completed) {
        console.log(chalk.green('✅ Review completed successfully'));
        console.log(chalk.white(`📊 Files: ${result.reviewedFiles}/${result.totalFiles}`));
        console.log(chalk.white(`🕒 Session: ${result.sessionId}`));
      } else {
        console.log(chalk.red('❌ Review not completed'));
        if (!allFilesReviewed) {
          console.log(chalk.yellow(`⚠️  Only ${result.reviewedFiles}/${result.totalFiles} files reviewed`));
        }
        if (!reviewUpToDate) {
          console.log(chalk.yellow('⚠️  Changes detected after review - re-review required'));
        }
      }
    }
    
    return result;
    
  } catch (error) {
    const result = {
      completed: false,
      reason: error.message,
      code: 'ERROR'
    };
    
    if (options.format === 'json') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.error(chalk.red('Error verifying completion:', error.message));
    }
    return result;
  }
}

async function checkChanges() {
  console.log(chalk.cyan.bold('\n🔍 Checking for Changes After Review'));
  
  try {
    const state = await getReviewState();
    
    if (!state) {
      console.log(chalk.yellow('⚠️  No review session found'));
      return;
    }
    
    const needsReview = [];
    
    for (const [filePath, fileInfo] of Object.entries(state.files)) {
      if (fileInfo.status === 'reviewed' && fs.existsSync(filePath)) {
        const currentHash = getFileHash(filePath);
        
        if (fileInfo.fileHashWhenReviewed && currentHash !== fileInfo.fileHashWhenReviewed) {
          needsReview.push(filePath);
        }
      }
    }
    
    if (needsReview.length > 0) {
      console.log(chalk.red(`❌ ${needsReview.length} files modified after review:`));
      needsReview.forEach(file => {
        console.log(chalk.gray(`  • ${file}`));
      });
      console.log(chalk.white('\nRun cursor-review start to re-review changed files'));
    } else {
      console.log(chalk.green('✅ No changes detected after review'));
    }
    
    return needsReview;
    
  } catch (error) {
    console.error(chalk.red('Error checking changes:', error.message));
    return [];
  }
}

function getFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('sha256').update(content).digest('hex');
  } catch (error) {
    return null;
  }
}

module.exports = { verifyCompletion, checkChanges };