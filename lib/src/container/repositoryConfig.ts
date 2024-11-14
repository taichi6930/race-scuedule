import { container } from 'tsyringe';

import type { AutoracePlaceEntity } from '../repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../repository/entity/autoraceRaceEntity';
import type { JraPlaceEntity } from '../repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../repository/entity/jraRaceEntity';
import type { KeirinPlaceEntity } from '../repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../repository/entity/keirinRaceEntity';
import type { NarPlaceEntity } from '../repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../repository/entity/narRaceEntity';
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
import { MockAutoracePlaceRepositoryFromHtmlImpl } from '../repository/mock/mockAutoracePlaceRepositoryFromHtmlImpl';
import { MockAutoraceRaceRepositoryFromHtmlImpl } from '../repository/mock/mockAutoraceRaceRepositoryFromHtmlImpl';
import { MockJraPlaceRepositoryFromHtmlImpl } from '../repository/mock/mockJraPlaceRepositoryFromHtmlImpl';
import { MockJraRaceRepositoryFromHtmlImpl } from '../repository/mock/mockJraRaceRepositoryFromHtmlImpl';
import { MockKeirinPlaceRepositoryFromHtmlImpl } from '../repository/mock/mockKeirinPlaceRepositoryFromHtmlImpl';
import { MockKeirinRaceRepositoryFromHtmlImpl } from '../repository/mock/mockKeirinRaceRepositoryFromHtmlImpl';
import { MockNarPlaceRepositoryFromHtmlImpl } from '../repository/mock/mockNarPlaceRepositoryFromHtmlImpl';
import { MockNarRaceRepositoryFromHtmlImpl } from '../repository/mock/mockNarRaceRepositoryFromHtmlImpl';
import { MockWorldRaceRepositoryFromHtmlImpl } from '../repository/mock/mockWorldRaceRepositoryFromHtmlImpl';
import { ENV } from '../utility/env';
// Repositoryの実装クラスをDIコンテナに登録する

// Narリポジトリの登録
container.register<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
    'NarRaceRepositoryFromS3',
    { useClass: NarRaceRepositoryFromS3Impl },
);
container.register<IPlaceRepository<NarPlaceEntity>>(
    'NarPlaceRepositoryFromS3',
    { useClass: NarPlaceRepositoryFromS3Impl },
);

// Jraリポジトリの登録
container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
    'JraRaceRepositoryFromS3',
    { useClass: JraRaceRepositoryFromS3Impl },
);
container.register<IPlaceRepository<JraPlaceEntity>>(
    'JraPlaceRepositoryFromS3',
    { useClass: JraPlaceRepositoryFromS3Impl },
);

// Keirinリポジトリの登録
container.register<IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>>(
    'KeirinRaceRepositoryFromStorage',
    { useClass: KeirinRaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<KeirinPlaceEntity>>(
    'KeirinPlaceRepositoryFromStorage',
    { useClass: KeirinPlaceRepositoryFromStorageImpl },
);

// Autoraceリポジトリの登録
container.register<IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>>(
    'AutoraceRaceRepositoryFromStorage',
    { useClass: AutoraceRaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<AutoracePlaceEntity>>(
    'AutoracePlaceRepositoryFromStorage',
    { useClass: AutoracePlaceRepositoryFromStorageImpl },
);

// Worldリポジトリの登録
container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
    'WorldRaceRepositoryFromStorage',
    { useClass: WorldRaceRepositoryFromStorageImpl },
);

// 環境ごとの設定
switch (ENV) {
    case 'PRODUCTION':
    case 'LOCAL':
        container.register<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
            'NarRaceRepositoryFromHtml',
            { useClass: NarRaceRepositoryFromHtmlImpl },
        );
        container.register<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            { useClass: NarPlaceRepositoryFromHtmlImpl },
        );
        container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
            'JraRaceRepositoryFromHtml',
            { useClass: JraRaceRepositoryFromHtmlImpl },
        );
        container.register<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            { useClass: JraPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromHtml', {
            useClass: KeirinRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: KeirinPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceRepositoryFromHtml', {
            useClass: AutoraceRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromHtml',
            { useClass: AutoracePlaceRepositoryFromHtmlImpl },
        );
        container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceRepositoryFromHtml',
            { useClass: WorldRaceRepositoryFromHtmlImpl },
        );
        break;
    case 'ITa':
        container.register<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
            'NarRaceRepositoryFromHtml',
            { useClass: MockNarRaceRepositoryFromHtmlImpl },
        );
        container.register<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            { useClass: MockNarPlaceRepositoryFromHtmlImpl },
        );
        container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
            'JraRaceRepositoryFromHtml',
            { useClass: MockJraRaceRepositoryFromHtmlImpl },
        );
        container.register<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            { useClass: MockJraPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromHtml', {
            useClass: MockKeirinRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: MockKeirinPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceRepositoryFromHtml', {
            useClass: MockAutoraceRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromHtml',
            { useClass: MockAutoracePlaceRepositoryFromHtmlImpl },
        );
        container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceRepositoryFromHtml',
            { useClass: MockWorldRaceRepositoryFromHtmlImpl },
        );
        break;
}
