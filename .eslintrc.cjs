"use strict";

require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    env: {
        browser: true,
        es6: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "@saberhq/eslint-config-react"
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018,
        sourceType: "module",
        project: ["tsconfig.json"]
    },
    plugins: [
        "react",
        "prettier",
        "@typescript-eslint"
    ],
    rules: {
        // Reglas de Saber
        "indent": ["error", 4],
        "printWidth": 100,
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "comma-dangle": ["error", "always-multiline"],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
        
        // Reglas de Tribeca
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                checksVoidReturn: false
            }
        ],
        "react/no-unknown-property": [
            2,
            {
                ignore: ["tw", "css"]
            }
        ]
    }
}; 