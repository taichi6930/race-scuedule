import { container } from 'tsyringe';

import type { AutoracePlaceData } from '../src/domain/autoracePlaceData';
import type { AutoraceRaceData } from '../src/domain/autoraceRaceData';
import type { BoatracePlaceData } from '../src/domain/boatracePlaceData';
import type { BoatraceRaceData } from '../src/domain/boatraceRaceData';
import type { JraPlaceData } from '../src/domain/jraPlaceData';
import type { JraRaceData } from '../src/domain/jraRaceData';
import type { KeirinPlaceData } from '../src/domain/keirinPlaceData';
import type { KeirinRaceData } from '../src/domain/keirinRaceData';
import type { NarPlaceData } from '../src/domain/narPlaceData';
import type { NarRaceData } from '../src/domain/narRaceData';
import type { WorldRaceData } from '../src/domain/worldRaceData';
import { AutoracePlaceDataUseCase } from '../src/usecase/implement/autoracePlaceDataUseCase';
import { AutoraceRaceCalendarUseCase } from '../src/usecase/implement/autoraceRaceCalendarUseCase';
import { AutoraceRaceDataUseCase } from '../src/usecase/implement/autoraceRaceDataUseCase';
import { BoatracePlaceDataUseCase } from '../src/usecase/implement/boatracePlaceDataUseCase';
import { BoatraceRaceCalendarUseCase } from '../src/usecase/implement/boatraceRaceCalendarUseCase';
import { BoatraceRaceDataUseCase } from '../src/usecase/implement/boatraceRaceDataUseCase';
import { JraPlaceDataUseCase } from '../src/usecase/implement/jraPlaceDataUseCase';
import { JraRaceCalendarUseCase } from '../src/usecase/implement/jraRaceCalendarUseCase';
import { JraRaceDataUseCase } from '../src/usecase/implement/jraRaceDataUseCase';
import { KeirinPlaceDataUseCase } from '../src/usecase/implement/keirinPlaceDataUseCase';
import { KeirinRaceCalendarUseCase } from '../src/usecase/implement/keirinRaceCalendarUseCase';
import { KeirinRaceDataUseCase } from '../src/usecase/implement/keirinRaceDataUseCase';
import { NarPlaceDataUseCase } from '../src/usecase/implement/narPlaceDataUseCase';
import { NarRaceCalendarUseCase } from '../src/usecase/implement/narRaceCalendarUseCase';
import { NarRaceDataUseCase } from '../src/usecase/implement/narRaceDataUseCase';
import { WorldRaceCalendarUseCase } from '../src/usecase/implement/worldRaceCalendarUseCase';
import { WorldRaceDataUseCase } from '../src/usecase/implement/worldRaceDataUseCase';
import type { IPlaceDataUseCase } from '../src/usecase/interface/IPlaceDataUseCase';
import type { IRaceCalendarUseCase } from '../src/usecase/interface/IRaceCalendarUseCase';
import type { IRaceDataUseCase } from '../src/usecase/interface/IRaceDataUseCase';
import type { AutoraceGradeType } from '../src/utility/data/autorace/autoraceGradeType';
import type { AutoraceRaceCourse } from '../src/utility/data/autorace/autoraceRaceCourse';
import type { AutoraceRaceStage } from '../src/utility/data/autorace/autoraceRaceStage';
import type {
    BoatraceGradeType,
    BoatraceRaceCourse,
    BoatraceRaceStage,
} from '../src/utility/data/boatrace';
import type { JraGradeType, JraRaceCourse } from '../src/utility/data/jra';
import type {
    KeirinGradeType,
    KeirinRaceCourse,
    KeirinRaceStage,
} from '../src/utility/data/keirin';
import type { NarGradeType, NarRaceCourse } from '../src/utility/data/nar';
import type {
    WorldGradeType,
    WorldRaceCourse,
} from '../src/utility/data/world';

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
container.register<
    IRaceDataUseCase<NarRaceData, NarGradeType, NarRaceCourse, undefined>
>('NarRaceDataUseCase', {
    useClass: NarRaceDataUseCase,
});
container.register<
    IRaceDataUseCase<JraRaceData, JraGradeType, JraRaceCourse, undefined>
>('JraRaceDataUseCase', {
    useClass: JraRaceDataUseCase,
});
container.register<
    IRaceDataUseCase<
        KeirinRaceData,
        KeirinGradeType,
        KeirinRaceCourse,
        KeirinRaceStage
    >
>('KeirinRaceDataUseCase', {
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
container.register<
    IRaceDataUseCase<WorldRaceData, WorldGradeType, WorldRaceCourse, undefined>
>('WorldRaceDataUseCase', {
    useClass: WorldRaceDataUseCase,
});
container.register<IPlaceDataUseCase<AutoracePlaceData>>(
    'AutoracePlaceDataUseCase',
    {
        useClass: AutoracePlaceDataUseCase,
    },
);
container.register<
    IRaceDataUseCase<
        AutoraceRaceData,
        AutoraceGradeType,
        AutoraceRaceCourse,
        AutoraceRaceStage
    >
>('AutoraceRaceDataUseCase', {
    useClass: AutoraceRaceDataUseCase,
});
container.register<IRaceCalendarUseCase>('AutoraceRaceCalendarUseCase', {
    useClass: AutoraceRaceCalendarUseCase,
});
container.register<IPlaceDataUseCase<BoatracePlaceData>>(
    'BoatracePlaceDataUseCase',
    {
        useClass: BoatracePlaceDataUseCase,
    },
);
container.register<
    IRaceDataUseCase<
        BoatraceRaceData,
        BoatraceGradeType,
        BoatraceRaceCourse,
        BoatraceRaceStage
    >
>('BoatraceRaceDataUseCase', {
    useClass: BoatraceRaceDataUseCase,
});
container.register<IRaceCalendarUseCase>('BoatraceRaceCalendarUseCase', {
    useClass: BoatraceRaceCalendarUseCase,
});
