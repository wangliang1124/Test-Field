// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    },
    extends: 'airbnb-base',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // add your custom rules here
    'rules': {
        "accessor-pairs": 2,
        // allow async-await
        "generator-star-spacing": 0,
        "array-bracket-spacing": 0,
        "block-scoped-var": 0,
        "camelcase": 1,
        "comma-dangle": [
            0, // 修改: 2
            "never"
        ],
        "complexity": 0,
        "computed-property-spacing": 0,
        "consistent-return": 0,
        "constructor-super": 2,
        "default-case": 0,
        "dot-location": 0,
        "dot-notation": 0,
        "func-names": 0,
        "func-style": 0,
        "global-require": 0,
        'generator-star-spacing': [
            2,
            {
                before: false,
                after: true
            }
        ],
        "guard-for-in": 2,
        "handle-callback-err": [
            2,
            "^(err|error)$"
        ],
        "id-length": 0,
        "indent": [
            2,
            4,
            {
                "SwitchCase": 1
            }
        ],
        "key-spacing": [
            2,
            {
                "beforeColon": false,
                "afterColon": true
            }
        ],
        "max-len": [2, 160],
        "new-cap": [
            2,
            {
                "newIsCap": true,
                "capIsNew": false
            }
        ],
        "new-parens": 2,
        "no-alert": 1,
        "no-cond-assign": 2,
        "no-console": 0, // 修改： "no-console": 1,
        "no-constant-condition": 1,
        "no-else-return": 0,
        "no-extra-boolean-cast": 2,
        "no-extra-parens": 0,
        "no-inner-declarations": [
            2,
            "functions"
        ],
        "no-label-var": 2,
        "no-labels": 2,
        "no-mixed-requires": 0,
        "no-nested-ternary": 2,
        "no-new-require": 2,
        "no-param-reassign": 0,
        "no-proto": 0,
        "no-restricted-syntax": 0,
        "no-script-url": 0,
        "no-shadow": 2,
        "no-this-before-super": 2,
        "no-undef-init": 2,
        "no-underscore-dangle": 0,
        "no-unexpected-multiline": 2,
        "no-unneeded-ternary": 2,
        "no-unused-expressions": 0,
        "no-unused-vars": [
            1,
            {
                "vars": "all",
                "args": "after-used"
            }
        ],
        "no-var": 0,     // node will use `var` keywords
        "no-warning-comments": 0,
        "object-curly-spacing": 0,
        "object-shorthand": 0,
        "operator-linebreak": [
            2,
            "after",
            {
                "overrides": {
                    "?": "after",
                    ":": "after"
                }
            }
        ],
        "padded-blocks": 0,
        "prefer-arrow-callback": 0,
        "prefer-const": 0,
        "quote-props": 0,
        "quotes": [
            2,
            "single",
            "avoid-escape"
        ],
        "radix": 0,
        "semi": [
            2,
            "always"
        ],
        "space-before-function-paren": [
            0
        ],
        "space-unary-ops": [
            2,
            {
                "words": true,
                "nonwords": false
            }
        ],
        "spaced-comment": [
            0,
            "always",
            {
                "markers": [
                    "eslint-disable"
                ]
            }
        ],
        "strict": 0,
        "vars-on-top": 0,
        "wrap-iife": [
            2,
            "any"
        ],
        "yoda": [
            0,
            "never"
        ],
        // don't require .vue extension when importing
        'import/extensions': ['off', 'always', {
            'js': 'never',
            'vue': 'never'
        }],
        // allow optionalDependencies
        'import/no-extraneous-dependencies': 0,
        "import/no-unresolved": 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    },
    // 我的自定义
    "globals": { 
        "wx": true,
    }
}
