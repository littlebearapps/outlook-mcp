/**
 * Move emails functionality
 */
const { callGraphAPI } = require('../utils/graph-api');
const { ensureAuthenticated } = require('../auth');
const { getFolderIdByName } = require('../email/folder-utils');

/**
 * Move emails handler
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleMoveEmails(args) {
  const emailIds = args.emailIds || '';
  const targetFolder = args.targetFolder || '';
  const sourceFolder = args.sourceFolder || '';
  
  if (!emailIds) {
    return {
      content: [{ 
        type: "text", 
        text: "Email IDs are required. Please provide a comma-separated list of email IDs to move."
      }]
    };
  }
  
  if (!targetFolder) {
    return {
      content: [{ 
        type: "text", 
        text: "Target folder name is required."
      }]
    };
  }
  
  try {
    // Get access token
    const accessToken = await ensureAuthenticated();
    
    // Parse email IDs
    const ids = emailIds.split(',').map(id => id.trim()).filter(id => id);
    
    if (ids.length === 0) {
      return {
        content: [{ 
          type: "text", 
          text: "No valid email IDs provided."
        }]
      };
    }
    
    // Move emails
    const result = await moveEmailsToFolder(accessToken, ids, targetFolder, sourceFolder);
    
    return {
      content: [{ 
        type: "text", 
        text: result.message
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
    
    return {
      content: [{ 
        type: "text", 
        text: `Error moving emails: ${error.message}`
      }]
    };
  }
}

/**
 * Move emails to a folder
 * @param {string} accessToken - Access token
 * @param {Array<string>} emailIds - Array of email IDs to move
 * @param {string} targetFolderName - Name of the target folder
 * @param {string} sourceFolderName - Name of the source folder (optional)
 * @returns {Promise<object>} - Result object with status and message
 */
async function moveEmailsToFolder(accessToken, emailIds, targetFolderName, sourceFolderName) {
  try {
    // Get the target folder ID
    const targetFolderId = await getFolderIdByName(accessToken, targetFolderName);
    if (!targetFolderId) {
      return {
        success: false,
        message: `Target folder "${targetFolderName}" not found. Please specify a valid folder name.`
      };
    }
    
    // Track successful and failed moves
    const results = {
      successful: [],
      failed: []
    };
    
    // Process each email one by one to handle errors independently
    for (const emailId of emailIds) {
      try {
        // Move the email
        await callGraphAPI(
          accessToken,
          'POST',
          `me/messages/${emailId}/move`,
          {
            destinationId: targetFolderId
          }
        );
        
        results.successful.push(emailId);
      } catch (error) {
        console.error(`Error moving email ${emailId}: ${error.message}`);
        results.failed.push({
          id: emailId,
          error: error.message
        });
      }
    }
    
    // Generate result message
    let message = '';
    
    if (results.successful.length > 0) {
      message += `Successfully moved ${results.successful.length} email(s) to "${targetFolderName}".`;
    }
    
    if (results.failed.length > 0) {
      if (message) message += '\n\n';
      message += `Failed to move ${results.failed.length} email(s). Errors:`;
      
      // Show first few errors with details
      const maxErrors = Math.min(results.failed.length, 3);
      for (let i = 0; i < maxErrors; i++) {
        const failure = results.failed[i];
        message += `\n- Email ${i+1}: ${failure.error}`;
      }
      
      // If there are more errors, just mention the count
      if (results.failed.length > maxErrors) {
        message += `\n...and ${results.failed.length - maxErrors} more.`;
      }
    }
    
    return {
      success: results.successful.length > 0,
      message,
      results
    };
  } catch (error) {
    console.error(`Error in moveEmailsToFolder: ${error.message}`);
    throw error;
  }
}

module.exports = handleMoveEmails;
