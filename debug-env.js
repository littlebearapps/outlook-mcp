#!/usr/bin/env node

console.error('==== DEBUG INFORMATION ====');
console.error('ARGUMENTS:', process.argv);
console.error('ENVIRONMENT VARIABLES:');
Object.keys(process.env).forEach(key => {
  console.error(`  ${key}: ${process.env[key]}`);
});
console.error('==== END DEBUG INFO ====');

// Load the real application
try {
  require('./index');
} catch (error) {
  console.error('ERROR LOADING INDEX.JS:', error);
} 