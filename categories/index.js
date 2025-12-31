/**
 * Categories module for Outlook MCP server
 *
 * Manages Outlook master categories and Focused Inbox overrides.
 */
const { callGraphAPI } = require('../utils/graph-api');
const { ensureAuthenticated } = require('../auth');

// Category color presets (Outlook uses these names)
const CATEGORY_COLORS = [
  'preset0', 'preset1', 'preset2', 'preset3', 'preset4', 'preset5',
  'preset6', 'preset7', 'preset8', 'preset9', 'preset10', 'preset11',
  'preset12', 'preset13', 'preset14', 'preset15', 'preset16', 'preset17',
  'preset18', 'preset19', 'preset20', 'preset21', 'preset22', 'preset23',
  'preset24'
];

// Map preset numbers to human-readable colors
const COLOR_NAMES = {
  'preset0': 'Red',
  'preset1': 'Orange',
  'preset2': 'Brown',
  'preset3': 'Yellow',
  'preset4': 'Green',
  'preset5': 'Teal',
  'preset6': 'Olive',
  'preset7': 'Blue',
  'preset8': 'Purple',
  'preset9': 'Cranberry',
  'preset10': 'Steel',
  'preset11': 'DarkSteel',
  'preset12': 'Gray',
  'preset13': 'DarkGray',
  'preset14': 'Black',
  'preset15': 'DarkRed',
  'preset16': 'DarkOrange',
  'preset17': 'DarkBrown',
  'preset18': 'DarkYellow',
  'preset19': 'DarkGreen',
  'preset20': 'DarkTeal',
  'preset21': 'DarkOlive',
  'preset22': 'DarkBlue',
  'preset23': 'DarkPurple',
  'preset24': 'DarkCranberry'
};

/**
 * Format a category for display
 */
function formatCategory(category) {
  const colorName = COLOR_NAMES[category.color] || category.color;
  return {
    id: category.id,
    displayName: category.displayName,
    color: category.color,
    colorName: colorName
  };
}

/**
 * List master categories handler
 */
async function handleListCategories(args) {
  const outputVerbosity = args.outputVerbosity || 'standard';

  try {
    const accessToken = await ensureAuthenticated();

    const response = await callGraphAPI(
      accessToken,
      '/me/outlook/masterCategories',
      'GET'
    );

    const categories = response.value || [];

    if (categories.length === 0) {
      return {
        content: [{
          type: "text",
          text: "No categories found. Use `create-category` to create your first category."
        }]
      };
    }

    // Format output based on verbosity
    let output = [];
    output.push(`# Master Categories (${categories.length})\n`);

    if (outputVerbosity === 'minimal') {
      output.push(categories.map(c => `- ${c.displayName}`).join('\n'));
    } else {
      output.push('| Category | Color | ID |');
      output.push('|----------|-------|-----|');
      categories.forEach(cat => {
        const colorName = COLOR_NAMES[cat.color] || cat.color;
        const idDisplay = outputVerbosity === 'full' ? cat.id : cat.id.substring(0, 8) + '...';
        output.push(`| ${cat.displayName} | ${colorName} | ${idDisplay} |`);
      });
    }

    return {
      content: [{
        type: "text",
        text: output.join('\n')
      }],
      _meta: {
        count: categories.length,
        categories: categories.map(formatCategory)
      }
    };
  } catch (error) {
    if (error.message === 'Authentication required') {
      return {
        content: [{
          type: "text",
          text: "Authentication required. Please use the 'authenticate' tool first."
        }]
      };
    }
    return {
      content: [{
        type: "text",
        text: `Error listing categories: ${error.message}`
      }]
    };
  }
}

/**
 * Create category handler
 */
async function handleCreateCategory(args) {
  const { displayName, color } = args;

  if (!displayName) {
    return {
      content: [{
        type: "text",
        text: "Category name (displayName) is required."
      }]
    };
  }

  // Validate color if provided
  if (color && !CATEGORY_COLORS.includes(color)) {
    return {
      content: [{
        type: "text",
        text: `Invalid color. Valid options: ${CATEGORY_COLORS.join(', ')}\n\nColor names: ${Object.entries(COLOR_NAMES).map(([k,v]) => `${k}=${v}`).join(', ')}`
      }]
    };
  }

  try {
    const accessToken = await ensureAuthenticated();

    const categoryData = {
      displayName: displayName,
      color: color || 'preset0' // Default to red
    };

    const response = await callGraphAPI(
      accessToken,
      '/me/outlook/masterCategories',
      'POST',
      categoryData
    );

    const colorName = COLOR_NAMES[response.color] || response.color;

    return {
      content: [{
        type: "text",
        text: `✅ Category created successfully!\n\n**Name**: ${response.displayName}\n**Color**: ${colorName} (${response.color})\n**ID**: ${response.id}`
      }],
      _meta: {
        category: formatCategory(response)
      }
    };
  } catch (error) {
    if (error.message === 'Authentication required') {
      return {
        content: [{
          type: "text",
          text: "Authentication required. Please use the 'authenticate' tool first."
        }]
      };
    }

    if (error.message.includes('already exists')) {
      return {
        content: [{
          type: "text",
          text: `A category named "${displayName}" already exists.`
        }]
      };
    }

    return {
      content: [{
        type: "text",
        text: `Error creating category: ${error.message}`
      }]
    };
  }
}

/**
 * Update category handler
 */
async function handleUpdateCategory(args) {
  const { id, displayName, color } = args;

  if (!id) {
    return {
      content: [{
        type: "text",
        text: "Category ID is required. Use `list-categories` to find category IDs."
      }]
    };
  }

  if (!displayName && !color) {
    return {
      content: [{
        type: "text",
        text: "At least one of displayName or color must be provided."
      }]
    };
  }

  // Validate color if provided
  if (color && !CATEGORY_COLORS.includes(color)) {
    return {
      content: [{
        type: "text",
        text: `Invalid color. Valid options: ${CATEGORY_COLORS.join(', ')}`
      }]
    };
  }

  try {
    const accessToken = await ensureAuthenticated();

    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (color) updateData.color = color;

    const response = await callGraphAPI(
      accessToken,
      `/me/outlook/masterCategories/${encodeURIComponent(id)}`,
      'PATCH',
      updateData
    );

    const colorName = COLOR_NAMES[response.color] || response.color;

    return {
      content: [{
        type: "text",
        text: `✅ Category updated successfully!\n\n**Name**: ${response.displayName}\n**Color**: ${colorName} (${response.color})\n**ID**: ${response.id}`
      }],
      _meta: {
        category: formatCategory(response)
      }
    };
  } catch (error) {
    if (error.message === 'Authentication required') {
      return {
        content: [{
          type: "text",
          text: "Authentication required. Please use the 'authenticate' tool first."
        }]
      };
    }
    return {
      content: [{
        type: "text",
        text: `Error updating category: ${error.message}`
      }]
    };
  }
}

/**
 * Delete category handler
 */
async function handleDeleteCategory(args) {
  const { id } = args;

  if (!id) {
    return {
      content: [{
        type: "text",
        text: "Category ID is required. Use `list-categories` to find category IDs."
      }]
    };
  }

  try {
    const accessToken = await ensureAuthenticated();

    await callGraphAPI(
      accessToken,
      `/me/outlook/masterCategories/${encodeURIComponent(id)}`,
      'DELETE'
    );

    return {
      content: [{
        type: "text",
        text: `✅ Category deleted successfully.`
      }]
    };
  } catch (error) {
    if (error.message === 'Authentication required') {
      return {
        content: [{
          type: "text",
          text: "Authentication required. Please use the 'authenticate' tool first."
        }]
      };
    }

    if (error.message.includes('not found') || error.message.includes('404')) {
      return {
        content: [{
          type: "text",
          text: `Category not found. Use \`list-categories\` to see available categories.`
        }]
      };
    }

    return {
      content: [{
        type: "text",
        text: `Error deleting category: ${error.message}`
      }]
    };
  }
}

/**
 * Apply category to message(s) handler
 */
async function handleApplyCategory(args) {
  const { messageId, messageIds, categories, action } = args;

  // Support single ID or array
  const ids = messageIds || (messageId ? [messageId] : []);

  if (ids.length === 0) {
    return {
      content: [{
        type: "text",
        text: "Message ID (messageId) or IDs (messageIds) required."
      }]
    };
  }

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return {
      content: [{
        type: "text",
        text: "Categories array is required. Provide category display names."
      }]
    };
  }

  const applyAction = action || 'set'; // 'set', 'add', 'remove'

  try {
    const accessToken = await ensureAuthenticated();

    const results = [];
    const errors = [];

    for (const id of ids) {
      try {
        let newCategories = categories;

        // If adding or removing, get current categories first
        if (applyAction === 'add' || applyAction === 'remove') {
          const current = await callGraphAPI(
            accessToken,
            `/me/messages/${id}?$select=categories`,
            'GET'
          );

          const currentCategories = current.categories || [];

          if (applyAction === 'add') {
            newCategories = [...new Set([...currentCategories, ...categories])];
          } else if (applyAction === 'remove') {
            newCategories = currentCategories.filter(c => !categories.includes(c));
          }
        }

        await callGraphAPI(
          accessToken,
          `/me/messages/${id}`,
          'PATCH',
          { categories: newCategories }
        );

        results.push({ id, success: true, categories: newCategories });
      } catch (err) {
        errors.push({ id, error: err.message });
      }
    }

    let output = [];

    if (results.length > 0) {
      output.push(`✅ Categories ${applyAction === 'remove' ? 'removed from' : 'applied to'} ${results.length} message(s)\n`);

      if (ids.length <= 5) {
        results.forEach(r => {
          output.push(`- ${r.id.substring(0, 20)}...: [${r.categories.join(', ')}]`);
        });
      }
    }

    if (errors.length > 0) {
      output.push(`\n⚠️ ${errors.length} error(s):`);
      errors.forEach(e => {
        output.push(`- ${e.id.substring(0, 20)}...: ${e.error}`);
      });
    }

    return {
      content: [{
        type: "text",
        text: output.join('\n')
      }],
      _meta: {
        successful: results.length,
        failed: errors.length,
        action: applyAction,
        results,
        errors
      }
    };
  } catch (error) {
    if (error.message === 'Authentication required') {
      return {
        content: [{
          type: "text",
          text: "Authentication required. Please use the 'authenticate' tool first."
        }]
      };
    }
    return {
      content: [{
        type: "text",
        text: `Error applying categories: ${error.message}`
      }]
    };
  }
}

/**
 * Get Focused Inbox overrides handler
 */
async function handleGetFocusedInboxOverrides(args) {
  const outputVerbosity = args.outputVerbosity || 'standard';

  try {
    const accessToken = await ensureAuthenticated();

    const response = await callGraphAPI(
      accessToken,
      '/me/inferenceClassification/overrides',
      'GET'
    );

    const overrides = response.value || [];

    if (overrides.length === 0) {
      return {
        content: [{
          type: "text",
          text: "No Focused Inbox overrides configured.\n\nUse `set-focused-inbox-override` to always show emails from specific senders in Focused or Other."
        }]
      };
    }

    let output = [];
    output.push(`# Focused Inbox Overrides (${overrides.length})\n`);

    // Group by classification
    const focused = overrides.filter(o => o.classifyAs === 'focused');
    const other = overrides.filter(o => o.classifyAs === 'other');

    if (focused.length > 0) {
      output.push('## Always Focused');
      focused.forEach(o => {
        const addr = o.senderEmailAddress;
        if (outputVerbosity === 'minimal') {
          output.push(`- ${addr.address}`);
        } else {
          output.push(`- **${addr.name || addr.address}** <${addr.address}>`);
          if (outputVerbosity === 'full') {
            output.push(`  - ID: ${o.id}`);
          }
        }
      });
      output.push('');
    }

    if (other.length > 0) {
      output.push('## Always Other');
      other.forEach(o => {
        const addr = o.senderEmailAddress;
        if (outputVerbosity === 'minimal') {
          output.push(`- ${addr.address}`);
        } else {
          output.push(`- **${addr.name || addr.address}** <${addr.address}>`);
          if (outputVerbosity === 'full') {
            output.push(`  - ID: ${o.id}`);
          }
        }
      });
    }

    return {
      content: [{
        type: "text",
        text: output.join('\n')
      }],
      _meta: {
        count: overrides.length,
        focused: focused.length,
        other: other.length,
        overrides: overrides
      }
    };
  } catch (error) {
    if (error.message === 'Authentication required') {
      return {
        content: [{
          type: "text",
          text: "Authentication required. Please use the 'authenticate' tool first."
        }]
      };
    }
    return {
      content: [{
        type: "text",
        text: `Error getting Focused Inbox overrides: ${error.message}`
      }]
    };
  }
}

/**
 * Set Focused Inbox override handler
 */
async function handleSetFocusedInboxOverride(args) {
  const { emailAddress, name, classifyAs, action } = args;

  if (!emailAddress) {
    return {
      content: [{
        type: "text",
        text: "Email address is required."
      }]
    };
  }

  const classification = classifyAs || 'focused';
  if (!['focused', 'other'].includes(classification)) {
    return {
      content: [{
        type: "text",
        text: "classifyAs must be 'focused' or 'other'."
      }]
    };
  }

  try {
    const accessToken = await ensureAuthenticated();

    // Check if override already exists
    const existingResponse = await callGraphAPI(
      accessToken,
      '/me/inferenceClassification/overrides',
      'GET'
    );

    const existing = (existingResponse.value || []).find(
      o => o.senderEmailAddress.address.toLowerCase() === emailAddress.toLowerCase()
    );

    // Handle delete action
    if (action === 'delete') {
      if (!existing) {
        return {
          content: [{
            type: "text",
            text: `No override found for ${emailAddress}.`
          }]
        };
      }

      await callGraphAPI(
        accessToken,
        `/me/inferenceClassification/overrides/${existing.id}`,
        'DELETE'
      );

      return {
        content: [{
          type: "text",
          text: `✅ Removed override for ${emailAddress}. Emails will now follow normal Focused Inbox rules.`
        }]
      };
    }

    // Create or update override
    const overrideData = {
      classifyAs: classification,
      senderEmailAddress: {
        address: emailAddress,
        name: name || emailAddress
      }
    };

    let response;
    if (existing) {
      // Update existing
      response = await callGraphAPI(
        accessToken,
        `/me/inferenceClassification/overrides/${existing.id}`,
        'PATCH',
        overrideData
      );
    } else {
      // Create new
      response = await callGraphAPI(
        accessToken,
        '/me/inferenceClassification/overrides',
        'POST',
        overrideData
      );
    }

    const actionWord = existing ? 'Updated' : 'Created';
    const destination = classification === 'focused' ? 'Focused inbox' : 'Other';

    return {
      content: [{
        type: "text",
        text: `✅ ${actionWord} override!\n\nEmails from **${response.senderEmailAddress.name || emailAddress}** <${emailAddress}> will always go to **${destination}**.`
      }],
      _meta: {
        action: existing ? 'updated' : 'created',
        override: response
      }
    };
  } catch (error) {
    if (error.message === 'Authentication required') {
      return {
        content: [{
          type: "text",
          text: "Authentication required. Please use the 'authenticate' tool first."
        }]
      };
    }
    return {
      content: [{
        type: "text",
        text: `Error setting Focused Inbox override: ${error.message}`
      }]
    };
  }
}

// Tool definitions
const categoriesTools = [
  {
    name: "list-categories",
    description: "List master categories in your Outlook account",
    inputSchema: {
      type: "object",
      properties: {
        outputVerbosity: {
          type: "string",
          enum: ["minimal", "standard", "full"],
          description: "Output detail level (default: standard)"
        }
      },
      required: []
    },
    handler: handleListCategories
  },
  {
    name: "create-category",
    description: "Create a new master category",
    inputSchema: {
      type: "object",
      properties: {
        displayName: {
          type: "string",
          description: "Category name (required)"
        },
        color: {
          type: "string",
          enum: CATEGORY_COLORS,
          description: "Category color preset (preset0=Red, preset1=Orange, preset7=Blue, etc.)"
        }
      },
      required: ["displayName"]
    },
    handler: handleCreateCategory
  },
  {
    name: "update-category",
    description: "Update an existing category's name or color",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Category ID (required, use list-categories to find)"
        },
        displayName: {
          type: "string",
          description: "New category name"
        },
        color: {
          type: "string",
          enum: CATEGORY_COLORS,
          description: "New category color preset"
        }
      },
      required: ["id"]
    },
    handler: handleUpdateCategory
  },
  {
    name: "delete-category",
    description: "Delete a master category",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Category ID (required, use list-categories to find)"
        }
      },
      required: ["id"]
    },
    handler: handleDeleteCategory
  },
  {
    name: "apply-category",
    description: "Apply or remove categories on email message(s)",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "Single message ID to categorize"
        },
        messageIds: {
          type: "array",
          items: { type: "string" },
          description: "Array of message IDs to categorize (batch operation)"
        },
        categories: {
          type: "array",
          items: { type: "string" },
          description: "Category display names to apply/remove (required)"
        },
        action: {
          type: "string",
          enum: ["set", "add", "remove"],
          description: "Action: set (replace all), add (append), remove (remove specific). Default: set"
        }
      },
      required: ["categories"]
    },
    handler: handleApplyCategory
  },
  {
    name: "get-focused-inbox-overrides",
    description: "List Focused Inbox overrides (senders always in Focused or Other)",
    inputSchema: {
      type: "object",
      properties: {
        outputVerbosity: {
          type: "string",
          enum: ["minimal", "standard", "full"],
          description: "Output detail level (default: standard)"
        }
      },
      required: []
    },
    handler: handleGetFocusedInboxOverrides
  },
  {
    name: "set-focused-inbox-override",
    description: "Create, update, or delete a Focused Inbox override for a sender",
    inputSchema: {
      type: "object",
      properties: {
        emailAddress: {
          type: "string",
          description: "Sender email address (required)"
        },
        name: {
          type: "string",
          description: "Sender display name (optional)"
        },
        classifyAs: {
          type: "string",
          enum: ["focused", "other"],
          description: "Where to always put emails from this sender (default: focused)"
        },
        action: {
          type: "string",
          enum: ["create", "delete"],
          description: "Use 'delete' to remove an override (default: create/update)"
        }
      },
      required: ["emailAddress"]
    },
    handler: handleSetFocusedInboxOverride
  }
];

module.exports = {
  categoriesTools,
  handleListCategories,
  handleCreateCategory,
  handleUpdateCategory,
  handleDeleteCategory,
  handleApplyCategory,
  handleGetFocusedInboxOverrides,
  handleSetFocusedInboxOverride,
  CATEGORY_COLORS,
  COLOR_NAMES
};
