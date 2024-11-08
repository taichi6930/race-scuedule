import { container } from 'tsyringe';

import type { AutoracePlaceData } from '../domain/autoracePlaceData';
import type { AutoraceRaceData } from '../domain/autoraceRaceData';
import type { JraPlaceData } from '../domain/jraPlaceData';
import type { JraRaceData } from '../domain/jraRaceData';
import type { KeirinPlaceData } from '../domain/keirinPlaceData';
import type { KeirinRaceData } from '../domain/keirinRaceData';
import type { NarPlaceData } from '../domain/narPlaceData';
import type { NarRaceData } from '../domain/narRaceData';
import type { WorldRaceData } from '../domain/worldRaceData';
import { AutoracePlaceDataUseCase } from '../usecase/implement/autoracePlaceDataUseCase';
import { AutoraceRaceDataUseCase } from '../usecase/implement/autoraceRaceDataUseCase';
import { JraPlaceDataUseCase } from '../usecase/implement/jraPlaceDataUseCase';
import { JraRaceCalendarUseCase } from '../usecase/implement/jraRaceCalendarUseCase';
import { JraRaceDataUseCase } from '../usecase/implement/jraRaceDataUseCase';
import { KeirinPlaceDataUseCase } from '../usecase/implement/keirinPlaceDataUseCase';
import { KeirinRaceCalendarUseCase } from '../usecase/implement/keirinRaceCalendarUseCase';
import { KeirinRaceDataUseCase } from '../usecase/implement/keirinRaceDataUseCase';
import { NarPlaceDataUseCase } from '../usecase/implement/narPlaceDataUseCase';
import { NarRaceCalendarUseCase } from '../usecase/implement/narRaceCalendarUseCase';
import { NarRaceDataUseCase } from '../usecase/implement/narRaceDataUseCase';
import { WorldRaceCalendarUseCase } from '../usecase/implement/worldRaceCalendarUseCase';
import { WorldRaceDataUseCase } from '../usecase/implement/worldRaceDataUseCase';
import type { IPlaceDataUseCase } from '../usecase/interface/IPlaceDataUseCase';
import type { IRaceCalendarUseCase } from '../usecase/interface/IRaceCalendarUseCase';
import type { IRaceDataUseCase } from '../usecase/interface/IRaceDataUseCase';

// Usecaseの実装クラスをDIコンテナに登錄する
container.register<IRaceCalendarUseCase>('NarRaceCalendarUseCase', {
    useClass: NarRaceCalendarUseCase,
});
container.register<IRaceCalendarUseCase>('JraRaceCalendarUseCase', {
    useClass: JraRaceCalendarUseCase,
});
container.register<IRaceCalendarUseCase>('KeirinRaceCalendarUseCase', {
    useClass: KeirinRaceCalendarUseCase,
});
container.register<IRaceDataUseCase<NarRaceData>>('NarRaceDataUseCase', {
    useClass: NarRaceDataUseCase,
});
container.register<IRaceDataUseCase<JraRaceData>>('JraRaceDataUseCase', {
    useClass: JraRaceDataUseCase,
});
container.register<IRaceDataUseCase<KeirinRaceData>>('KeirinRaceDataUseCase', {
    useClass: KeirinRaceDataUseCase,
});
container.register<IPlaceDataUseCase<NarPlaceData>>('NarPlaceDataUseCase', {
    useClass: NarPlaceDataUseCase,
});
container.register<IPlaceDataUseCase<JraPlaceData>>('JraPlaceDataUseCase', {
    useClass: JraPlaceDataUseCase,
});
container.register<IPlaceDataUseCase<KeirinPlaceData>>(
    'KeirinPlaceDataUseCase',
    {
        useClass: KeirinPlaceDataUseCase,
    },
);
container.register<IRaceCalendarUseCase>('WorldRaceCalendarUseCase', {
    useClass: WorldRaceCalendarUseCase,
});
container.register<IRaceDataUseCase<WorldRaceData>>('WorldRaceDataUseCase', {
    useClass: WorldRaceDataUseCase,
});
container.register<IPlaceDataUseCase<AutoracePlaceData>>(
    'AutoracePlaceDataUseCase',
    {
        useClass: AutoracePlaceDataUseCase,
    },
);
container.register<IRaceDataUseCase<AutoraceRaceData>>(
    'AutoraceRaceDataUseCase',
    {
        useClass: AutoraceRaceDataUseCase,
    },
);
// container.register<IRaceCalendarUseCase>('AutoraceRaceCalendarUseCase', {
//     useClass: AutoraceRaceCalendarUseCase,
// });
