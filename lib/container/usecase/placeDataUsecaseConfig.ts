import { container } from 'tsyringe';

import type { AutoracePlaceData } from '../../src/domain/autoracePlaceData';
import type { BoatracePlaceData } from '../../src/domain/boatracePlaceData';
import type { JraPlaceData } from '../../src/domain/jraPlaceData';
import type { KeirinPlaceData } from '../../src/domain/keirinPlaceData';
import type { NarPlaceData } from '../../src/domain/narPlaceData';
import { AutoracePlaceDataUseCase } from '../../src/usecase/implement/autoracePlaceDataUseCase';
import { BoatracePlaceDataUseCase } from '../../src/usecase/implement/boatracePlaceDataUseCase';
import { JraPlaceDataUseCase } from '../../src/usecase/implement/jraPlaceDataUseCase';
import { KeirinPlaceDataUseCase } from '../../src/usecase/implement/keirinPlaceDataUseCase';
import { NarPlaceDataUseCase } from '../../src/usecase/implement/narPlaceDataUseCase';
import type { IPlaceDataUseCase } from '../../src/usecase/interface/IPlaceDataUseCase';

container.register<IPlaceDataUseCase<BoatracePlaceData>>(
    'BoatracePlaceDataUseCase',
    {
        useClass: BoatracePlaceDataUseCase,
    },
);
container.register<IPlaceDataUseCase<AutoracePlaceData>>(
    'AutoracePlaceDataUseCase',
    {
        useClass: AutoracePlaceDataUseCase,
    },
);
container.register<IPlaceDataUseCase<KeirinPlaceData>>(
    'KeirinPlaceDataUseCase',
    {
        useClass: KeirinPlaceDataUseCase,
    },
);
container.register<IPlaceDataUseCase<NarPlaceData>>('NarPlaceDataUseCase', {
    useClass: NarPlaceDataUseCase,
});
container.register<IPlaceDataUseCase<JraPlaceData>>('JraPlaceDataUseCase', {
    useClass: JraPlaceDataUseCase,
});
