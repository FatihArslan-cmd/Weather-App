const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Webpack yapılandırmasını burada özelleştirebilirsin.
  return config;
};
