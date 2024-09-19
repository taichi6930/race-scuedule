// eslint-disable-next-line no-undef
module.exports = {
    singleQuote: true,
    tabWidth: 4,
    bracketSpacing: true,
    bracketSameLine: true,
    semi: true,
    quoteProps: 'consistent',
    trailingComma: 'all',
    arrowParens: 'always',
    overrides: [
        {
            files: '*.yaml',
            options: {
                tabWidth: 2, // インデントをスペース2つに設定
            },
        },
    ],
};
