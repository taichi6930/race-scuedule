import { container } from 'tsyringe';

import type { JraPlaceData } from '../domain/jraPlaceData';
import type { JraRaceData } from '../domain/jraRaceData';
import type { NarPlaceData } from '../domain/narPlaceData';
import type { NarRaceData } from '../domain/narRaceData';
import { JraPlaceDataHtmlGateway } from '../gateway/implement/jraPlaceDataHtmlGateway';
import { JraRaceDataHtmlGateway } from '../gateway/implement/jraRaceDataHtmlGateway';
import { KeirinPlaceDataHtmlGateway } from '../gateway/implement/keirinPlaceDataHtmlGateway';
import { KeirinRaceDataHtmlGateway } from '../gateway/implement/keirinRaceDataHtmlGateway';
import { NarPlaceDataHtmlGateway } from '../gateway/implement/narPlaceDataHtmlGateway';
import { NarRaceDataHtmlGateway } from '../gateway/implement/narRaceDataHtmlGateway';
import { S3Gateway } from '../gateway/implement/s3Gateway';
import { WorldRaceDataHtmlGateway } from '../gateway/implement/worldRaceDataHtmlGateway';
import type { IJraPlaceDataHtmlGateway } from '../gateway/interface/iJraPlaceDataHtmlGateway';
import type { IJraRaceDataHtmlGateway } from '../gateway/interface/iJraRaceDataHtmlGateway';
import type { IKeirinPlaceDataHtmlGateway } from '../gateway/interface/iKeirinPlaceDataHtmlGateway';
import type { IKeirinRaceDataHtmlGateway } from '../gateway/interface/iKeirinRaceDataHtmlGateway';
import type { INarPlaceDataHtmlGateway } from '../gateway/interface/iNarPlaceDataHtmlGateway';
import type { INarRaceDataHtmlGateway } from '../gateway/interface/iNarRaceDataHtmlGateway';
import type { IS3Gateway } from '../gateway/interface/iS3Gateway';
import type { IWorldRaceDataHtmlGateway } from '../gateway/interface/iWorldRaceDataHtmlGateway';
import { MockJraPlaceDataHtmlGateway } from '../gateway/mock/mockJraPlaceDataHtmlGateway';
import { MockJraRaceDataHtmlGateway } from '../gateway/mock/mockJraRaceDataHtmlGateway';
import { MockKeirinPlaceDataHtmlGateway } from '../gateway/mock/mockKeirinPlaceDataHtmlGateway';
import { MockKeirinRaceDataHtmlGateway } from '../gateway/mock/mockKeirinRaceDataHtmlGateway';
import { MockNarPlaceDataHtmlGateway } from '../gateway/mock/mockNarPlaceDataHtmlGateway';
import { MockNarRaceDataHtmlGateway } from '../gateway/mock/mockNarRaceDataHtmlGateway';
import { MockS3Gateway } from '../gateway/mock/mockS3Gateway';
import { MockWorldRaceDataHtmlGateway } from '../gateway/mock/mockWorldRaceDataHtmlGateway';
import type { KeirinPlaceEntity } from '../repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../repository/entity/keirinRaceEntity';
import type { WorldRaceEntity } from '../repository/entity/worldRaceEntity';
import { ENV } from '../utility/env';

// s3Gatewayの実装クラスをDIコンテナに登錄する
container.register<IS3Gateway<KeirinPlaceEntity>>('KeirinPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<KeirinPlaceEntity>(
                    'race-schedule-bucket',
                    'keirin/place/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<KeirinPlaceEntity>(
                    'race-schedule-bucket',
                    'keirin/place/',
                );
        }
    },
});
container.register<IS3Gateway<NarRaceData>>('NarRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<NarRaceData>(
                    'race-schedule-bucket',
                    'nar/race/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<NarRaceData>(
                    'race-schedule-bucket',
                    'nar/race/',
                );
        }
    },
});
container.register<IS3Gateway<KeirinRaceEntity>>('KeirinRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<KeirinRaceEntity>(
                    'race-schedule-bucket',
                    'keirin/race/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<KeirinRaceEntity>(
                    'race-schedule-bucket',
                    'keirin/race/',
                );
        }
    },
});
container.register<IS3Gateway<WorldRaceEntity>>('WorldRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<WorldRaceEntity>(
                    'race-schedule-bucket',
                    'world/race/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<WorldRaceEntity>(
                    'race-schedule-bucket',
                    'world/race/',
                );
        }
    },
});
container.register<IS3Gateway<JraRaceData>>('JraRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<JraRaceData>(
                    'race-schedule-bucket',
                    'jra/race/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<JraRaceData>(
                    'race-schedule-bucket',
                    'jra/race/',
                );
        }
    },
});
container.register<IS3Gateway<NarPlaceData>>('NarPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<NarPlaceData>(
                    'race-schedule-bucket',
                    'nar/place/',
                );
            case 'ITa':
            case 'LOCAL':
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
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<JraPlaceData>(
                    'race-schedule-bucket',
                    'jra/place/',
                );
            case 'ITa':
            case 'LOCAL':
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
        switch (ENV) {
            case 'PRODUCTION':
                console.log('NarRaceDataHtmlGateway');
                return new NarRaceDataHtmlGateway();
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockNarRaceDataHtmlGateway();
        }
    },
});
container.register<IJraRaceDataHtmlGateway>('JraRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                console.log('JraRaceDataHtmlGateway');
                return new JraRaceDataHtmlGateway();
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockJraRaceDataHtmlGateway();
        }
    },
});
container.register<INarPlaceDataHtmlGateway>('NarPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new NarPlaceDataHtmlGateway();
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockNarPlaceDataHtmlGateway();
        }
    },
});
container.register<IJraPlaceDataHtmlGateway>('JraPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new JraPlaceDataHtmlGateway();
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockJraPlaceDataHtmlGateway();
        }
    },
});

container.register<IKeirinPlaceDataHtmlGateway>('KeirinPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new KeirinPlaceDataHtmlGateway();
            default:
                return new MockKeirinPlaceDataHtmlGateway();
        }
    },
});

container.register<IKeirinRaceDataHtmlGateway>('KeirinRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new KeirinRaceDataHtmlGateway();
            default:
                return new MockKeirinRaceDataHtmlGateway();
        }
    },
});

container.register<IWorldRaceDataHtmlGateway>('WorldRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                console.log('WorldRaceDataHtmlGateway');
                return new WorldRaceDataHtmlGateway();
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockWorldRaceDataHtmlGateway();
        }
    },
});
