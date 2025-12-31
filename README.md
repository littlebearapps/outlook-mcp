# Outlook MCP Server

A modular Model Context Protocol (MCP) server that connects Claude with Microsoft Outlook through the Microsoft Graph API.

[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/ryaker-outlook-mcp-badge.png)](https://mseep.ai/app/ryaker-outlook-mcp)

Certified by MCPHub https://mcphub.com/mcp-servers/ryaker/outlook-mcp

## Features

- **Email Management**: List, search, read, send, export emails with attachment support
- **Calendar Management**: List, create, accept, decline, cancel, and delete calendar events
- **Folder Management**: List, create folders; move emails between folders; get folder statistics
- **Rules Management**: List, create, and reorder inbox rules
- **Export Capabilities**: Export emails to MIME/EML, Markdown, or JSON formats
- **Incremental Sync**: Delta queries for efficient email synchronization
- **OAuth 2.0 Authentication**: Secure authentication with Microsoft Graph API
- **Modular Architecture**: Clean separation of concerns for maintainability
- **Test Mode**: Simulated responses for testing without real API calls

## Quick Start

1. **Install dependencies**: `npm install`
2. **Azure setup**: Register app in Azure Portal (see [Azure App Registration](#azure-app-registration--configuration))
3. **Configure environment**: Copy `.env.example` to `.env` and add your Azure credentials
4. **Configure Claude**: Update your Claude Desktop config with the server path
5. **Start auth server**: `npm run auth-server`
6. **Authenticate**: Use the authenticate tool in Claude to get the OAuth URL
7. **Start using**: Access your Outlook data through Claude!

## Directory Structure

```
outlook-mcp/
├── index.js                 # Main entry point
├── config.js                # Configuration settings
├── outlook-auth-server.js   # OAuth server (port 3333)
├── package.json
├── auth/                    # Authentication module
│   ├── index.js
│   ├── token-manager.js     # Token storage and refresh
│   └── tools.js             # Auth-related tools
├── calendar/                # Calendar module
│   ├── index.js
│   ├── list.js              # List events
│   ├── create.js            # Create event
│   ├── decline.js           # Decline event
│   ├── cancel.js            # Cancel event
│   └── delete.js            # Delete event
├── email/                   # Email module
│   ├── index.js
│   ├── list.js              # List emails
│   ├── search.js            # Search emails + search by Message-ID
│   ├── read.js              # Read email content
│   ├── send.js              # Send email
│   ├── mark-as-read.js      # Mark as read/unread
│   ├── attachments.js       # List, download, view attachments
│   ├── export.js            # Export single/batch emails
│   ├── delta.js             # Incremental sync
│   └── folder-utils.js      # Folder resolution utilities
├── folder/                  # Folder module
│   ├── index.js
│   ├── list.js              # List folders
│   ├── create.js            # Create folder
│   ├── move.js              # Move emails
│   └── stats.js             # Folder statistics
├── rules/                   # Rules module
│   ├── index.js
│   ├── list.js              # List rules
│   └── create.js            # Create rule
└── utils/                   # Utility functions
    ├── graph-api.js         # Microsoft Graph API helper
    ├── odata-helpers.js     # OData query building
    ├── field-presets.js     # API field selections
    └── mock-data.js         # Test mode data
```

## Tools Reference (27 tools)

### Authentication (3 tools)

| Tool | Description |
|------|-------------|
| `about` | Returns server information and version |
| `authenticate` | Initiates OAuth flow with Microsoft Graph API |
| `check-auth-status` | Checks current authentication status |

### Email (12 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list-emails` | Lists recent emails from inbox | `folder`, `count`, `outputVerbosity` |
| `search-emails` | Search emails with filters or KQL | `query`, `from`, `to`, `subject`, `hasAttachments`, `receivedAfter`, `receivedBefore`, `kqlQuery` |
| `read-email` | Reads content of a specific email | `id`, `includeHeaders`, `outputVerbosity` |
| `send-email` | Composes and sends a new email | `to`, `cc`, `bcc`, `subject`, `body`, `importance` |
| `mark-as-read` | Marks email as read or unread | `id`, `isRead` |
| `list-attachments` | Lists all attachments for an email | `messageId` |
| `download-attachment` | Downloads attachment to disk | `messageId`, `attachmentId`, `savePath` |
| `get-attachment-content` | Gets attachment metadata and content | `messageId`, `attachmentId` |
| `export-email` | Export single email to file | `id`, `format` (mime/eml/markdown/json), `savePath` |
| `batch-export-emails` | Export multiple emails to directory | `emailIds` or `searchQuery`, `format`, `outputDir` |
| `list-emails-delta` | Incremental sync since last call | `folder`, `deltaToken`, `maxResults` |
| `search-by-message-id` | Find email by Message-ID header | `messageId` |

### Folder (4 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list-folders` | Lists mail folders | `includeItemCounts`, `includeChildren` |
| `create-folder` | Creates a new mail folder | `name`, `parentFolder` |
| `move-emails` | Moves emails between folders | `emailIds`, `targetFolder`, `sourceFolder` |
| `get-folder-stats` | Gets folder statistics for pagination | `folder`, `outputVerbosity` |

### Calendar (5 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list-events` | Lists upcoming calendar events | `count` |
| `create-event` | Creates a new calendar event | `subject`, `start`, `end`, `attendees`, `body` |
| `decline-event` | Declines a calendar event | `eventId`, `comment` |
| `cancel-event` | Cancels a calendar event | `eventId`, `comment` |
| `delete-event` | Deletes a calendar event | `eventId` |

### Rules (3 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list-rules` | Lists inbox rules | `includeDetails` |
| `create-rule` | Creates a new inbox rule | `name`, `fromAddresses`, `containsSubject`, `moveToFolder`, `markAsRead`, `sequence` |
| `edit-rule-sequence` | Changes rule execution order | `ruleName`, `sequence` |

## Installation

### Prerequisites
- Node.js 14.0.0 or higher
- npm or yarn package manager
- Azure account for app registration

### Install Dependencies

```bash
npm install
```

This will install the required dependencies including:
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `dotenv` - Environment variable management

## Azure App Registration & Configuration

To use this MCP server you need to first register and configure an app in Azure Portal.

### App Registration

1. Open [Azure Portal](https://portal.azure.com/) in your browser
2. Sign in with a Microsoft Work or Personal account
3. Search for or click on "App registrations"
4. Click on "New registration"
5. Enter a name for the app, for example "Outlook MCP Server"
6. Select the "Accounts in any organizational directory and personal Microsoft accounts" option
7. In the "Redirect URI" section, select "Web" from the dropdown and enter `http://localhost:3333/auth/callback`
8. Click on "Register"
9. Copy the "Application (client) ID" for use in configuration

### App Permissions

1. From the app settings page, select "API permissions" under Manage
2. Click "Add a permission" > "Microsoft Graph" > "Delegated permissions"
3. Add these permissions:
   - `offline_access`
   - `User.Read`
   - `Mail.Read`
   - `Mail.Send`
   - `Calendars.Read`
   - `Calendars.ReadWrite`
   - `MailboxSettings.Read` (for rules)
4. Click "Add permissions"

### Client Secret

1. Select "Certificates & secrets" under Manage
2. Click "New client secret"
3. Enter a description and select expiration time
4. Click "Add"
5. **Copy the secret VALUE immediately** (not the Secret ID)

## Configuration

### 1. Environment Variables

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Edit `.env` with your Azure credentials:

```bash
MS_CLIENT_ID=your-application-client-id-here
MS_CLIENT_SECRET=your-client-secret-VALUE-here
USE_TEST_MODE=false
```

### 2. Claude Desktop Configuration

Add to your Claude Desktop config:

```json
{
  "mcpServers": {
    "outlook-assistant": {
      "command": "node",
      "args": ["/absolute/path/to/outlook-mcp/index.js"],
      "env": {
        "USE_TEST_MODE": "false",
        "OUTLOOK_CLIENT_ID": "your-client-id-here",
        "OUTLOOK_CLIENT_SECRET": "your-client-secret-here"
      }
    }
  }
}
```

## Authentication Flow

### Step 1: Start the Authentication Server
```bash
npm run auth-server
```
This starts a local server on port 3333 that handles the OAuth callback.

### Step 2: Authenticate with Microsoft
1. In Claude, use the `authenticate` tool
2. Visit the provided URL in your browser
3. Sign in with your Microsoft account
4. Grant the requested permissions
5. Tokens are saved to `~/.outlook-mcp-tokens.json`

## Troubleshooting

### Common Issues

#### "Cannot find module '@modelcontextprotocol/sdk/server/index.js'"
```bash
npm install
```

#### "Error: listen EADDRINUSE: address already in use :::3333"
```bash
npx kill-port 3333
npm run auth-server
```

#### "Invalid client secret provided" (AADSTS7000215)
You're using the Secret ID instead of the Secret Value. Go to Azure Portal > Certificates & secrets and copy the **Value** column.

#### Authentication URL doesn't work
Make sure the auth server is running first: `npm run auth-server`

#### get-folder-stats returns API error
Fixed in December 2024: Removed invalid `sizeInBytes` property from Graph API query.

## Development

### Running Tests
```bash
npm test
./test-modular-server.sh    # Interactive MCP Inspector test
./test-direct.sh            # Direct testing
```

### Test Mode
Set `USE_TEST_MODE=true` to use mock data without real API calls.

### Extending the Server

1. Create new module directory (e.g., `contacts/`)
2. Implement tool handlers in separate files
3. Export tool definitions from module `index.js`
4. Import and add tools to `TOOLS` array in main `index.js`

## Changelog

### December 2024
- Added `export-email` - Export single email to MIME/EML/Markdown/JSON
- Added `batch-export-emails` - Export multiple emails with search query support
- Added `list-emails-delta` - Incremental sync with delta tokens
- Added `search-by-message-id` - Find email by Message-ID header
- Fixed `get-folder-stats` - Removed invalid `sizeInBytes` property from Graph API query

## License

MIT
