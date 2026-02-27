/**
 * Authentication-related tools for the Outlook MCP server
 */
const config = require('../config');
const tokenManager = require('./token-manager');

/**
 * About tool handler
 * @returns {object} - MCP response
 */
async function handleAbout() {
  return {
    content: [
      {
        type: 'text',
        text: `📧 MODULAR Outlook Assistant MCP Server v${config.SERVER_VERSION} 📧\n\nProvides access to Microsoft Outlook email, calendar, and contacts through Microsoft Graph API.\nImplemented with a modular architecture for improved maintainability.`,
      },
    ],
  };
}

/**
 * Authentication tool handler
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleAuthenticate(args) {
  const _force = args && args.force === true;

  // For test mode, create a test token
  if (config.USE_TEST_MODE) {
    // Create a test token with a 1-hour expiry
    tokenManager.createTestTokens();

    return {
      content: [
        {
          type: 'text',
          text: 'Successfully authenticated with Microsoft Graph API (test mode)',
        },
      ],
    };
  }

  // For real authentication, generate an auth URL and instruct the user to visit it
  const authUrl = `${config.AUTH_CONFIG.authServerUrl}/auth?client_id=${config.AUTH_CONFIG.clientId}`;

  return {
    content: [
      {
        type: 'text',
        text: `Authentication required. Please visit the following URL to authenticate with Microsoft: ${authUrl}\n\nAfter authentication, you will be redirected back to this application.`,
      },
    ],
  };
}

/**
 * Check authentication status tool handler
 * @returns {object} - MCP response
 */
async function handleCheckAuthStatus() {
  console.error('[CHECK-AUTH-STATUS] Starting authentication status check');

  const tokens = tokenManager.loadTokenCache();

  console.error(`[CHECK-AUTH-STATUS] Tokens loaded: ${tokens ? 'YES' : 'NO'}`);

  if (!tokens || !tokens.access_token) {
    console.error('[CHECK-AUTH-STATUS] No valid access token found');
    return {
      content: [{ type: 'text', text: 'Not authenticated' }],
    };
  }

  console.error('[CHECK-AUTH-STATUS] Access token present');
  console.error(`[CHECK-AUTH-STATUS] Token expires at: ${tokens.expires_at}`);
  console.error(`[CHECK-AUTH-STATUS] Current time: ${Date.now()}`);

  return {
    content: [{ type: 'text', text: 'Authenticated and ready' }],
  };
}

// Tool definitions
const authTools = [
  {
    name: 'auth',
    description:
      'Manage authentication with Microsoft Graph API. action=status (default) checks auth state, action=authenticate starts OAuth flow, action=about shows server info.',
    annotations: {
      title: 'Authentication',
      readOnlyHint: false,
      destructiveHint: false,
      openWorldHint: false,
    },
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['status', 'authenticate', 'about'],
          description: 'Action to perform (default: status)',
        },
        force: {
          type: 'boolean',
          description:
            'Force re-authentication even if already authenticated (action=authenticate only)',
        },
      },
      required: [],
    },
    handler: async (args) => {
      const action = args.action || 'status';
      switch (action) {
        case 'authenticate':
          return handleAuthenticate(args);
        case 'about':
          return handleAbout();
        case 'status':
        default:
          return handleCheckAuthStatus();
      }
    },
  },
];

module.exports = {
  authTools,
  handleAbout,
  handleAuthenticate,
  handleCheckAuthStatus,
};
