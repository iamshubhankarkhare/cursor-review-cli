#!/usr/bin/env node

const { program } = require('commander');
const { showBanner } = require('./utils/banner');
const { startReview } = require('./commands/start');
const { markFiles } = require('./commands/mark');
const { showStatus } = require('./commands/status');
const { finalize } = require('./commands/finalize');
const { resetReview, cleanupFiles } = require('./commands/reset');
const { verifyCompletion, checkChanges } = require('./commands/verify');
const { setConfig, getConfigValue, resetConfig, listConfigOptions } = require('./commands/config');

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

program
  .command('reset')
  .description('Reset the current review session')
  .action(async () => {
    await resetReview();
  });

program
  .command('cleanup')
  .description('Clean up review files and temporary data')
  .action(async () => {
    await cleanupFiles();
  });

program
  .command('verify-completion')
  .description('Verify if review is completed (for CI)')
  .option('--format <format>', 'Output format (json|text)', 'text')
  .action(async (options) => {
    await verifyCompletion(options);
  });

program
  .command('check-changes')
  .description('Check if files were modified after review')
  .action(async () => {
    await checkChanges();
  });

// Config commands
const configCommand = program
  .command('config')
  .description('Manage configuration settings');

configCommand
  .command('set')
  .description('Set a configuration value')
  .argument('<key>', 'Configuration key')
  .argument('<value>', 'Configuration value')
  .action(async (key, value) => {
    await setConfig(key, value);
  });

configCommand
  .command('get')
  .description('Get configuration value(s)')
  .argument('[key]', 'Configuration key (optional - shows all if not provided)')
  .action(async (key) => {
    await getConfigValue(key);
  });

configCommand
  .command('reset')
  .description('Reset configuration to defaults')
  .action(async () => {
    await resetConfig();
  });

configCommand
  .command('list')
  .description('List all available configuration options')
  .action(async () => {
    await listConfigOptions();
  });

program.parse();