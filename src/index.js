#!/usr/bin/env node

const { program } = require('commander');
const { showBanner } = require('./utils/banner');
const { startReview } = require('./commands/start');
const { markFiles } = require('./commands/mark');
const { showStatus } = require('./commands/status');
const { finalize } = require('./commands/finalize');

program
  .name('cursor-review')
  .description('AI-powered code review CLI for Cursor IDE')
  .version('1.0.0');

program
  .command('start')
  .description('Start the AI code review process')
  .action(async () => {
    await showBanner();
    await startReview();
  });

program
  .command('mark')
  .description('Mark files as reviewed')
  .argument('<files...>', 'Files to mark as reviewed')
  .option('-b, --batch-id <id>', 'Batch ID for grouping files')
  .action(async (files, options) => {
    await markFiles(files, options);
  });

program
  .command('status')
  .description('Show current review status')
  .action(async () => {
    await showStatus();
  });

program
  .command('finalize')
  .description('Finalize review and post to GitHub')
  .action(async () => {
    await finalize();
  });

program.parse();