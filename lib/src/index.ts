import 'reflect-metadata';

import serverlessExpress from '@codegenie/serverless-express';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { container } from 'tsyringe';

import { JraRaceController } from './controller/jraRaceController';
import { NarRaceController } from './controller/narRaceController';
import type { JraPlaceData } from './domain/jraPlaceData';
import type { JraRaceData } from './domain/jraRaceData';
import type { NarPlaceData } from './domain/narPlaceData';
import type { NarRaceData } from './domain/narRaceData';
import { JraPlaceDataHtmlGateway } from './gateway/implement/jraPlaceDataHtmlGateway';
import { JraRaceDataHtmlGateway } from './gateway/implement/jraRaceDataHtmlGateway';
import { NarPlaceDataHtmlGateway } from './gateway/implement/narPlaceDataHtmlGateway';
import { NarRaceDataHtmlGateway } from './gateway/implement/narRaceDataHtmlGateway';
import { S3Gateway } from './gateway/implement/s3Gateway';
import type { IJraPlaceDataHtmlGateway } from './gateway/interface/iJraPlaceDataHtmlGateway';
import type { IJraRaceDataHtmlGateway } from './gateway/interface/iJraRaceDataHtmlGateway';
import type { INarPlaceDataHtmlGateway } from './gateway/interface/iNarPlaceDataHtmlGateway';
import type { INarRaceDataHtmlGateway } from './gateway/interface/iNarRaceDataHtmlGateway';
import type { IS3Gateway } from './gateway/interface/iS3Gateway';
import { MockS3Gateway } from './gateway/mock/mockS3Gateway';
import { JraPlaceRepositoryFromHtmlImpl } from './repository/implement/jraPlaceRepositoryFromHtmlImpl';
import { JraPlaceRepositoryFromS3Impl } from './repository/implement/jraPlaceRepositoryFromS3Impl';
import { JraRaceRepositoryFromHtmlImpl } from './repository/implement/jraRaceRepositoryFromHtmlImpl';
import { JraRaceRepositoryFromS3Impl } from './repository/implement/jraRaceRepositoryFromS3Impl';
import { NarPlaceRepositoryFromHtmlImpl } from './repository/implement/narPlaceRepositoryFromHtmlImpl';
import { NarPlaceRepositoryFromS3Impl } from './repository/implement/narPlaceRepositoryFromS3Impl';
import { NarRaceRepositoryFromHtmlImpl } from './repository/implement/narRaceRepositoryFromHtmlImpl';
import { NarRaceRepositoryFromS3Impl } from './repository/implement/narRaceRepositoryFromS3Impl';
import type { IPlaceRepository } from './repository/interface/IPlaceRepository';
import type { IRaceRepository } from './repository/interface/IRaceRepository';
import { GoogleCalendarService } from './service/implement/googleCalendarService';
import type { ICalendarService } from './service/interface/ICalendarService';
import { MockGoogleCalendarService } from './service/mock/mockGoogleCalendarService';
import swaggerSpec from './swagger/swaggerConfig';
import { JraPlaceDataUseCase } from './usecase/implement/jraPlaceDataUseCase';
import { JraRaceCalendarUseCase } from './usecase/implement/jraRaceCalendarUseCase';
import { JraRaceDataUseCase } from './usecase/implement/jraRaceDataUseCase';
import { NarPlaceDataUseCase } from './usecase/implement/narPlaceDataUseCase';
import { NarRaceCalendarUseCase } from './usecase/implement/narRaceCalendarUseCase';
import { NarRaceDataUseCase } from './usecase/implement/narRaceDataUseCase';
import type { IPlaceDataUseCase } from './usecase/interface/IPlaceDataUseCase';
import type { IRaceCalendarUseCase } from './usecase/interface/IRaceCalendarUseCase';
import type { IRaceDataUseCase } from './usecase/interface/IRaceDataUseCase';

// Expressアプリケーションの設定
const app = express();

// DIコンテナの初期化
// s3Gatewayの実装クラスをDIコンテナに登錄する
container.register<IS3Gateway<NarRaceData>>('NarRaceS3Gateway', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<NarRaceData>(
                    'race-schedule-bucket',
                    'nar/race/',
                );
            case 'local':
                // ENV が local の場合、MockS3Gateway を使用
                return new MockS3Gateway<NarRaceData>(
                    'race-schedule-bucket',
                    'nar/race/',
                );
            default:
                // ENV が ない場合、MockS3Gateway を使用
                return new MockS3Gateway<NarRaceData>(
                    'race-schedule-bucket',
                    'nar/race/',
                );
        }
    },
});
container.register<IS3Gateway<JraRaceData>>('JraRaceS3Gateway', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<JraRaceData>(
                    'race-schedule-bucket',
                    'jra/race/',
                );
            case 'local':
                // ENV が local の場合、MockS3Gateway を使用
                return new MockS3Gateway<JraRaceData>(
                    'race-schedule-bucket',
                    'jra/race/',
                );
            default:
                // ENV が ない場合、MockS3Gateway を使用
                return new MockS3Gateway<JraRaceData>(
                    'race-schedule-bucket',
                    'jra/race/',
                );
        }
    },
});
container.register<IS3Gateway<NarPlaceData>>('NarPlaceS3Gateway', {
    useFactory: () => {
        console.log(`NarPlaceS3Gateway ${process.env.ENV}`);
        switch (process.env.ENV) {
            case 'production':
                return new S3Gateway<NarPlaceData>(
                    'race-schedule-bucket',
                    'nar/place/',
                );
            case 'local':
                return new MockS3Gateway<NarPlaceData>(
                    'race-schedule-bucket',
                    'nar/place/',
                );
            default:
                return new MockS3Gateway<NarPlaceData>(
                    'race-schedule-bucket',
                    'nar/place/',
                );
        }
    },
});
container.register<IS3Gateway<JraPlaceData>>('JraPlaceS3Gateway', {
    useFactory: () => {
        console.log(`JraPlaceS3Gateway ${process.env.ENV}`);
        switch (process.env.ENV) {
            case 'production':
                return new S3Gateway<JraPlaceData>(
                    'race-schedule-bucket',
                    'jra/place/',
                );
            case 'local':
                return new MockS3Gateway<JraPlaceData>(
                    'race-schedule-bucket',
                    'jra/place/',
                );
            default:
                return new MockS3Gateway<JraPlaceData>(
                    'race-schedule-bucket',
                    'jra/place/',
                );
        }
    },
});
container.register<INarRaceDataHtmlGateway>('NarRaceDataHtmlGateway', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                console.log('NarRaceDataHtmlGateway');
                return new NarRaceDataHtmlGateway();
            default:
                return new NarRaceDataHtmlGateway();
        }
    },
});
container.register<IJraRaceDataHtmlGateway>('JraRaceDataHtmlGateway', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                console.log('JraRaceDataHtmlGateway');
                return new JraRaceDataHtmlGateway();
            default:
                return new JraRaceDataHtmlGateway();
        }
    },
});
container.register<INarPlaceDataHtmlGateway>('NarPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                return new NarPlaceDataHtmlGateway();
            default:
                return new NarPlaceDataHtmlGateway();
        }
    },
});
container.register<IJraPlaceDataHtmlGateway>('JraPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                return new JraPlaceDataHtmlGateway();
            default:
                return new JraPlaceDataHtmlGateway();
        }
    },
});

// ICalendarServiceの実装クラスをDIコンテナに登錄する
container.register<ICalendarService<NarRaceData>>('NarCalendarService', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                // ENV が production の場合、GoogleCalendarService を使用
                return new GoogleCalendarService<NarRaceData>(
                    'nar',
                    process.env.NAR_CALENDAR_ID ?? '',
                );
            case 'local':
                // ENV が local の場合、MockGoogleCalendarService を使用
                return new MockGoogleCalendarService('nar');
            default:
                // ENV が指定されていない場合も MockGoogleCalendarService を使用
                return new MockGoogleCalendarService('nar');
        }
    },
});

container.register<ICalendarService<JraRaceData>>('JraCalendarService', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                // ENV が production の場合、GoogleCalendarService を使用
                return new GoogleCalendarService<JraRaceData>(
                    'jra',
                    process.env.JRA_CALENDAR_ID ?? '',
                );
            case 'local':
                // ENV が local の場合、MockGoogleCalendarService を使用
                return new MockGoogleCalendarService('jra');
            default:
                // ENV が指定されていない場合も MockGoogleCalendarService を使用
                return new MockGoogleCalendarService('jra');
        }
    },
});

// Repositoryの実装クラスをDIコンテナに登錄する
container.register<IRaceRepository<NarRaceData, NarPlaceData>>(
    'NarRaceRepositoryFromS3',
    { useClass: NarRaceRepositoryFromS3Impl },
);
container.register<IRaceRepository<JraRaceData, JraPlaceData>>(
    'JraRaceRepositoryFromS3',
    { useClass: JraRaceRepositoryFromS3Impl },
);
container.register<IPlaceRepository<NarPlaceData>>('NarPlaceRepositoryFromS3', {
    useClass: NarPlaceRepositoryFromS3Impl,
});
container.register<IPlaceRepository<JraPlaceData>>('JraPlaceRepositoryFromS3', {
    useClass: JraPlaceRepositoryFromS3Impl,
});
container.register<IRaceRepository<NarRaceData, NarPlaceData>>(
    'NarRaceRepositoryFromHtml',
    { useClass: NarRaceRepositoryFromHtmlImpl },
);
container.register<IRaceRepository<JraRaceData, JraPlaceData>>(
    'JraRaceRepositoryFromHtml',
    { useClass: JraRaceRepositoryFromHtmlImpl },
);
container.register<IPlaceRepository<NarPlaceData>>(
    'NarPlaceRepositoryFromHtml',
    { useClass: NarPlaceRepositoryFromHtmlImpl },
);
container.register<IPlaceRepository<JraPlaceData>>(
    'JraPlaceRepositoryFromHtml',
    { useClass: JraPlaceRepositoryFromHtmlImpl },
);

// Usecaseの実装クラスをDIコンテナに登錄する
container.register<IRaceCalendarUseCase>('NarRaceCalendarUseCase', {
    useClass: NarRaceCalendarUseCase,
});
container.register<IRaceCalendarUseCase>('JraRaceCalendarUseCase', {
    useClass: JraRaceCalendarUseCase,
});
container.register<IRaceDataUseCase<NarRaceData>>('NarRaceDataUseCase', {
    useClass: NarRaceDataUseCase,
});
container.register<IRaceDataUseCase<JraRaceData>>('JraRaceDataUseCase', {
    useClass: JraRaceDataUseCase,
});
container.register<IPlaceDataUseCase<NarPlaceData>>('NarPlaceDataUseCase', {
    useClass: NarPlaceDataUseCase,
});
container.register<IPlaceDataUseCase<JraPlaceData>>('JraPlaceDataUseCase', {
    useClass: JraPlaceDataUseCase,
});

const narRaceController = container.resolve(NarRaceController);
const jraRaceController = container.resolve(JraRaceController);

app.use(express.json());
app.use('/api/races/nar', narRaceController.router);
app.use('/api/races/jra', jraRaceController.router);

// Swaggerの設定
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, { explorer: true }));

// Lambda用のハンドラーをエクスポート
export const handler = serverlessExpress({ app });

// アプリケーションの起動
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
