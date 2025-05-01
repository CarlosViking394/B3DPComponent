// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for all file extensions
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
config.resolver.assetExts = ['glb', 'gltf', 'png', 'jpg', 'obj', 'mtl', 'stl', 'ttf', 'mp3', 'wav', 'webp'];

// Disable minification for debugging
config.transformer.minifierConfig = {
  mangle: false,
  compress: false
};

module.exports = config; 