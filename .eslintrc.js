module.exports = {
    "env": {
        "node": true,
        "browser": true,
        "commonjs": true,
        "es6": true,
        "mocha": true
    },
    "extends": "standard",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-tabs": ["off"],
        "array-bracket-spacing": [
            "error",
            "always"
        ],
        "prefer-promise-reject-errors": ["off"]
    }
};