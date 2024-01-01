module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "ignorePatterns": [".eslintrc.cjs"],
    "extends": "standard-with-typescript",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "@typescript-eslint/no-misused-promises": "off"
    }
}

// had to disable this rule. need async middleware and it is not fully supported in express 4. 
// 5 supports it but has no types, so same issue
