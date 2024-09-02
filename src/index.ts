import "reflect-metadata";
import express from "express";
import serverlessExpress from '@codegenie/serverless-express';
import { container } from "tsyringe";
import { NarRaceData } from "./domain/narRaceData";
import { ICalendarService } from "./service/interface/ICalendarService";
import { IRaceRepository } from "./repository/interface/IRaceRepository";
import { NarPlaceData } from "./domain/narPlaceData";
import { NarRaceController } from "./controller/narRaceController";
import { IRaceCalendarUseCase } from "./usecase/interface/IRaceCalendarUseCase";
import { NarRaceCalendarUseCase } from "./usecase/implement/narRaceCalendarUseCase";
import { MockGoogleCalendarService } from "./service/mock/mockGoogleCalendarService";
import { MockNarRaceRepositoryFromS3Impl } from "./repository/mock/mockNarRaceRepositoryFromS3Impl";

// Expressアプリケーションの設定
const app = express();

// DIコンテナの初期化
// ICalendarServiceの実装クラスをDIコンテナに登錄する
container.register<ICalendarService<NarRaceData>>(
    'ICalendarService',
    { useClass: MockGoogleCalendarService }
);

// Repositoryの実装クラスをDIコンテナに登錄する
container.register<IRaceRepository<NarRaceData, NarPlaceData>>('IRaceRepositoryFromS3',
    { useClass: MockNarRaceRepositoryFromS3Impl }
);

// Usecaseの実装クラスをDIコンテナに登錄する
container.register<IRaceCalendarUseCase<NarRaceData>>(
    'IRaceCalendarUseCase',
    { useClass: NarRaceCalendarUseCase }
);

const narRaceController = container.resolve(NarRaceController);

app.use(express.json());
app.use('/api/races', narRaceController.router);

// Lambda用のハンドラーをエクスポート
export const handler = serverlessExpress({ app });

// アプリケーションの起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
