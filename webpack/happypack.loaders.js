const HappyPack = require('happypack');

const loaders = [
  'babel-loader'
];

module.exports = new HappyPack({
  loaders
});