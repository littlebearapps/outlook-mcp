# Outlook MCP Server

Give Claude full access to your Outlook email, calendar, and contacts.

[![npm version](https://img.shields.io/npm/v/@littlebearapps/outlook-mcp)](https://www.npmjs.com/package/@littlebearapps/outlook-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@littlebearapps/outlook-mcp)](https://www.npmjs.com/package/@littlebearapps/outlook-mcp)
[![CI](https://github.com/littlebearapps/outlook-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/littlebearapps/outlook-mcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

A [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server that connects Claude and other AI assistants with Microsoft Outlook through the Microsoft Graph API. 55 tools across 9 modules for managing email, calendar, contacts, folders, rules, categories, settings, and more.

## Why Outlook MCP?

| Without Outlook MCP | With Outlook MCP |
|---------------------|------------------|
| Switch between Claude and Outlook to manage email | Read, search, send, and export emails directly from Claude |
| Manually search and export email threads | 17 email tools including search, threading, and bulk export |
| Context-switch for calendar and contacts | Manage calendar events, contacts, and settings in one place |
| Copy-paste email content into conversations | Claude reads your emails natively with full context |
| No programmatic access to mailbox rules or categories | Create inbox rules, manage categories, configure auto-replies |

## Quick Start

### 1. Install

```bash
npm install -g @littlebearapps/outlook-mcp
```

Or run directly without installing:

```bash
npx @littlebearapps/outlook-mcp
```

### 2. Register an Azure App

You need a Microsoft Azure app registration to authenticate. See the **[Azure Setup Guide](docs/guides/azure-setup.md)** for a detailed walkthrough (including first-time Azure account creation), or if you've done this before:

1. Create a new app registration at [portal.azure.com](https://portal.azure.com/)
2. Set redirect URI to `http://localhost:3333/auth/callback`
3. Add Microsoft Graph delegated permissions (Mail, Calendar, Contacts)
4. Create a client secret and copy the **Value** (not the Secret ID)

### 3. Configure Claude Desktop

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "outlook": {
      "command": "npx",
      "args": ["@littlebearapps/outlook-mcp"],
      "env": {
        "OUTLOOK_CLIENT_ID": "your-application-client-id",
        "OUTLOOK_CLIENT_SECRET": "your-client-secret-VALUE"
      }
    }
  }
}
```

### 4. Authenticate

1. Start the auth server: `outlook-mcp-auth` (or `npx @littlebearapps/outlook-mcp-auth`)
2. In Claude, use the `authenticate` tool to get an OAuth URL
3. Open the URL, sign in with your Microsoft account, and grant permissions
4. Tokens are saved locally and refresh automatically

## Features

| Module | Tools | What You Can Do |
|--------|------:|-----------------|
| **Email** | 17 | List, search, read, send, mark read/unread, attachments, headers, MIME content, conversation threading, delta sync, bulk export |
| **Calendar** | 5 | List upcoming events, create new events, decline, cancel, and delete |
| **Contacts** | 7 | Full CRUD for personal contacts plus relevance-based people search |
| **Categories** | 7 | Create and manage categories, apply to messages, configure Focused Inbox overrides |
| **Settings** | 5 | Get/set automatic replies (out-of-office), working hours, and timezone |
| **Folder** | 4 | List folders, create new folders, move emails between folders, folder statistics |
| **Rules** | 3 | List, create, and reorder inbox rules |
| **Advanced** | 4 | Shared mailbox access, message follow-up flags, meeting room search |
| **Auth** | 3 | OAuth flow, authentication status, server info |

**55 tools total.** See the [Tools Reference](docs/quickrefs/tools-reference.md) for complete parameter details.

### Export Formats

Export emails and conversations to multiple formats:

| Format | Use Case |
|--------|----------|
| `mime` / `eml` | Full MIME with headers — archival and forensics |
| `mbox` | Unix MBOX archive — batch export conversations |
| `markdown` | Human-readable — paste into documents |
| `json` | Structured data — programmatic processing |
| `html` | Formatted — visual archival of threads |

## Installation

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** (included with Node.js)
- **Azure account** for app registration ([free tier works](https://azure.microsoft.com/free/))

### From npm (recommended)

```bash
npm install -g @littlebearapps/outlook-mcp
```

### From source

```bash
git clone https://github.com/littlebearapps/outlook-mcp.git
cd outlook-mcp
npm install
```

## Azure App Registration

> **First time with Azure?** The [Azure Setup Guide](docs/guides/azure-setup.md) covers everything from creating an account to your first authentication, including billing setup and common pitfalls.

### Create the App

1. Open [Azure Portal](https://portal.azure.com/)
2. Sign in with a Microsoft Work or Personal account
3. Search for **App registrations** and click **New registration**
4. Enter a name (e.g. "Outlook MCP Server")
5. Select **Accounts in any organizational directory and personal Microsoft accounts**
6. Set redirect URI: platform **Web**, URI `http://localhost:3333/auth/callback`
7. Click **Register**
8. Copy the **Application (client) ID**

### Add Permissions

1. Go to **API permissions** > **Add a permission** > **Microsoft Graph** > **Delegated permissions**
2. Add these permissions:
   - `offline_access`
   - `User.Read`
   - `Mail.Read`, `Mail.ReadWrite`, `Mail.Send`
   - `Mail.Read.Shared` (for shared mailbox access)
   - `Calendars.Read`, `Calendars.ReadWrite`
   - `Contacts.Read`, `Contacts.ReadWrite`
   - `MailboxSettings.Read`, `MailboxSettings.ReadWrite`
   - `People.Read` (for people search)
   - `Place.Read.All` (for meeting room search)
3. Click **Add permissions**

### Create a Client Secret

1. Go to **Certificates & secrets** > **New client secret**
2. Enter a description and select expiration
3. Click **Add**
4. **Copy the secret Value immediately** — you won't be able to see it again. Use the **Value**, not the Secret ID.

## Configuration

### Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit with your Azure credentials:

```bash
OUTLOOK_CLIENT_ID=your-application-client-id
OUTLOOK_CLIENT_SECRET=your-client-secret-VALUE
USE_TEST_MODE=false
```

> **Note:** The server also accepts `MS_CLIENT_ID` and `MS_CLIENT_SECRET` for backwards compatibility.

### Claude Desktop Configuration

Add to your Claude Desktop config:

```json
{
  "mcpServers": {
    "outlook": {
      "command": "npx",
      "args": ["@littlebearapps/outlook-mcp"],
      "env": {
        "OUTLOOK_CLIENT_ID": "your-application-client-id",
        "OUTLOOK_CLIENT_SECRET": "your-client-secret-VALUE"
      }
    }
  }
}
```

Or if installed from source:

```json
{
  "mcpServers": {
    "outlook": {
      "command": "node",
      "args": ["/path/to/outlook-mcp/index.js"],
      "env": {
        "OUTLOOK_CLIENT_ID": "your-application-client-id",
        "OUTLOOK_CLIENT_SECRET": "your-client-secret-VALUE"
      }
    }
  }
}
```

## Authentication Flow

### Step 1: Start the Auth Server

```bash
npm run auth-server
```

This starts a local server on port 3333 to handle the OAuth callback.

### Step 2: Authenticate

1. In Claude, use the `authenticate` tool
2. Open the provided URL in your browser
3. Sign in with your Microsoft account and grant permissions
4. Tokens are saved to `~/.outlook-mcp-tokens.json` and refresh automatically

## Directory Structure

```
outlook-mcp/
├── index.js                 # Main entry point (55 tools)
├── config.js                # Configuration settings
├── outlook-auth-server.js   # OAuth server (port 3333)
├── auth/                    # Authentication module (3 tools)
├── email/                   # Email module (17 tools)
│   ├── headers.js           # Email header retrieval
│   ├── mime.js              # Raw MIME/EML content
│   ├── conversations.js     # Thread listing/export
│   ├── attachments.js       # Attachment operations
│   └── ...
├── calendar/                # Calendar module (5 tools)
├── contacts/                # Contacts module (7 tools)
├── categories/              # Categories module (7 tools)
├── settings/                # Settings module (5 tools)
├── folder/                  # Folder module (4 tools)
├── rules/                   # Rules module (3 tools)
├── advanced/                # Advanced module (4 tools)
└── utils/
    ├── graph-api.js         # Microsoft Graph API client
    ├── odata-helpers.js     # OData query building
    ├── field-presets.js     # Token-efficient field selections
    ├── response-formatter.js # Verbosity levels
    └── mock-data.js         # Test mode data
```

## Troubleshooting

### "Cannot find module '@modelcontextprotocol/sdk/server/index.js'"

```bash
npm install
```

### "EADDRINUSE: address already in use :::3333"

```bash
npx kill-port 3333
npm run auth-server
```

### "Invalid client secret" (AADSTS7000215)

You're using the Secret **ID** instead of the Secret **Value**. Go to Azure Portal > Certificates & secrets and copy the **Value** column.

### Authentication URL doesn't work

Start the auth server first: `npm run auth-server`

### Empty API responses

Check authentication status with the `check-auth-status` tool. Tokens may have expired — re-authenticate if needed.

## Development

### Running Tests

```bash
npm test                     # Jest unit tests
npm run inspect              # MCP Inspector (interactive)
```

### Test Mode

Run with mock data (no real API calls):

```bash
USE_TEST_MODE=true npm start
```

### Extending the Server

1. Create a new module directory (e.g. `tasks/`)
2. Implement tool handlers in separate files
3. Export tool definitions from the module's `index.js`
4. Import and add tools to the `TOOLS` array in main `index.js`
5. Add tests in `test/`
6. Update `docs/quickrefs/tools-reference.md`

## Documentation

| Guide | Description |
|-------|-------------|
| [Azure Setup Guide](docs/guides/azure-setup.md) | Azure account creation, app registration, permissions, and secrets |
| [Tools Reference](docs/quickrefs/tools-reference.md) | All 55 tools with parameters |

Full documentation: [docs/](docs/README.md)

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

For security concerns, please see our [Security Policy](SECURITY.md). Do not open public issues for vulnerabilities.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## About

Built and maintained by [Little Bear Apps](https://littlebearapps.com). Outlook MCP is open source under the [MIT License](LICENSE).
