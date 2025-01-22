import { container } from 'tsyringe';

import { AutoracePlaceDataHtmlGateway } from '../src/gateway/implement/autoracePlaceDataHtmlGateway';
import { AutoraceRaceDataHtmlGateway } from '../src/gateway/implement/autoraceRaceDataHtmlGateway';
import { BoatracePlaceDataHtmlGateway } from '../src/gateway/implement/boatracePlaceDataHtmlGateway';
import { BoatraceRaceDataHtmlGateway } from '../src/gateway/implement/boatraceRaceDataHtmlGateway';
import { JraPlaceDataHtmlGateway } from '../src/gateway/implement/jraPlaceDataHtmlGateway';
import { JraRaceDataHtmlGateway } from '../src/gateway/implement/jraRaceDataHtmlGateway';
import { KeirinPlaceDataHtmlGateway } from '../src/gateway/implement/keirinPlaceDataHtmlGateway';
import { KeirinRaceDataHtmlGateway } from '../src/gateway/implement/keirinRaceDataHtmlGateway';
import { NarPlaceDataHtmlGateway } from '../src/gateway/implement/narPlaceDataHtmlGateway';
import { NarRaceDataHtmlGateway } from '../src/gateway/implement/narRaceDataHtmlGateway';
import { S3Gateway } from '../src/gateway/implement/s3Gateway';
import { WorldRaceDataHtmlGateway } from '../src/gateway/implement/worldRaceDataHtmlGateway';
import type { IAutoracePlaceDataHtmlGateway } from '../src/gateway/interface/iAutoracePlaceDataHtmlGateway';
import type { IAutoraceRaceDataHtmlGateway } from '../src/gateway/interface/iAutoraceRaceDataHtmlGateway';
import type { IBoatracePlaceDataHtmlGateway } from '../src/gateway/interface/iBoatracePlaceDataHtmlGateway';
import type { IBoatraceRaceDataHtmlGateway } from '../src/gateway/interface/iBoatraceRaceDataHtmlGateway';
import type { IJraPlaceDataHtmlGateway } from '../src/gateway/interface/iJraPlaceDataHtmlGateway';
import type { IJraRaceDataHtmlGateway } from '../src/gateway/interface/iJraRaceDataHtmlGateway';
import type { IKeirinPlaceDataHtmlGateway } from '../src/gateway/interface/iKeirinPlaceDataHtmlGateway';
import type { IKeirinRaceDataHtmlGateway } from '../src/gateway/interface/iKeirinRaceDataHtmlGateway';
import type { INarPlaceDataHtmlGateway } from '../src/gateway/interface/iNarPlaceDataHtmlGateway';
import type { INarRaceDataHtmlGateway } from '../src/gateway/interface/iNarRaceDataHtmlGateway';
import type { IS3Gateway } from '../src/gateway/interface/iS3Gateway';
import type { IWorldRaceDataHtmlGateway } from '../src/gateway/interface/iWorldRaceDataHtmlGateway';
import { MockAutoracePlaceDataHtmlGateway } from '../src/gateway/mock/mockAutoracePlaceDataHtmlGateway';
import { MockAutoraceRaceDataHtmlGateway } from '../src/gateway/mock/mockAutoraceRaceDataHtmlGateway';
import { MockBoatracePlaceDataHtmlGateway } from '../src/gateway/mock/mockBoatracePlaceDataHtmlGateway';
import { MockBoatraceRaceDataHtmlGateway } from '../src/gateway/mock/mockBoatraceRaceDataHtmlGateway';
import { MockJraPlaceDataHtmlGateway } from '../src/gateway/mock/mockJraPlaceDataHtmlGateway';
import { MockJraRaceDataHtmlGateway } from '../src/gateway/mock/mockJraRaceDataHtmlGateway';
import { MockKeirinPlaceDataHtmlGateway } from '../src/gateway/mock/mockKeirinPlaceDataHtmlGateway';
import { MockKeirinRaceDataHtmlGateway } from '../src/gateway/mock/mockKeirinRaceDataHtmlGateway';
import { MockNarPlaceDataHtmlGateway } from '../src/gateway/mock/mockNarPlaceDataHtmlGateway';
import { MockNarRaceDataHtmlGateway } from '../src/gateway/mock/mockNarRaceDataHtmlGateway';
import { MockS3Gateway } from '../src/gateway/mock/mockS3Gateway';
import { MockWorldRaceDataHtmlGateway } from '../src/gateway/mock/mockWorldRaceDataHtmlGateway';
import type { AutoracePlaceRecord } from '../src/gateway/record/autoracePlaceRecord';
import type { AutoraceRacePlayerRecord } from '../src/gateway/record/autoraceRacePlayerRecord';
import type { AutoraceRaceRecord } from '../src/gateway/record/autoraceRaceRecord';
import type { BoatracePlaceRecord } from '../src/gateway/record/boatracePlaceRecord';
import type { BoatraceRacePlayerRecord } from '../src/gateway/record/boatraceRacePlayerRecord';
import type { BoatraceRaceRecord } from '../src/gateway/record/boatraceRaceRecord';
import type { JraPlaceRecord } from '../src/gateway/record/jraPlaceRecord';
import type { JraRaceRecord } from '../src/gateway/record/jraRaceRecord';
import type { KeirinPlaceRecord } from '../src/gateway/record/keirinPlaceRecord';
import type { KeirinRacePlayerRecord } from '../src/gateway/record/keirinRacePlayerRecord';
import type { KeirinRaceRecord } from '../src/gateway/record/keirinRaceRecord';
import type { NarPlaceRecord } from '../src/gateway/record/narPlaceRecord';
import type { NarRaceRecord } from '../src/gateway/record/narRaceRecord';
import type { WorldRaceRecord } from '../src/gateway/record/worldRaceRecord';
import { ENV } from '../src/utility/env';

// s3Gatewayの実装クラスをDIコンテナに登錄する
container.register<IS3Gateway<KeirinPlaceRecord>>('KeirinPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<KeirinPlaceRecord>(
                    'race-schedule-bucket',
                    'keirin/',
                );
            case 'TEST':
                return new S3Gateway<KeirinPlaceRecord>(
                    'test-race-schedule-bucket',
                    'keirin/',
                );
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockS3Gateway<KeirinPlaceRecord>(
                    'race-schedule-bucket',
                    'keirin/',
                );
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
container.register<IS3Gateway<KeirinRaceRecord>>('KeirinRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<KeirinRaceRecord>(
                    'race-schedule-bucket',
                    'keirin/',
                );
            case 'TEST':
                return new S3Gateway<KeirinRaceRecord>(
                    'test-race-schedule-bucket',
                    'keirin/',
                );
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockS3Gateway<KeirinRaceRecord>(
                    'race-schedule-bucket',
                    'keirin/',
                );
            default:
                throw new Error('Invalid ENV value');
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
                        'keirin/',
                    );
                case 'TEST':
                    return new S3Gateway<KeirinRacePlayerRecord>(
                        'test-race-schedule-bucket',
                        'keirin/',
                    );
                case 'LOCAL':
                case 'LOCAL_NO_INIT_DATA':
                case 'LOCAL_INIT_MADE_DATA':
                    return new MockS3Gateway<KeirinRacePlayerRecord>(
                        'race-schedule-bucket',
                        'keirin/',
                    );
                default:
                    throw new Error('Invalid ENV value');
            }
        },
    },
);
container.register<IKeirinPlaceDataHtmlGateway>('KeirinPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new KeirinPlaceDataHtmlGateway();
            case 'LOCAL':
                return new MockKeirinPlaceDataHtmlGateway();
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
container.register<IKeirinRaceDataHtmlGateway>('KeirinRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new KeirinRaceDataHtmlGateway();
            case 'LOCAL':
                return new MockKeirinRaceDataHtmlGateway();
            default:
                throw new Error('Invalid ENV value');
        }
    },
});

container.register<IS3Gateway<NarRaceRecord>>('NarRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<NarRaceRecord>(
                    'race-schedule-bucket',
                    'nar/',
                );
            case 'TEST':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<NarRaceRecord>(
                    'test-race-schedule-bucket',
                    'nar/',
                );
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockS3Gateway<NarRaceRecord>(
                    'race-schedule-bucket',
                    'nar/',
                );
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
container.register<IS3Gateway<NarPlaceRecord>>('NarPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<NarPlaceRecord>(
                    'race-schedule-bucket',
                    'nar/',
                );
            case 'TEST':
                return new S3Gateway<NarPlaceRecord>(
                    'test-race-schedule-bucket',
                    'nar/',
                );
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockS3Gateway<NarPlaceRecord>(
                    'race-schedule-bucket',
                    'nar/',
                );
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
container.register<INarRaceDataHtmlGateway>('NarRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new NarRaceDataHtmlGateway();
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockNarRaceDataHtmlGateway();
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
container.register<INarPlaceDataHtmlGateway>('NarPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new NarPlaceDataHtmlGateway();
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockNarPlaceDataHtmlGateway();
            default:
                throw new Error('Invalid ENV value');
        }
    },
});

container.register<IS3Gateway<JraRaceRecord>>('JraRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<JraRaceRecord>(
                    'race-schedule-bucket',
                    'jra/',
                );
            case 'TEST':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<JraRaceRecord>(
                    'test-race-schedule-bucket',
                    'jra/',
                );
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockS3Gateway<JraRaceRecord>(
                    'race-schedule-bucket',
                    'jra/',
                );
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
container.register<IS3Gateway<JraPlaceRecord>>('JraPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<JraPlaceRecord>(
                    'race-schedule-bucket',
                    'jra/',
                );
            case 'TEST':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<JraPlaceRecord>(
                    'test-race-schedule-bucket',
                    'jra/',
                );
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockS3Gateway<JraPlaceRecord>(
                    'race-schedule-bucket',
                    'jra/',
                );
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
container.register<IJraRaceDataHtmlGateway>('JraRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new JraRaceDataHtmlGateway();
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockJraRaceDataHtmlGateway();
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
container.register<IJraPlaceDataHtmlGateway>('JraPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new JraPlaceDataHtmlGateway();
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockJraPlaceDataHtmlGateway();
            default:
                throw new Error('Invalid ENV value');
        }
    },
});

container.register<IS3Gateway<WorldRaceRecord>>('WorldRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<WorldRaceRecord>(
                    'race-schedule-bucket',
                    'world/',
                );
            case 'TEST':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<WorldRaceRecord>(
                    'test-race-schedule-bucket',
                    'world/',
                );
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockS3Gateway<WorldRaceRecord>(
                    'race-schedule-bucket',
                    'world/',
                );
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
container.register<IWorldRaceDataHtmlGateway>('WorldRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new WorldRaceDataHtmlGateway();
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockWorldRaceDataHtmlGateway();
            default:
                throw new Error('Invalid ENV value');
        }
    },
});

container.register<IS3Gateway<AutoraceRaceRecord>>('AutoraceRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<AutoraceRaceRecord>(
                    'race-schedule-bucket',
                    'autorace/',
                );
            case 'TEST':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<AutoraceRaceRecord>(
                    'test-race-schedule-bucket',
                    'autorace/',
                );
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockS3Gateway<AutoraceRaceRecord>(
                    'race-schedule-bucket',
                    'autorace/',
                );
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
container.register<IS3Gateway<AutoracePlaceRecord>>('AutoracePlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<AutoracePlaceRecord>(
                    'race-schedule-bucket',
                    'autorace/',
                );
            case 'TEST':
                return new S3Gateway<AutoracePlaceRecord>(
                    'test-race-schedule-bucket',
                    'autorace/',
                );
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockS3Gateway<AutoracePlaceRecord>(
                    'race-schedule-bucket',
                    'autorace/',
                );
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
container.register<IS3Gateway<AutoraceRacePlayerRecord>>(
    'AutoraceRacePlayerS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<AutoraceRacePlayerRecord>(
                        'race-schedule-bucket',
                        'autorace/',
                    );
                case 'TEST':
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<AutoraceRacePlayerRecord>(
                        'test-race-schedule-bucket',
                        'autorace/',
                    );
                case 'LOCAL':
                case 'LOCAL_NO_INIT_DATA':
                case 'LOCAL_INIT_MADE_DATA':
                    return new MockS3Gateway<AutoraceRacePlayerRecord>(
                        'race-schedule-bucket',
                        'autorace/',
                    );
                default:
                    throw new Error('Invalid ENV value');
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
                    return new AutoracePlaceDataHtmlGateway();
                case 'LOCAL':
                case 'LOCAL_NO_INIT_DATA':
                case 'LOCAL_INIT_MADE_DATA':
                    return new MockAutoracePlaceDataHtmlGateway();
                default:
                    throw new Error('Invalid ENV value');
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
                    return new AutoraceRaceDataHtmlGateway();
                case 'LOCAL':
                case 'LOCAL_NO_INIT_DATA':
                case 'LOCAL_INIT_MADE_DATA':
                    return new MockAutoraceRaceDataHtmlGateway();
                default:
                    throw new Error('Invalid ENV value');
            }
        },
    },
);

container.register<IS3Gateway<BoatracePlaceRecord>>('BoatracePlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<BoatracePlaceRecord>(
                    'race-schedule-bucket',
                    'boatrace/',
                );
            case 'TEST':
                return new S3Gateway<BoatracePlaceRecord>(
                    'test-race-schedule-bucket',
                    'boatrace/',
                );
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockS3Gateway<BoatracePlaceRecord>(
                    'race-schedule-bucket',
                    'boatrace/',
                );
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
container.register<IS3Gateway<BoatraceRaceRecord>>('BoatraceRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<BoatraceRaceRecord>(
                    'race-schedule-bucket',
                    'boatrace/',
                );
            case 'TEST':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<BoatraceRaceRecord>(
                    'test-race-schedule-bucket',
                    'boatrace/',
                );
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                return new MockS3Gateway<BoatraceRaceRecord>(
                    'race-schedule-bucket',
                    'boatrace/',
                );
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
container.register<IS3Gateway<BoatraceRacePlayerRecord>>(
    'BoatraceRacePlayerS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<BoatraceRacePlayerRecord>(
                        'race-schedule-bucket',
                        'boatrace/',
                    );
                case 'TEST':
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<BoatraceRacePlayerRecord>(
                        'test-race-schedule-bucket',
                        'boatrace/',
                    );
                case 'LOCAL':
                case 'LOCAL_NO_INIT_DATA':
                case 'LOCAL_INIT_MADE_DATA':
                    return new MockS3Gateway<BoatraceRacePlayerRecord>(
                        'race-schedule-bucket',
                        'boatrace/',
                    );
                default:
                    throw new Error('Invalid ENV value');
            }
        },
    },
);
container.register<IBoatracePlaceDataHtmlGateway>(
    'BoatracePlaceDataHtmlGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    return new BoatracePlaceDataHtmlGateway();
                case 'LOCAL':
                    return new MockBoatracePlaceDataHtmlGateway();
                default:
                    throw new Error('Invalid ENV value');
            }
        },
    },
);
container.register<IBoatraceRaceDataHtmlGateway>(
    'BoatraceRaceDataHtmlGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    return new BoatraceRaceDataHtmlGateway();
                case 'LOCAL':
                    return new MockBoatraceRaceDataHtmlGateway();
                default:
                    throw new Error('Invalid ENV value');
            }
        },
    },
);
