/* eslint-disable */
function buildConfig(env = 'local') {
  const config = require(`./webpack/webpack.${ env }.js`)({ env });

  console.log(config);
  return config;
}

module.exports = buildConfig;