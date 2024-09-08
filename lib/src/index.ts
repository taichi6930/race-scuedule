import "reflect-metadata";
import express from "express";
import serverlessExpress from '@codegenie/serverless-express';
import { container } from "tsyringe";
import { NarRaceController } from "./controller/narRaceController";
import { NarPlaceData } from "./domain/narPlaceData";
import { NarRaceData } from "./domain/narRaceData";
import { S3Gateway } from "./gateway/implement/s3Gateway";
import { IS3Gateway } from "./gateway/interface/iS3Gateway";
import { MockS3Gateway } from "./gateway/mock/mockS3Gateway";
import { NarRaceRepositoryFromS3Impl } from "./repository/implement/narRaceRepositoryFromS3Impl";
import { IRaceRepository } from "./repository/interface/IRaceRepository";
import { GoogleCalendarService } from "./service/implement/googleCalendarService";
import { ICalendarService } from "./service/interface/ICalendarService";
import { MockGoogleCalendarService } from "./service/mock/mockGoogleCalendarService";
import { NarRaceCalendarUseCase } from "./usecase/implement/narRaceCalendarUseCase";
import { IRaceCalendarUseCase } from "./usecase/interface/IRaceCalendarUseCase";

// Expressアプリケーションの設定
const app = express();

// DIコンテナの初期化
// s3Gatewayの実装クラスをDIコンテナに登錄する
container.register<IS3Gateway<NarRaceData>>(
    'IS3GatewayForNarRace',
    {
        useFactory: () => {
            switch (process.env.NODE_ENV) {
                case 'production':
                    // NODE_ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<NarRaceData>('race-schedule-bucket', 'nar/race/');
                case 'local':
                    // NODE_ENV が local の場合、MockS3Gateway を使用
                    return new MockS3Gateway<NarRaceData>('race-schedule-bucket', 'nar/race/');
                default:
                    // NODE_ENV が ない場合、MockS3Gateway を使用
                    return new MockS3Gateway<NarRaceData>('race-schedule-bucket', 'nar/race/');
            }
        }
    }
);

// ICalendarServiceの実装クラスをDIコンテナに登錄する
container.register<ICalendarService<NarRaceData>>(
    'ICalendarService',
    {
        useFactory: () => {
            switch (process.env.NODE_ENV) {
                case 'production':
                    // NODE_ENV が production の場合、GoogleCalendarService を使用
                    return new GoogleCalendarService<NarRaceData>('nar', process.env.NAR_CALENDAR_ID || '');
                case 'local':
                    // NODE_ENV が local の場合、MockGoogleCalendarService を使用
                    return new MockGoogleCalendarService();
                default:
                    // NODE_ENV が指定されていない場合も MockGoogleCalendarService を使用
                    return new MockGoogleCalendarService();
            }
        }
    }
);

// Repositoryの実装クラスをDIコンテナに登錄する
container.register<IRaceRepository<NarRaceData, NarPlaceData>>('IRaceRepositoryFromS3',
    { useClass: NarRaceRepositoryFromS3Impl }
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
