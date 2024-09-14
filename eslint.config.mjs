import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    {
        languageOptions: {
            parserOptions: {
                project: true,
                sourceType: 'module',
            },
        },
    },
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    eslintConfigPrettier, // Prettierとの競合を防ぐ設定
    {
        plugins: {
            'unused-imports': unusedImports,
            'prettier': eslintPluginPrettier, // Prettierのプラグインを追加
        },
        rules: {
            'array-callback-return': 'error', // 配列のコールバック関数にはreturn文を必ず記述する
            'constructor-super': 'error', // constructor内でsuper()を呼び出す
            'no-cond-assign': 'error', // 条件式で代入演算子を使用しない
            'no-constant-condition': 'error', // typoによって条件文が必ず通る、または通らなくなるということを防ぐ
            'no-dupe-else-if': 'error', // if-else-ifチェーンの重複条件の禁止
            'no-duplicate-case': 'error', // ケースラベルの重複を禁止する
            'no-empty-character-class': 'error', // 正規表現の空文字クラスを禁止する
            'no-unused-vars': 'off', // DIコンテナで使われる変数を検出できないため無効化
            'no-template-curly-in-string': 'error', // 文字列リテラル内のテンプレートリテラルを検出する
            'no-useless-concat': 'error', // 文字列の連結を禁止する
            'no-self-compare': 'error', // 自分自身との比較を禁止する
            'unused-imports/no-unused-imports': 'error', // 使われていないimportを検出
            'unused-imports/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
            // 他のルールを追加
            'prettier/prettier': 'error', // Prettierのスタイルルールをエラーとして報告
            'eqeqeq': 'error', // 厳密等価演算子(===)を必須にする
            'curly': ['error', 'all'], // if文などで常に波括弧を使用する
            'no-multiple-empty-lines': ['error', { max: 1 }], // 複数の空行を禁止
            'no-trailing-spaces': 'error', // 行末の空白を禁止
        },
    },
];
