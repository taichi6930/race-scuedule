import 'reflect-metadata';
import '../container'; // DIコンテナの設定をインポート

import serverlessExpress from '@codegenie/serverless-express';
import type { Application } from 'express';
import express from 'express';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { container } from 'tsyringe';

import { AutoraceRaceController } from './controller/autoraceRaceController';
import { BoatraceRaceController } from './controller/boatraceRaceController';
import { JraRaceController } from './controller/jraRaceController';
import { KeirinRaceController } from './controller/keirinRaceController';
import { NarRaceController } from './controller/narRaceController';
import { WorldRaceController } from './controller/worldRaceController';

// Expressアプリケーションの設定
const app: Application = express();

// DIコンテナからControllerを取得
const narRaceController = container.resolve(NarRaceController);
const jraRaceController = container.resolve(JraRaceController);
const worldRaceController = container.resolve(WorldRaceController);
const keirinRaceController = container.resolve(KeirinRaceController);
const autoraceRaceController = container.resolve(AutoraceRaceController);
const boatraceController = container.resolve(BoatraceRaceController);

// Expressの設定
app.use(express.json());

// ルーティングの設定
app.use('/api/races/nar', narRaceController.router);
app.use('/api/races/jra', jraRaceController.router);
app.use('/api/races/world', worldRaceController.router);
app.use('/api/races/keirin', keirinRaceController.router);
app.use('/api/races/autorace', autoraceRaceController.router);
app.use('/api/races/boatrace', boatraceController.router);

// health check
app.get('/health', (req, res) => {
    res.send('ok health check');
});

// Swaggerの設定
const swaggerFiles = {
    jra: '../swagger/output-jra.json',
    world: '../swagger/output-world.json',
    autorace: '../swagger/output-autorace.json',
    keirin: '../swagger/output-keirin.json',
    boatrace: '../swagger/output-boatrace.json',
    nar: '../swagger/output-nar.json',
};

// 各Swaggerファイルに対応するルートを設定
Object.entries(swaggerFiles).forEach(([key, filePath]) => {
    const absolutePath = path.join(__dirname, filePath);

    // Swaggerファイルが存在しない場合のエラーハンドリング
    if (!fs.existsSync(absolutePath)) {
        console.error(`Swagger file for ${key} not found at ${absolutePath}`);
        return;
    }

    // 各Swagger UIルートを作成
    const swaggerDocument = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
    app.use(
        `/api-docs/${key}`,
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument),
    );
});

// Lambda用のハンドラーをエクスポート
export const handler = serverlessExpress({ app });

// アプリケーションの起動
const PORT = process.env.PORT ?? '3000';
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Swagger UI is available at:');
    Object.keys(swaggerFiles).forEach((key) => {
        console.log(`- http://localhost:${PORT}/api-docs/${key}`);
    });
});

export default app;
