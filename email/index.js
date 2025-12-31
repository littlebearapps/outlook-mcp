/**
 * Email module for Outlook MCP server
 */
const handleListEmails = require('./list');
const { handleSearchEmails, handleSearchByMessageId } = require('./search');
const handleReadEmail = require('./read');
const handleSendEmail = require('./send');
const handleMarkAsRead = require('./mark-as-read');
const { handleListAttachments, handleDownloadAttachment, handleGetAttachmentContent } = require('./attachments');
const { handleExportEmail, handleBatchExportEmails } = require('./export');
const handleListEmailsDelta = require('./delta');

// Email tool definitions
const emailTools = [
  {
    name: "list-emails",
    description: "Lists recent emails from your inbox",
    inputSchema: {
      type: "object",
      properties: {
        folder: {
          type: "string",
          description: "Email folder to list (e.g., 'inbox', 'sent', 'drafts', default: 'inbox')"
        },
        count: {
          type: "number",
          description: "Number of emails to retrieve (default: 25, max: 50)"
        },
        outputVerbosity: {
          type: "string",
          enum: ["minimal", "standard", "full"],
          description: "Output detail level: minimal=IDs+subject only, standard=key fields (default), full=all fields with preview"
        }
      },
      required: []
    },
    handler: handleListEmails
  },
  {
    name: "search-emails",
    description: "Search for emails using various criteria",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query text to find in emails"
        },
        folder: {
          type: "string",
          description: "Email folder to search in (default: 'inbox')"
        },
        from: {
          type: "string",
          description: "Filter by sender email address or name"
        },
        to: {
          type: "string",
          description: "Filter by recipient email address or name"
        },
        subject: {
          type: "string",
          description: "Filter by email subject"
        },
        hasAttachments: {
          type: "boolean",
          description: "Filter to only emails with attachments"
        },
        unreadOnly: {
          type: "boolean",
          description: "Filter to only unread emails"
        },
        receivedAfter: {
          type: "string",
          description: "Filter emails received after this date (ISO 8601 or YYYY-MM-DD)"
        },
        receivedBefore: {
          type: "string",
          description: "Filter emails received before this date (ISO 8601 or YYYY-MM-DD)"
        },
        searchAllFolders: {
          type: "boolean",
          description: "Search across all mail folders (default: false, searches only specified folder)"
        },
        count: {
          type: "number",
          description: "Number of results to return (default: 10, max: 50)"
        },
        outputVerbosity: {
          type: "string",
          enum: ["minimal", "standard", "full"],
          description: "Output detail level: minimal=IDs+subject only, standard=key fields (default), full=all fields with preview"
        },
        kqlQuery: {
          type: "string",
          description: "Raw KQL (Keyword Query Language) query for advanced users. Bypasses other search parameters when provided."
        }
      },
      required: []
    },
    handler: handleSearchEmails
  },
  {
    name: "read-email",
    description: "Reads the content of a specific email",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "ID of the email to read"
        },
        includeHeaders: {
          type: "boolean",
          description: "Include email headers (Message-ID, Received, DKIM) for legal/forensic use (default: false)"
        },
        outputVerbosity: {
          type: "string",
          enum: ["minimal", "standard", "full"],
          description: "Output detail level: minimal=headers only, standard=full content (default), full=all fields including IDs"
        }
      },
      required: ["id"]
    },
    handler: handleReadEmail
  },
  {
    name: "send-email",
    description: "Composes and sends a new email",
    inputSchema: {
      type: "object",
      properties: {
        to: {
          type: "string",
          description: "Comma-separated list of recipient email addresses"
        },
        cc: {
          type: "string",
          description: "Comma-separated list of CC recipient email addresses"
        },
        bcc: {
          type: "string",
          description: "Comma-separated list of BCC recipient email addresses"
        },
        subject: {
          type: "string",
          description: "Email subject"
        },
        body: {
          type: "string",
          description: "Email body content (can be plain text or HTML)"
        },
        importance: {
          type: "string",
          description: "Email importance (normal, high, low)",
          enum: ["normal", "high", "low"]
        },
        saveToSentItems: {
          type: "boolean",
          description: "Whether to save the email to sent items"
        }
      },
      required: ["to", "subject", "body"]
    },
    handler: handleSendEmail
  },
  {
    name: "mark-as-read",
    description: "Marks an email as read or unread",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "ID of the email to mark as read/unread"
        },
        isRead: {
          type: "boolean",
          description: "Whether to mark as read (true) or unread (false). Default: true"
        }
      },
      required: ["id"]
    },
    handler: handleMarkAsRead
  },
  {
    name: "list-attachments",
    description: "Lists all attachments for a specific email message",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "The ID of the email message to list attachments for"
        }
      },
      required: ["messageId"]
    },
    handler: handleListAttachments
  },
  {
    name: "download-attachment",
    description: "Downloads an attachment from an email and saves it to disk",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "The ID of the email message"
        },
        attachmentId: {
          type: "string",
          description: "The ID of the attachment to download"
        },
        savePath: {
          type: "string",
          description: "Optional directory path to save the file (defaults to current directory)"
        }
      },
      required: ["messageId", "attachmentId"]
    },
    handler: handleDownloadAttachment
  },
  {
    name: "get-attachment-content",
    description: "Gets attachment metadata and content (displays text files, provides info for binary files)",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "The ID of the email message"
        },
        attachmentId: {
          type: "string",
          description: "The ID of the attachment"
        }
      },
      required: ["messageId", "attachmentId"]
    },
    handler: handleGetAttachmentContent
  },
  {
    name: "export-email",
    description: "Export single email to disk (MIME/EML, Markdown, or JSON format)",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "ID of the email to export (required)"
        },
        format: {
          type: "string",
          enum: ["mime", "eml", "markdown", "json"],
          description: "Export format: mime/eml (RFC822), markdown (default), json"
        },
        savePath: {
          type: "string",
          description: "File path or directory to save (default: current directory)"
        },
        includeAttachments: {
          type: "boolean",
          description: "Include attachments (default: true)"
        }
      },
      required: ["id"]
    },
    handler: handleExportEmail
  },
  {
    name: "batch-export-emails",
    description: "Export multiple emails to directory (10-50 default, max 100)",
    inputSchema: {
      type: "object",
      properties: {
        emailIds: {
          type: "array",
          items: { type: "string" },
          description: "Array of email IDs to export"
        },
        searchQuery: {
          type: "object",
          properties: {
            folder: { type: "string", description: "Folder to search (default: inbox)" },
            from: { type: "string", description: "Filter by sender" },
            subject: { type: "string", description: "Filter by subject" },
            receivedAfter: { type: "string", description: "Filter emails after date (ISO 8601)" },
            receivedBefore: { type: "string", description: "Filter emails before date (ISO 8601)" },
            maxResults: { type: "number", description: "Max emails to export (default: 25, max: 100)" }
          },
          description: "Search query to find emails (alternative to emailIds)"
        },
        format: {
          type: "string",
          enum: ["mime", "markdown", "json"],
          description: "Export format (default: markdown)"
        },
        outputDir: {
          type: "string",
          description: "Output directory path (required)"
        },
        includeAttachments: {
          type: "boolean",
          description: "Include attachments (default: false for batch)"
        }
      },
      required: ["outputDir"]
    },
    handler: handleBatchExportEmails
  },
  {
    name: "list-emails-delta",
    description: "Incremental sync - get only changes since last sync. Returns deltaToken for next call.",
    inputSchema: {
      type: "object",
      properties: {
        folder: {
          type: "string",
          description: "Folder to sync (default: inbox)"
        },
        deltaToken: {
          type: "string",
          description: "Token from previous delta call (omit for initial sync)"
        },
        maxResults: {
          type: "number",
          description: "Max results per page (default: 100, max: 200)"
        },
        outputVerbosity: {
          type: "string",
          enum: ["minimal", "standard", "full"],
          description: "Output detail level (default: standard)"
        }
      },
      required: []
    },
    handler: handleListEmailsDelta
  },
  {
    name: "search-by-message-id",
    description: "Find email by internetMessageId header (for threading, deduplication)",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "Full Message-ID header value (e.g., <abc123@example.com>)"
        },
        outputVerbosity: {
          type: "string",
          enum: ["minimal", "standard", "full"],
          description: "Output detail level (default: standard)"
        }
      },
      required: ["messageId"]
    },
    handler: handleSearchByMessageId
  }
];

module.exports = {
  emailTools,
  handleListEmails,
  handleSearchEmails,
  handleSearchByMessageId,
  handleReadEmail,
  handleSendEmail,
  handleMarkAsRead,
  handleListAttachments,
  handleDownloadAttachment,
  handleGetAttachmentContent,
  handleExportEmail,
  handleBatchExportEmails,
  handleListEmailsDelta
};
