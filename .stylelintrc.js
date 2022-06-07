module.exports = {
    extends: ["stylelint-config-standard", "stylelint-prettier/recommended"],
    plugins: ["stylelint-scss"],
    rules: {
        "max-empty-lines": 1,
        "selector-max-empty-lines": 0,
        "function-max-empty-lines": 0,
        "value-list-max-empty-lines": 0,
        "no-descending-specificity": null,
        "selector-pseudo-element-no-unknown": [
            true,
            {
                ignorePseudoElements: ["deep"],
            },
        ],
        "selector-pseudo-class-no-unknown": [
            true,
            {
                ignorePseudoClasses: ["deep", "global"],
            },
        ],
        "at-rule-no-unknown": null,
        "at-rule-disallowed-list": ["import"],
        "block-no-empty": true,
        "color-no-invalid-hex": true
    },
};
