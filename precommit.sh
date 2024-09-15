# npm run format:checkをして、エラーがあればエラーを出力して終了する
npm run format:check
if [ $? -ne 0 ]; then
    echo "フォーマットエラーがあります。"
    exit 1
fi

# npm run lintをして、エラーがあればエラーを出力して終了する
npm run lint:check
if [ $? -ne 0 ]; then
    echo "Lintエラーがあります。"
    exit 1
fi