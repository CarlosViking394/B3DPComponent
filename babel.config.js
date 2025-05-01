module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 'expo-router/babel' has been removed as it's deprecated in SDK 50
    ],
  };
}; 