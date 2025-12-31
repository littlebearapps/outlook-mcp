/**
 * Folder management module for Outlook MCP server
 */
const handleListFolders = require('./list');
const handleCreateFolder = require('./create');
const handleMoveEmails = require('./move');
const handleGetFolderStats = require('./stats');

// Folder management tool definitions
const folderTools = [
  {
    name: "list-folders",
    description: "Lists mail folders in your Outlook account",
    inputSchema: {
      type: "object",
      properties: {
        includeItemCounts: {
          type: "boolean",
          description: "Include counts of total and unread items"
        },
        includeChildren: {
          type: "boolean",
          description: "Include child folders in hierarchy"
        }
      },
      required: []
    },
    handler: handleListFolders
  },
  {
    name: "create-folder",
    description: "Creates a new mail folder",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the folder to create"
        },
        parentFolder: {
          type: "string",
          description: "Optional parent folder name (default is root)"
        }
      },
      required: ["name"]
    },
    handler: handleCreateFolder
  },
  {
    name: "move-emails",
    description: "Moves emails from one folder to another",
    inputSchema: {
      type: "object",
      properties: {
        emailIds: {
          type: "string",
          description: "Comma-separated list of email IDs to move"
        },
        targetFolder: {
          type: "string",
          description: "Name of the folder to move emails to"
        },
        sourceFolder: {
          type: "string",
          description: "Optional name of the source folder (default is inbox)"
        }
      },
      required: ["emailIds", "targetFolder"]
    },
    handler: handleMoveEmails
  },
  {
    name: "get-folder-stats",
    description: "Get folder email counts (total, unread, size) for pagination planning. Use before listing large folders.",
    inputSchema: {
      type: "object",
      properties: {
        folder: {
          type: "string",
          description: "Folder name (inbox, sent, drafts, etc.) or display name. Default: inbox"
        },
        outputVerbosity: {
          type: "string",
          enum: ["minimal", "standard", "full"],
          description: "Output detail: minimal=counts only, standard=table with hints (default), full=all stats with recommendations"
        }
      },
      required: []
    },
    handler: handleGetFolderStats
  }
];

module.exports = {
  folderTools,
  handleListFolders,
  handleCreateFolder,
  handleMoveEmails,
  handleGetFolderStats
};
