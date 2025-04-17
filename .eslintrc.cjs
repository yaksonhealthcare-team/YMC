module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "jsx-a11y", "prettier"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "jsx-a11y/alt-text": [
      "warn",
      {
        elements: ["img"],
      },
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "react-hooks/exhaustive-deps": "off",
  },
}
