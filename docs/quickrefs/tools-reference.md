# Tools Reference - outlook-mcp

Quick reference for all 27 MCP tools.

## Authentication (3 tools)

| Tool | Description |
|------|-------------|
| `about` | Server info and version |
| `authenticate` | Start OAuth flow, returns auth URL |
| `check-auth-status` | Check if authenticated |

## Email (12 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list-emails` | List inbox emails | `folder`, `count`, `outputVerbosity` |
| `search-emails` | Search with filters/KQL | `query`, `from`, `to`, `subject`, `kqlQuery` |
| `read-email` | Read email content | `id`, `includeHeaders`, `outputVerbosity` |
| `send-email` | Send new email | `to`, `cc`, `bcc`, `subject`, `body` |
| `mark-as-read` | Mark read/unread | `id`, `isRead` |
| `list-attachments` | List email attachments | `messageId` |
| `download-attachment` | Download to disk | `messageId`, `attachmentId`, `savePath` |
| `get-attachment-content` | Get attachment data | `messageId`, `attachmentId` |
| `export-email` | Export single email | `id`, `format`, `savePath` |
| `batch-export-emails` | Export multiple emails | `emailIds`, `format`, `outputDir` |
| `list-emails-delta` | Incremental sync | `folder`, `deltaToken`, `maxResults` |
| `search-by-message-id` | Find by Message-ID | `messageId` |

### Email Search Parameters

```
query           - General search text
from            - Sender email/name
to              - Recipient email/name
subject         - Subject contains
hasAttachments  - Boolean filter
receivedAfter   - Date filter (ISO 8601)
receivedBefore  - Date filter (ISO 8601)
kqlQuery        - Raw KQL for advanced search
```

### Export Formats

| Format | Extension | Description |
|--------|-----------|-------------|
| `mime` | `.eml` | Full MIME format with headers |
| `eml` | `.eml` | Alias for mime |
| `markdown` | `.md` | Human-readable markdown |
| `json` | `.json` | Structured JSON |

## Calendar (5 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list-events` | List upcoming events | `count` |
| `create-event` | Create new event | `subject`, `start`, `end`, `attendees`, `body` |
| `decline-event` | Decline invitation | `eventId`, `comment` |
| `cancel-event` | Cancel event you organized | `eventId`, `comment` |
| `delete-event` | Delete from calendar | `eventId` |

### Event Date Format

```
start: "2024-01-15T10:00:00"
end: "2024-01-15T11:00:00"
```

## Folder (4 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list-folders` | List mail folders | `includeItemCounts`, `includeChildren` |
| `create-folder` | Create new folder | `name`, `parentFolder` |
| `move-emails` | Move emails | `emailIds`, `targetFolder`, `sourceFolder` |
| `get-folder-stats` | Folder statistics | `folder`, `outputVerbosity` |

### Common Folder Names

- `inbox` - Main inbox
- `sentitems` - Sent mail
- `drafts` - Draft emails
- `deleteditems` - Trash
- `archive` - Archive folder
- Custom folder names also work

## Rules (3 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list-rules` | List inbox rules | `includeDetails` |
| `create-rule` | Create new rule | `name`, `fromAddresses`, `containsSubject`, `moveToFolder`, `markAsRead`, `sequence` |
| `edit-rule-sequence` | Change rule order | `ruleName`, `sequence` |

## Output Verbosity

Many tools support `outputVerbosity` parameter:

| Level | Description |
|-------|-------------|
| `minimal` | Essential fields only (token efficient) |
| `standard` | Common fields (default) |
| `full` | All available fields |

## Common Patterns

### List recent emails
```
list-emails(folder: "inbox", count: 10, outputVerbosity: "minimal")
```

### Search emails from sender
```
search-emails(from: "boss@company.com", receivedAfter: "2024-01-01")
```

### Export emails to markdown
```
batch-export-emails(searchQuery: "from:important@email.com", format: "markdown", outputDir: "/tmp/exports")
```

### Incremental sync
```
list-emails-delta(folder: "inbox")  # First call - returns deltaToken
list-emails-delta(folder: "inbox", deltaToken: "...")  # Subsequent calls
```
