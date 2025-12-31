# CLAUDE.md - outlook-mcp

MCP server for Microsoft Outlook via Graph API. 27 tools across 5 modules.

## Commands

```bash
npm install              # Install dependencies (run first)
npm start                # Start MCP server
npm run auth-server      # Start OAuth server on :3333 (required for auth)
npm test                 # Run Jest tests
npm run test-mode        # Start with mock data (USE_TEST_MODE=true)
npm run inspect          # MCP Inspector for interactive testing
npx kill-port 3333       # Kill auth server if port blocked
```

## Architecture

```
index.js              # Main entry - combines all module tools
config.js             # Centralized config (API endpoint, defaults, timezone)
outlook-auth-server.js # OAuth server (port 3333)

auth/                 # 3 tools: about, authenticate, check-auth-status
  ├── token-manager.js    # Token load/save/refresh
  └── tools.js            # Tool definitions

email/                # 12 tools: list, search, read, send, attachments, export, delta
  ├── folder-utils.js     # Folder name → ID resolution
  └── attachments.js      # List, download, view attachments

calendar/             # 5 tools: list, create, decline, cancel, delete
folder/               # 4 tools: list, create, move, stats
rules/                # 3 tools: list, create, edit-sequence

utils/
  ├── graph-api.js        # Graph API client with OData encoding
  ├── field-presets.js    # Field selections for token efficiency
  └── response-formatter.js # Verbosity levels (minimal/standard/full)
```

## Key Files

| File | Purpose |
|------|---------|
| `index.js` | MCP protocol handler, combines all tools |
| `config.js` | API endpoint, auth settings, defaults |
| `auth/token-manager.js` | Token storage at `~/.outlook-mcp-tokens.json` |
| `utils/graph-api.js` | All Graph API calls go through here |
| `utils/field-presets.js` | Optimized field selections per operation |

## Configuration

**Environment (.env)**:
```
MS_CLIENT_ID=your-client-id
MS_CLIENT_SECRET=your-secret-VALUE    # NOT the Secret ID!
USE_TEST_MODE=false
```

**Tokens stored at**: `~/.outlook-mcp-tokens.json`

**Defaults**:
- Timezone: `Australia/Melbourne`
- Page size: 25
- Max results: 100

## Authentication Flow

1. Start auth server: `npm run auth-server`
2. Call `authenticate` tool → get URL
3. Open URL in browser → Microsoft login
4. Grant permissions → tokens saved automatically
5. Tokens auto-refresh on expiration

## Adding New Tools

1. Create handler in module directory (e.g., `email/new-tool.js`)
2. Export from module `index.js`
3. Add to `TOOLS` array in main `index.js`
4. Add test in `test/[module]/`

## Common Issues

| Issue | Solution |
|-------|----------|
| `AADSTS7000215` (invalid secret) | Use secret **VALUE**, not Secret ID from Azure |
| `EADDRINUSE :3333` | `npx kill-port 3333` then restart auth server |
| Module not found | Run `npm install` |
| Auth URL doesn't work | Start auth server first: `npm run auth-server` |
| Empty API response | Check auth status with `check-auth-status` tool |

## Testing

```bash
npm test                    # Jest unit tests
./test-modular-server.sh    # MCP Inspector interactive
./test-direct.sh            # Direct testing
USE_TEST_MODE=true npm start # Mock data mode
```

Mock data defined in `utils/mock-data.js`.

## Graph API Notes

- OData filters use proper URI encoding via `utils/odata-helpers.js`
- Field presets in `utils/field-presets.js` optimize token usage
- Response verbosity: `minimal`, `standard`, `full` (controls output detail)
- Delta sync uses `@odata.deltaLink` for incremental updates

## See Also

- `README.md` - Full documentation, Azure setup, tool reference
- `docs/quickrefs/tools-reference.md` - All 27 tools quick reference
- `.env.example` - Environment template
