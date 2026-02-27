# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-02

### Changed

- **Tool consolidation: 55 → 20 tools** (~64% reduction, ~11,000 tokens saved per turn)
  - Email: 17 → 6 (`search-emails`, `read-email`, `send-email`, `update-email`, `attachments`, `export`)
  - Calendar: 5 → 3 (`list-events`, `create-event`, `manage-event`)
  - Contacts: 7 → 2 (`manage-contact`, `search-people`)
  - Categories: 7 → 3 (`manage-category`, `apply-category`, `manage-focused-inbox`)
  - Settings: 5 → 1 (`mailbox-settings`)
  - Folders: 4 → 1 (`folders`)
  - Rules: 3 → 1 (`manage-rules`)
  - Auth: 3 → 1 (`auth`)
  - Advanced: 4 → 2 (`access-shared-mailbox`, `find-meeting-rooms`)
- Consolidated tools use action parameters (STRAP pattern) instead of separate tool definitions
- Preferred env vars renamed to `OUTLOOK_CLIENT_ID` / `OUTLOOK_CLIENT_SECRET` (old `MS_*` names still accepted)

### Added

- **MCP safety annotations** on all 20 tools (`readOnlyHint`, `destructiveHint`, `idempotentHint`)
  - 6 read-only tools auto-approved by Claude Code
  - 2 destructive tools (`send-email`, `manage-event`) prompt for confirmation
- **send-email safety controls**:
  - `dryRun` parameter — preview composed emails without sending
  - Session rate limiting via `OUTLOOK_MAX_EMAILS_PER_SESSION` env var
  - Recipient allowlist via `OUTLOOK_ALLOWED_RECIPIENTS` env var
- `utils/safety.js` — shared safety utilities (rate limiter, allowlist checker, dry-run formatter)
- `update-email` tool — unified mark-read, flag, unflag, and complete operations

### Removed

- 35 individual tools replaced by consolidated equivalents (see consolidation map in CLAUDE.md)
- `set-message-flag` and `clear-message-flag` from Advanced module (merged into `update-email`)

## [2.1.0] - 2026-02

### Changed

- Migrated ESLint 8 to ESLint 9 with flat config
- Replaced gitleaks with GitHub Advanced Security secret scanning
- Hardened security, cleaned up logging, improved CI pipeline

### Added

- Comprehensive test coverage across all modules (375 tests, 14 suites)
- Codecov integration with coverage badge
- Comprehensive Azure setup guide in documentation
- Full documentation refresh with LBA branding and GitHub templates

### Fixed

- Formatted `codecov.yml` for Prettier compatibility
- Resolved CI failures in formatting and security audit steps

### Dependencies

- `actions/checkout` v4 to v6
- `actions/setup-node` v4 to v6
- `codecov/codecov-action` v4 to v5
- `@commitlint/cli` to v20, `supertest` to v7.2
- `prettier` and `dotenv` bumped to latest

## [2.0.0] - 2024-12

### Added

- **55 tools** across 9 modules (was 27 tools across 5 modules)
- **Email Headers & MIME**: `get-email-headers`, `get-mime-content` for forensics and archival
- **Conversation Threading**: `list-conversations`, `get-conversation`, `export-conversation`
- **Contacts Module** (7 tools): Full CRUD operations + relevance-based people search
- **Categories Module** (7 tools): Category management + Focused Inbox overrides
- **Settings Module** (5 tools): Auto-replies, working hours configuration
- **Advanced Module** (4 tools): Shared mailbox access, message flags, meeting room search
- Export formats: MBOX and HTML for conversations
- New email tools: `export-email`, `batch-export-emails`, `list-emails-delta`, `search-by-message-id`

### Fixed

- `get-folder-stats` - Removed invalid `sizeInBytes` property from Graph API query

## [1.0.0] - 2024-11

### Added

- Initial release with 27 tools across 5 modules
- **Authentication**: OAuth 2.0 flow with Microsoft Graph API
- **Email Module**: List, search, read, send emails with attachment support
- **Calendar Module**: List, create, decline, cancel, delete events
- **Folder Module**: List, create folders; move emails between folders
- **Rules Module**: List, create, reorder inbox rules
- Test mode with mock data for development
- MCP Inspector integration for debugging
