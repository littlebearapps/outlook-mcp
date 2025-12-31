# Outlook MCP Server

A modular Model Context Protocol (MCP) server that connects Claude with Microsoft Outlook through the Microsoft Graph API.

[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/ryaker-outlook-mcp-badge.png)](https://mseep.ai/app/ryaker-outlook-mcp)

Certified by MCPHub https://mcphub.com/mcp-servers/ryaker/outlook-mcp

## Features

- **Email Management**: List, search, read, send, export emails with attachment support
- **Email Headers & Forensics**: Get raw headers, MIME content for archival/analysis
- **Conversation Threading**: List, retrieve, and export entire email threads
- **Calendar Management**: List, create, accept, decline, cancel, and delete calendar events
- **Folder Management**: List, create folders; move emails between folders; get folder statistics
- **Rules Management**: List, create, and reorder inbox rules
- **Contacts & People**: Full CRUD for contacts + relevance-based people search
- **Categories & Focused Inbox**: Manage categories and Focused Inbox overrides
- **Mailbox Settings**: Configure auto-replies, working hours, timezone
- **Advanced Features**: Shared mailbox access, message flags, meeting room search
- **Export Capabilities**: Export to MIME/EML, MBOX, Markdown, JSON, HTML formats
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
├── index.js                 # Main entry point (55 tools)
├── config.js                # Configuration settings
├── outlook-auth-server.js   # OAuth server (port 3333)
├── package.json
├── auth/                    # Authentication module (3 tools)
├── calendar/                # Calendar module (5 tools)
├── email/                   # Email module (17 tools)
│   ├── headers.js           # Email header retrieval
│   ├── mime.js              # Raw MIME/EML content
│   ├── conversations.js     # Thread listing/export
│   └── ...                  # List, search, send, attachments, export
├── folder/                  # Folder module (4 tools)
├── rules/                   # Rules module (3 tools)
├── contacts/                # Contacts module (7 tools)
├── categories/              # Categories module (7 tools)
├── settings/                # Settings module (5 tools)
├── advanced/                # Advanced module (4 tools)
└── utils/                   # Utility functions
    ├── graph-api.js         # Microsoft Graph API helper
    ├── odata-helpers.js     # OData query building
    ├── field-presets.js     # API field selections
    └── mock-data.js         # Test mode data
```

## Tools Reference (55 tools)

See `docs/quickrefs/tools-reference.md` for complete parameter details.

### Authentication (3 tools)

| Tool | Description |
|------|-------------|
| `about` | Returns server information and version |
| `authenticate` | Initiates OAuth flow with Microsoft Graph API |
| `check-auth-status` | Checks current authentication status |

### Email (17 tools)

| Tool | Description |
|------|-------------|
| `list-emails` | Lists recent emails from inbox |
| `search-emails` | Search emails with filters or KQL |
| `read-email` | Reads content of a specific email |
| `send-email` | Composes and sends a new email |
| `mark-as-read` | Marks email as read or unread |
| `list-attachments` | Lists all attachments for an email |
| `download-attachment` | Downloads attachment to disk |
| `get-attachment-content` | Gets attachment metadata and content |
| `export-email` | Export single email to file |
| `batch-export-emails` | Export multiple emails to directory |
| `list-emails-delta` | Incremental sync since last call |
| `search-by-message-id` | Find email by Message-ID header |
| `get-email-headers` | Get all headers for forensics/analysis |
| `get-mime-content` | Get raw MIME/EML content |
| `list-conversations` | List email threads |
| `get-conversation` | Get all messages in a thread |
| `export-conversation` | Export thread (EML/MBOX/MD/JSON/HTML) |

### Calendar (5 tools)

| Tool | Description |
|------|-------------|
| `list-events` | Lists upcoming calendar events |
| `create-event` | Creates a new calendar event |
| `decline-event` | Declines a calendar event |
| `cancel-event` | Cancels a calendar event |
| `delete-event` | Deletes a calendar event |

### Folder (4 tools)

| Tool | Description |
|------|-------------|
| `list-folders` | Lists mail folders |
| `create-folder` | Creates a new mail folder |
| `move-emails` | Moves emails between folders |
| `get-folder-stats` | Gets folder statistics |

### Rules (3 tools)

| Tool | Description |
|------|-------------|
| `list-rules` | Lists inbox rules |
| `create-rule` | Creates a new inbox rule |
| `edit-rule-sequence` | Changes rule execution order |

### Contacts (7 tools)

| Tool | Description |
|------|-------------|
| `list-contacts` | List personal contacts |
| `search-contacts` | Search contacts by name/email |
| `get-contact` | Get contact details |
| `create-contact` | Create new contact |
| `update-contact` | Update existing contact |
| `delete-contact` | Delete contact |
| `search-people` | Relevance-based people search |

### Categories (7 tools)

| Tool | Description |
|------|-------------|
| `list-categories` | List master categories |
| `create-category` | Create new category |
| `update-category` | Update category name/color |
| `delete-category` | Delete category |
| `apply-category` | Apply categories to message(s) |
| `get-focused-inbox-overrides` | List Focused Inbox overrides |
| `set-focused-inbox-override` | Set sender override |

### Settings (5 tools)

| Tool | Description |
|------|-------------|
| `get-mailbox-settings` | Get all mailbox settings |
| `get-automatic-replies` | Get out-of-office config |
| `set-automatic-replies` | Set out-of-office message |
| `get-working-hours` | Get working hours config |
| `set-working-hours` | Set working hours |

### Advanced (4 tools)

| Tool | Description |
|------|-------------|
| `access-shared-mailbox` | Read from shared mailbox |
| `set-message-flag` | Flag for follow-up |
| `clear-message-flag` | Clear follow-up flag |
| `find-meeting-rooms` | Search meeting rooms |

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
   - `Mail.Read`, `Mail.Send`
   - `Mail.Read.Shared` (for shared mailbox access)
   - `Calendars.Read`, `Calendars.ReadWrite`
   - `Contacts.Read`, `Contacts.ReadWrite`
   - `MailboxSettings.Read`, `MailboxSettings.ReadWrite`
   - `People.Read` (for people search)
   - `Place.Read.All` (for meeting room search)
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

### December 2024 (v2.0)
- **55 tools** across 9 modules (was 27 tools across 5 modules)
- Added **Email Headers & MIME**: `get-email-headers`, `get-mime-content`
- Added **Conversation Threading**: `list-conversations`, `get-conversation`, `export-conversation`
- Added **Contacts Module** (7 tools): Full CRUD + people search
- Added **Categories Module** (7 tools): Categories + Focused Inbox overrides
- Added **Settings Module** (5 tools): Auto-replies, working hours
- Added **Advanced Module** (4 tools): Shared mailbox, flags, meeting rooms
- Export formats now include MBOX and HTML for conversations
- Added `export-email`, `batch-export-emails`, `list-emails-delta`, `search-by-message-id`
- Fixed `get-folder-stats` - Removed invalid `sizeInBytes` property

## License

MIT
