export default {
  ignoredByWatcher: ["src", "tests"],
  files: ["dist/tests/**/*.test.js"],
  require: ["./ava.tsconfig-path-require.js"],
};
