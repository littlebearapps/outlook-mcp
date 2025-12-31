/**
 * Accept event functionality
 */
const { callGraphAPI } = require('../utils/graph-api');
const { ensureAuthenticated } = require('../auth');

/**
 * Accept event handler
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleAcceptEvent(args) {
  const { eventId, comment } = args;

  if (!eventId) {
    return {
      content: [{
        type: "text",
        text: "Event ID is required to accept an event."
      }]
    };
  }

  try {
    // Get access token
    const accessToken = await ensureAuthenticated();

    // Build API endpoint
    const endpoint = `me/events/${eventId}/accept`;

    // Request body
    const body = {
      comment: comment || "Accepted via API"
    };

    // Make API call
    await callGraphAPI(accessToken, 'POST', endpoint, body);

    return {
      content: [{
        type: "text",
        text: `Event with ID ${eventId} has been successfully accepted.`
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
        text: `Error accepting event: ${error.message}`
      }]
    };
  }
}

module.exports = handleAcceptEvent;