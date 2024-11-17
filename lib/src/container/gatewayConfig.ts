import { container } from 'tsyringe';

import { AutoracePlaceDataHtmlGateway } from '../gateway/implement/autoracePlaceDataHtmlGateway';
import { AutoraceRaceDataHtmlGateway } from '../gateway/implement/autoraceRaceDataHtmlGateway';
import { JraPlaceDataHtmlGateway } from '../gateway/implement/jraPlaceDataHtmlGateway';
import { JraRaceDataHtmlGateway } from '../gateway/implement/jraRaceDataHtmlGateway';
import { KeirinPlaceDataHtmlGateway } from '../gateway/implement/keirinPlaceDataHtmlGateway';
import { KeirinRaceDataHtmlGateway } from '../gateway/implement/keirinRaceDataHtmlGateway';
import { NarPlaceDataHtmlGateway } from '../gateway/implement/narPlaceDataHtmlGateway';
import { NarRaceDataHtmlGateway } from '../gateway/implement/narRaceDataHtmlGateway';
import { S3Gateway } from '../gateway/implement/s3Gateway';
import { WorldRaceDataHtmlGateway } from '../gateway/implement/worldRaceDataHtmlGateway';
import type { IAutoracePlaceDataHtmlGateway } from '../gateway/interface/iAutoracePlaceDataHtmlGateway';
import type { IAutoraceRaceDataHtmlGateway } from '../gateway/interface/iAutoraceRaceDataHtmlGateway';
import type { IJraPlaceDataHtmlGateway } from '../gateway/interface/iJraPlaceDataHtmlGateway';
import type { IJraRaceDataHtmlGateway } from '../gateway/interface/iJraRaceDataHtmlGateway';
import type { IKeirinPlaceDataHtmlGateway } from '../gateway/interface/iKeirinPlaceDataHtmlGateway';
import type { IKeirinRaceDataHtmlGateway } from '../gateway/interface/iKeirinRaceDataHtmlGateway';
import type { INarPlaceDataHtmlGateway } from '../gateway/interface/iNarPlaceDataHtmlGateway';
import type { INarRaceDataHtmlGateway } from '../gateway/interface/iNarRaceDataHtmlGateway';
import type { IS3Gateway } from '../gateway/interface/iS3Gateway';
import type { IWorldRaceDataHtmlGateway } from '../gateway/interface/iWorldRaceDataHtmlGateway';
import { MockAutoracePlaceDataHtmlGateway } from '../gateway/mock/mockAutoracePlaceDataHtmlGateway';
import { MockAutoraceRaceDataHtmlGateway } from '../gateway/mock/mockAutoraceRaceDataHtmlGateway';
import { MockJraPlaceDataHtmlGateway } from '../gateway/mock/mockJraPlaceDataHtmlGateway';
import { MockJraRaceDataHtmlGateway } from '../gateway/mock/mockJraRaceDataHtmlGateway';
import { MockKeirinPlaceDataHtmlGateway } from '../gateway/mock/mockKeirinPlaceDataHtmlGateway';
import { MockKeirinRaceDataHtmlGateway } from '../gateway/mock/mockKeirinRaceDataHtmlGateway';
import { MockNarPlaceDataHtmlGateway } from '../gateway/mock/mockNarPlaceDataHtmlGateway';
import { MockNarRaceDataHtmlGateway } from '../gateway/mock/mockNarRaceDataHtmlGateway';
import { MockS3Gateway } from '../gateway/mock/mockS3Gateway';
import { MockWorldRaceDataHtmlGateway } from '../gateway/mock/mockWorldRaceDataHtmlGateway';
import type { KeirinPlaceRecord } from '../gateway/record/keirinPlaceRecord';
import type { KeirinRacePlayerRecord } from '../gateway/record/keirinRacePlayerRecord';
import type { KeirinRaceRecord } from '../gateway/record/keirinRaceRecord';
import type { AutoracePlaceEntity } from '../repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../repository/entity/autoraceRaceEntity';
import type { JraPlaceEntity } from '../repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../repository/entity/jraRaceEntity';
import type { NarPlaceEntity } from '../repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../repository/entity/narRaceEntity';
import type { WorldRaceEntity } from '../repository/entity/worldRaceEntity';
import { ENV } from '../utility/env';

// s3Gatewayの実装クラスをDIコンテナに登錄する
container.register<IS3Gateway<KeirinPlaceRecord>>('KeirinPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<KeirinPlaceRecord>(
                    'race-schedule-bucket',
                    'keirin/place/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<KeirinPlaceRecord>(
                    'race-schedule-bucket',
                    'keirin/place/',
                );
        }
    },
});
container.register<IS3Gateway<NarRaceEntity>>('NarRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<NarRaceEntity>(
                    'race-schedule-bucket',
                    'nar/race/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<NarRaceEntity>(
                    'race-schedule-bucket',
                    'nar/race/',
                );
        }
    },
});
container.register<IS3Gateway<KeirinRaceRecord>>('KeirinRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<KeirinRaceRecord>(
                    'race-schedule-bucket',
                    'keirin/race/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<KeirinRaceRecord>(
                    'race-schedule-bucket',
                    'keirin/race/',
                );
        }
    },
});
container.register<IS3Gateway<KeirinRacePlayerRecord>>(
    'KeirinRacePlayerS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<KeirinRacePlayerRecord>(
                        'race-schedule-bucket',
                        'keirin/raceplayer/',
                    );
                case 'ITa':
                case 'LOCAL':
                default:
                    return new MockS3Gateway<KeirinRacePlayerRecord>(
                        'race-schedule-bucket',
                        'keirin/raceplayer/',
                    );
            }
        },
    },
);
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
container.register<IS3Gateway<AutoraceRaceEntity>>('AutoraceRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<AutoraceRaceEntity>(
                    'race-schedule-bucket',
                    'autorace/race/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<AutoraceRaceEntity>(
                    'race-schedule-bucket',
                    'autorace/race/',
                );
        }
    },
});
container.register<IS3Gateway<JraRaceEntity>>('JraRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<JraRaceEntity>(
                    'race-schedule-bucket',
                    'jra/race/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<JraRaceEntity>(
                    'race-schedule-bucket',
                    'jra/race/',
                );
        }
    },
});
container.register<IS3Gateway<NarPlaceEntity>>('NarPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<NarPlaceEntity>(
                    'race-schedule-bucket',
                    'nar/place/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<NarPlaceEntity>(
                    'race-schedule-bucket',
                    'nar/place/',
                );
        }
    },
});
container.register<IS3Gateway<JraPlaceEntity>>('JraPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<JraPlaceEntity>(
                    'race-schedule-bucket',
                    'jra/place/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<JraPlaceEntity>(
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

container.register<IAutoraceRaceDataHtmlGateway>(
    'AutoraceRaceDataHtmlGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    return new AutoraceRaceDataHtmlGateway();
                default:
                    return new MockAutoraceRaceDataHtmlGateway();
            }
        },
    },
);

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

container.register<IS3Gateway<AutoracePlaceEntity>>(
    'AutoracePlaceStorageGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    return new S3Gateway<AutoracePlaceEntity>(
                        'race-schedule-bucket',
                        'autorace/place/',
                    );
                case 'ITa':
                case 'LOCAL':
                default:
                    return new MockS3Gateway<AutoracePlaceEntity>(
                        'race-schedule-bucket',
                        'autorace/place/',
                    );
            }
        },
    },
);

container.register<IAutoracePlaceDataHtmlGateway>(
    'AutoracePlaceDataHtmlGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    console.log('AutoracePlaceDataHtmlGateway');
                    return new AutoracePlaceDataHtmlGateway();
                case 'ITa':
                case 'LOCAL':
                default:
                    return new MockAutoracePlaceDataHtmlGateway();
            }
        },
    },
);

container.register<IAutoraceRaceDataHtmlGateway>(
    'AutoraceRaceDataHtmlGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    console.log('AutoraceRaceDataHtmlGateway');
                    return new AutoraceRaceDataHtmlGateway();
                case 'ITa':
                case 'LOCAL':
                default:
                    return new MockAutoraceRaceDataHtmlGateway();
            }
        },
    },
);
