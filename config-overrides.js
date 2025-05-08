module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "url": require.resolve("url/"),
    "util": require.resolve("util/"),
    "path": require.resolve("path-browserify"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "vm": false,
    "fs": false,
    "net": false,
    "tls": false,
    "zlib": false
  };

  return config;
}; 