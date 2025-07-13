# Cursor AI Review CLI

🚀 AI-powered code review CLI for Cursor IDE that enables intelligent code review before human review.

## Features

- 🎨 Beautiful CLI interface with gradient banners
- 📊 Progress tracking and status reporting
- 🔍 Git diff analysis for changed files
- 🚀 GitHub integration with commit status API
- 📝 Batch file review support
- ✅ Review completion verification

## Installation

```bash
# Install globally
npm install -g @iamshubhankarkhare/cursor-review-cli

# Or use with npx (recommended)
npx @iamshubhankarkhare/cursor-review-cli start
```

## Usage

### Start Review Process
```bash
cursor-review start
```
Shows banner, analyzes repository, and lists files to review.

### Mark Files as Reviewed
```bash
cursor-review mark src/components/UserProfile.vue src/composables/useAuth.ts
```

### Check Review Status
```bash
cursor-review status
```

### Finalize Review
```bash
cursor-review finalize
```
Posts review completion status to GitHub.

## Configuration

Set up environment variables:

```bash
# GitHub token for API access
export GITHUB_TOKEN="your-github-token"

# Repository (optional, auto-detected)
export GITHUB_REPOSITORY="owner/repo-name"
```

## Workflow

1. **Start Review**: `cursor-review start`
2. **Review Files**: Use Cursor AI to review files in batches
3. **Mark Reviewed**: `cursor-review mark <files>`
4. **Check Progress**: `cursor-review status`
5. **Finalize**: `cursor-review finalize`

## GitHub Integration

The CLI posts commit status checks to GitHub when review is complete:

- ✅ **cursor-ai-review** - AI Review: 12/12 files reviewed

## Requirements

- Node.js 16+ 
- Git repository
- GitHub token (for finalization)

## Development

```bash
# Clone the repository
git clone https://github.com/iamshubhankarkhare/cursor-review-cli.git
cd cursor-review-cli

# Install dependencies
npm install

# Link for local development
npm link

# Test the CLI
cursor-review start
```

## License

MIT

## Author

Shubhankar Khare