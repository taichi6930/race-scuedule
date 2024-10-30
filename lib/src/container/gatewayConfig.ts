import { container } from 'tsyringe';

import { JraPlaceData } from '../domain/jraPlaceData';
import { JraRaceData } from '../domain/jraRaceData';
import { KeirinPlaceData } from '../domain/keirinPlaceData';
import { KeirinRaceData } from '../domain/keirinRaceData';
import { NarPlaceData } from '../domain/narPlaceData';
import { NarRaceData } from '../domain/narRaceData';
import { JraPlaceDataHtmlGateway } from '../gateway/implement/jraPlaceDataHtmlGateway';
import { JraRaceDataHtmlGateway } from '../gateway/implement/jraRaceDataHtmlGateway';
import { KeirinPlaceDataHtmlGateway } from '../gateway/implement/keirinPlaceDataHtmlGateway';
import { KeirinRaceDataHtmlGateway } from '../gateway/implement/keirinRaceDataHtmlGateway';
import { NarPlaceDataHtmlGateway } from '../gateway/implement/narPlaceDataHtmlGateway';
import { NarRaceDataHtmlGateway } from '../gateway/implement/narRaceDataHtmlGateway';
import { S3Gateway } from '../gateway/implement/s3Gateway';
import { IJraPlaceDataHtmlGateway } from '../gateway/interface/iJraPlaceDataHtmlGateway';
import { IJraRaceDataHtmlGateway } from '../gateway/interface/iJraRaceDataHtmlGateway';
import { IKeirinPlaceDataHtmlGateway } from '../gateway/interface/iKeirinPlaceDataHtmlGateway';
import { IKeirinRaceDataHtmlGateway } from '../gateway/interface/iKeirinRaceDataHtmlGateway';
import { INarPlaceDataHtmlGateway } from '../gateway/interface/iNarPlaceDataHtmlGateway';
import { INarRaceDataHtmlGateway } from '../gateway/interface/iNarRaceDataHtmlGateway';
import { IS3Gateway } from '../gateway/interface/iS3Gateway';
import { MockJraPlaceDataHtmlGateway } from '../gateway/mock/mockJraPlaceDataHtmlGateway';
import { MockJraRaceDataHtmlGateway } from '../gateway/mock/mockJraRaceDataHtmlGateway';
import { MockKeirinPlaceDataHtmlGateway } from '../gateway/mock/mockKeirinPlaceDataHtmlGateway';
import { MockKeirinRaceDataHtmlGateway } from '../gateway/mock/mockKeirinRaceDataHtmlGateway';
import { MockNarPlaceDataHtmlGateway } from '../gateway/mock/mockNarPlaceDataHtmlGateway';
import { MockNarRaceDataHtmlGateway } from '../gateway/mock/mockNarRaceDataHtmlGateway';
import { MockS3Gateway } from '../gateway/mock/mockS3Gateway';

// s3Gatewayの実装クラスをDIコンテナに登錄する
container.register<IS3Gateway<KeirinPlaceData>>('KeirinPlaceS3Gateway', {
    useFactory: () => {
        console.log(`KeirinPlaceS3Gateway ${process.env.ENV}`);
        switch (process.env.ENV) {
            case 'production':
                return new S3Gateway<KeirinPlaceData>(
                    'race-schedule-bucket',
                    'keirin/place/',
                );
            case 'ita':
            case 'local':
            default:
                return new MockS3Gateway<KeirinPlaceData>(
                    'race-schedule-bucket',
                    'keirin/place/',
                );
        }
    },
});
container.register<IS3Gateway<NarRaceData>>('NarRaceS3Gateway', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<NarRaceData>(
                    'race-schedule-bucket',
                    'nar/race/',
                );
            case 'ita':
            case 'local':
            default:
                return new MockS3Gateway<NarRaceData>(
                    'race-schedule-bucket',
                    'nar/race/',
                );
        }
    },
});
container.register<IS3Gateway<KeirinRaceData>>('KeirinRaceS3Gateway', {
    useFactory: () => {
        console.log(`KeirinRaceS3Gateway ${process.env.ENV}`);
        switch (process.env.ENV) {
            case 'production':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<KeirinRaceData>(
                    'race-schedule-bucket',
                    'keirin/race/',
                );
            case 'ita':
            case 'local':
            default:
                return new MockS3Gateway<KeirinRaceData>(
                    'race-schedule-bucket',
                    'keirin/race/',
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
            case 'ita':
            case 'local':
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
        console.log(`NarPlaceS3Gateway ${process.env.ENV}`);
        switch (process.env.ENV) {
            case 'production':
                return new S3Gateway<NarPlaceData>(
                    'race-schedule-bucket',
                    'nar/place/',
                );
            case 'ita':
            case 'local':
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
            case 'ita':
            case 'local':
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
            case 'ita':
            case 'local':
            default:
                return new MockNarRaceDataHtmlGateway();
        }
    },
});
container.register<IJraRaceDataHtmlGateway>('JraRaceDataHtmlGateway', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                console.log('JraRaceDataHtmlGateway');
                return new JraRaceDataHtmlGateway();
            case 'ita':
            case 'local':
            default:
                return new MockJraRaceDataHtmlGateway();
        }
    },
});
container.register<INarPlaceDataHtmlGateway>('NarPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                return new NarPlaceDataHtmlGateway();
            case 'ita':
            case 'local':
            default:
                return new MockNarPlaceDataHtmlGateway();
        }
    },
});
container.register<IJraPlaceDataHtmlGateway>('JraPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                return new JraPlaceDataHtmlGateway();
            case 'ita':
            case 'local':
            default:
                return new MockJraPlaceDataHtmlGateway();
        }
    },
});

container.register<IKeirinPlaceDataHtmlGateway>('KeirinPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                return new KeirinPlaceDataHtmlGateway();
            default:
                return new MockKeirinPlaceDataHtmlGateway();
        }
    },
});

container.register<IKeirinRaceDataHtmlGateway>('KeirinRaceDataHtmlGateway', {
    useFactory: () => {
        switch (process.env.ENV) {
            case 'production':
                return new KeirinRaceDataHtmlGateway();
            default:
                return new MockKeirinRaceDataHtmlGateway();
        }
    },
});
