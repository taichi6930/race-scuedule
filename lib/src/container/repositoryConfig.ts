import { container } from 'tsyringe';

import type { JraPlaceData } from '../domain/jraPlaceData';
import type { JraRaceData } from '../domain/jraRaceData';
import type { NarPlaceData } from '../domain/narPlaceData';
import type { NarRaceData } from '../domain/narRaceData';
import type { AutoracePlaceEntity } from '../repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../repository/entity/autoraceRaceEntity';
import type { KeirinPlaceEntity } from '../repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../repository/entity/keirinRaceEntity';
import type { WorldPlaceEntity } from '../repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../repository/entity/worldRaceEntity';
import { AutoracePlaceRepositoryFromHtmlImpl } from '../repository/implement/autoracePlaceRepositoryFromHtmlImpl';
import { AutoracePlaceRepositoryFromStorageImpl } from '../repository/implement/autoracePlaceRepositoryFromStorageImpl';
import { AutoraceRaceRepositoryFromHtmlImpl } from '../repository/implement/autoraceRaceRepositoryFromHtmlImpl';
import { AutoraceRaceRepositoryFromStorageImpl } from '../repository/implement/autoraceRaceRepositoryFromStorageImpl';
import { JraPlaceRepositoryFromHtmlImpl } from '../repository/implement/jraPlaceRepositoryFromHtmlImpl';
import { JraPlaceRepositoryFromS3Impl } from '../repository/implement/jraPlaceRepositoryFromS3Impl';
import { JraRaceRepositoryFromHtmlImpl } from '../repository/implement/jraRaceRepositoryFromHtmlImpl';
import { JraRaceRepositoryFromS3Impl } from '../repository/implement/jraRaceRepositoryFromS3Impl';
import { KeirinPlaceRepositoryFromHtmlImpl } from '../repository/implement/keirinPlaceRepositoryFromHtmlImpl';
import { KeirinPlaceRepositoryFromStorageImpl } from '../repository/implement/keirinPlaceRepositoryFromStorageImpl';
import { KeirinRaceRepositoryFromHtmlImpl } from '../repository/implement/keirinRaceRepositoryFromHtmlImpl';
import { KeirinRaceRepositoryFromStorageImpl } from '../repository/implement/keirinRaceRepositoryFromStorageImpl';
import { NarPlaceRepositoryFromHtmlImpl } from '../repository/implement/narPlaceRepositoryFromHtmlImpl';
import { NarPlaceRepositoryFromS3Impl } from '../repository/implement/narPlaceRepositoryFromS3Impl';
import { NarRaceRepositoryFromHtmlImpl } from '../repository/implement/narRaceRepositoryFromHtmlImpl';
import { NarRaceRepositoryFromS3Impl } from '../repository/implement/narRaceRepositoryFromS3Impl';
import { WorldRaceRepositoryFromHtmlImpl } from '../repository/implement/worldRaceRepositoryFromHtmlImpl';
import { WorldRaceRepositoryFromStorageImpl } from '../repository/implement/worldRaceRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../repository/interface/IRaceRepository';
import { MockKeirinPlaceRepositoryFromHtmlImpl } from '../repository/mock/mockKeirinPlaceRepositoryFromHtmlImpl';
import { MockKeirinRaceRepositoryFromHtmlImpl } from '../repository/mock/mockKeirinRaceRepositoryFromHtmlImpl';
import { MockWorldRaceRepositoryFromHtmlImpl } from '../repository/mock/mockWorldRaceRepositoryFromHtmlImpl';
import { ENV } from '../utility/env';

// Repositoryの実装クラスをDIコンテナに登錄する
container.register<IRaceRepository<NarRaceData, NarPlaceData>>(
    'NarRaceRepositoryFromS3',
    { useClass: NarRaceRepositoryFromS3Impl },
);
container.register<IRaceRepository<JraRaceData, JraPlaceData>>(
    'JraRaceRepositoryFromS3',
    { useClass: JraRaceRepositoryFromS3Impl },
);
container.register<IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>>(
    'KeirinRaceRepositoryFromStorage',
    { useClass: KeirinRaceRepositoryFromStorageImpl },
);
container.register<IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>>(
    'AutoraceRaceRepositoryFromStorage',
    { useClass: AutoraceRaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<NarPlaceData>>('NarPlaceRepositoryFromS3', {
    useClass: NarPlaceRepositoryFromS3Impl,
});
container.register<IPlaceRepository<JraPlaceData>>('JraPlaceRepositoryFromS3', {
    useClass: JraPlaceRepositoryFromS3Impl,
});
container.register<IPlaceRepository<KeirinPlaceEntity>>(
    'KeirinPlaceRepositoryFromStorage',
    { useClass: KeirinPlaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<AutoracePlaceEntity>>(
    'AutoracePlaceRepositoryFromStorage',
    { useClass: AutoracePlaceRepositoryFromStorageImpl },
);
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
container.register<IPlaceRepository<AutoracePlaceEntity>>(
    'AutoracePlaceRepositoryFromHtml',
    { useClass: AutoracePlaceRepositoryFromHtmlImpl },
);
container.register<IPlaceRepository<JraPlaceData>>(
    'JraPlaceRepositoryFromHtml',
    { useClass: JraPlaceRepositoryFromHtmlImpl },
);
switch (ENV) {
    case 'PRODUCTION':
    case 'LOCAL':
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: KeirinPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromHtml', {
            useClass: KeirinRaceRepositoryFromHtmlImpl,
        });
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromHtml', {
            useClass: KeirinRaceRepositoryFromHtmlImpl,
        });
        container.register<
            IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceRepositoryFromHtml', {
            useClass: AutoraceRaceRepositoryFromHtmlImpl,
        });
        break;
    case 'ITa':
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: MockKeirinPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromHtml', {
            useClass: MockKeirinRaceRepositoryFromHtmlImpl,
        });
        break;
}
container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
    'WorldRaceRepositoryFromStorage',
    { useClass: WorldRaceRepositoryFromStorageImpl },
);
switch (ENV) {
    case 'PRODUCTION':
    case 'LOCAL':
        container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceRepositoryFromHtml',
            {
                useClass: WorldRaceRepositoryFromHtmlImpl,
            },
        );
        break;
    case 'ITa':
        container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceRepositoryFromHtml',
            {
                useClass: MockWorldRaceRepositoryFromHtmlImpl,
            },
        );
        break;
}
