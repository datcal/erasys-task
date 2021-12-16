module.exports = {
  space: true,
  prettier: true,
  "rules": {
    "new-cap": 0,
    "@typescript-eslint/no-implicit-any-catch": 0,
    "node/prefer-global/process": ["error", "always"],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "ts": "never"
      },
    ],
  }
};
