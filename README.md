# race-schedule

公営競技のレーススケジュールを管理する

## 実行方法

### ローカルでのAPI実行

localで実行する場合は、

・次のコマンドを実行する

```bash
pnpm run dev:local
```

・次のcurlを実行する（カレンダー取得のためのGETリクエストの場合）

```bash
curl -X GET "http://localhost:3000/api/races/nar/calendar?startDate=2024-09-01&finishDate=2024-09-30"
```

・次のcurlを実行する（カレンダー更新のためのPOSTリクエストの場合）

```bash
curl -X POST \
"http://localhost:3000/api/races/nar/calendar" \
-H "Content-Type: application/json" \
-d '{
  "startDate": "2024-09-10",
  "finishDate": "2024-09-13"
}'
```
