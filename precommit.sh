# npm run format:checkをして、エラーがあればエラーを出力して終了する
npm run format:check
if [ $? -ne 0 ]; then
    echo "フォーマットエラーがあります。"
    npm run lint:fix
    echo "フォーマットを修正しました。"
    echo "再度コミットしてください。"
    exit 1
fi

# npm run lintをして、エラーがあればエラーを出力して終了する
npm run lint:check
if [ $? -ne 0 ]; then
    echo "Lintエラーがあります。"
    npm run lint:fix
    echo "Lintを修正しました。"
    echo "再度コミットしてください。"
    exit 1
fi