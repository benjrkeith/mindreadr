module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "ignorePatterns": [".eslintrc.cjs", "vite.config.ts"],
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "@eslint/no-unused-vars": "off",
          "@typescript-eslint/no-misused-promises": [
    "error",
    {"checksVoidReturn": {"attributes": false}}
  ]
    }
}
