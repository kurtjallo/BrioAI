const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude OpenAI's temp directories from Metro's file watcher.
// The openai package creates/deletes these at runtime, causing ENOENT crashes.
config.resolver.blockList = [
  /openai_tmp_[^/]*\/.*/,
];

module.exports = config;
