const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Avoid Metro crashes on transient Expo package paths (Windows)
config.watchFolders = [__dirname];
config.resolver.blockList = [
  /\.expo-font-[a-zA-Z0-9]+\//,
];

module.exports = config;
