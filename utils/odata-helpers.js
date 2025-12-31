/**
 * OData helper functions for Microsoft Graph API
 */

/**
 * Escapes a string for use in OData queries
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
function escapeODataString(str) {
  if (!str) return str;
  
  // Replace single quotes with double single quotes (OData escaping)
  // And remove any special characters that could cause OData syntax errors
  str = str.replace(/'/g, "''");
  
  // Escape other potentially problematic characters
  str = str.replace(/[\(\)\{\}\[\]\:\;\,\/\?\&\=\+\*\%\$\#\@\!\^]/g, '');
  
  console.error(`Escaped OData string: '${str}'`);
  return str;
}

/**
 * Builds an OData filter from filter conditions
 * @param {Array<string>} conditions - Array of filter conditions
 * @returns {string} - Combined OData filter expression
 */
function buildODataFilter(conditions) {
  if (!conditions || conditions.length === 0) {
    return '';
  }
  
  return conditions.join(' and ');
}

module.exports = {
  escapeODataString,
  buildODataFilter
};
