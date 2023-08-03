export default {
  ignoredByWatcher: ["tests/**/*", "src/**/*", "**/*.tsbuildinfo"],
  require: "reflect-metadata",
  files: ["dist/**/*.test.js"],
  nodeArguments: ["--experimental-specifier-resolution=node", "--no-warnings"],
};
