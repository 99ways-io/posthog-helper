const path = require('path');

module.exports = {
  entry: './src/index.js',  // Your main module
  output: {
    filename: 'posthog-helper.js',  // The name of the final built file
    path: path.resolve(__dirname, 'dist'),  // Where to store the build
    library: 'posthogHelper',  // Expose it as a global variable (optional)
    libraryTarget: 'umd'  // Make it compatible with both Node and browsers
  },
  mode: 'production'
};

