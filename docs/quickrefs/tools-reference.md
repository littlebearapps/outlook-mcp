---
tags:
  - mcp
---

# Tools Reference - outlook-mcp

Quick reference for all 55 MCP tools across 9 modules.

## Authentication (3 tools)

| Tool | Description |
|------|-------------|
| `about` | Server info and version |
| `authenticate` | Start OAuth flow, returns auth URL |
| `check-auth-status` | Check if authenticated |

## Email (17 tools)

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
| `get-email-headers` | Get all headers (forensics) | `id`, `groupByType`, `importantOnly` |
| `get-mime-content` | Get raw MIME/EML content | `id`, `headersOnly`, `base64`, `maxSize` |
| `list-conversations` | List email threads | `folder`, `count`, `outputVerbosity` |
| `get-conversation` | Get all messages in thread | `conversationId`, `includeHeaders` |
| `export-conversation` | Export thread to file | `conversationId`, `format`, `outputDir` |

### Export Formats

| Format | Description |
|--------|-------------|
| `mime`/`eml` | Full MIME format with headers |
| `mbox` | Unix MBOX archive (conversations) |
| `markdown` | Human-readable markdown |
| `json` | Structured JSON |
| `html` | Formatted HTML (conversations) |

## Calendar (5 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list-events` | List upcoming events | `count` |
| `create-event` | Create new event | `subject`, `start`, `end`, `attendees`, `body` |
| `decline-event` | Decline invitation | `eventId`, `comment` |
| `cancel-event` | Cancel event you organized | `eventId`, `comment` |
| `delete-event` | Delete from calendar | `eventId` |

## Folder (4 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list-folders` | List mail folders | `includeItemCounts`, `includeChildren` |
| `create-folder` | Create new folder | `name`, `parentFolder` |
| `move-emails` | Move emails | `emailIds`, `targetFolder`, `sourceFolder` |
| `get-folder-stats` | Folder statistics | `folder`, `outputVerbosity` |

## Rules (3 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list-rules` | List inbox rules | `includeDetails` |
| `create-rule` | Create new rule | `name`, `fromAddresses`, `moveToFolder` |
| `edit-rule-sequence` | Change rule order | `ruleName`, `sequence` |

## Contacts (7 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list-contacts` | List personal contacts | `count`, `outputVerbosity` |
| `search-contacts` | Search contacts | `query`, `count` |
| `get-contact` | Get contact details | `id` |
| `create-contact` | Create new contact | `givenName`, `surname`, `emailAddresses` |
| `update-contact` | Update contact | `id`, (any field) |
| `delete-contact` | Delete contact | `id` |
| `search-people` | Relevance-based search | `query`, `count` |

## Categories (7 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list-categories` | List master categories | `outputVerbosity` |
| `create-category` | Create category | `displayName`, `color` |
| `update-category` | Update category | `id`, `displayName`, `color` |
| `delete-category` | Delete category | `id` |
| `apply-category` | Apply to message(s) | `messageId`, `categories`, `action` |
| `get-focused-inbox-overrides` | List Focused Inbox rules | `outputVerbosity` |
| `set-focused-inbox-override` | Set sender override | `emailAddress`, `classifyAs` |

### Category Colors

`preset0`-`preset24`: Red, Orange, Brown, Yellow, Green, Teal, Olive, Blue, Purple, etc.

## Settings (5 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `get-mailbox-settings` | All mailbox settings | `section` |
| `get-automatic-replies` | Get out-of-office config | - |
| `set-automatic-replies` | Set out-of-office | `enabled`, `startDateTime`, `endDateTime`, `internalReplyMessage` |
| `get-working-hours` | Get working hours | - |
| `set-working-hours` | Set working hours | `startTime`, `endTime`, `daysOfWeek`, `timeZone` |

## Advanced (4 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `access-shared-mailbox` | Read shared mailbox | `sharedMailbox`, `folder`, `count` |
| `set-message-flag` | Flag for follow-up | `messageId`, `dueDateTime` |
| `clear-message-flag` | Clear flag | `messageId`, `markComplete` |
| `find-meeting-rooms` | Search meeting rooms | `query`, `building`, `capacity` |

## Output Verbosity

| Level | Description |
|-------|-------------|
| `minimal` | Essential fields only (token efficient) |
| `standard` | Common fields (default) |
| `full` | All available fields |

## Common Patterns

```javascript
// List recent emails
list-emails(folder: "inbox", count: 10)

// Search with filters
search-emails(from: "boss@company.com", receivedAfter: "2024-01-01")

// Get email headers for forensics
get-email-headers(id: "...", importantOnly: true)

// Export conversation to markdown
export-conversation(conversationId: "...", format: "markdown", outputDir: "/tmp")

// Set out-of-office
set-automatic-replies(enabled: true, internalReplyMessage: "I'm away...")

// Access shared mailbox
access-shared-mailbox(sharedMailbox: "team@company.com", folder: "inbox")
```
