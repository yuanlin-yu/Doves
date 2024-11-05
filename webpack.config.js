const path = require('path');

module.exports = {
  mode: 'production',
  entry: './content-script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname , 'app/dist')
  }
};