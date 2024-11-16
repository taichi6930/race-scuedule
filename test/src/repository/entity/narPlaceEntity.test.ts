import {
    baseNarPlaceData,
    baseNarPlaceEntity,
} from '../../mock/common/baseData';

describe('NarPlaceEntityクラスのテスト', () => {
    it('正しい入力でNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseNarPlaceEntity;

        expect(placeEntity.dateTime).toEqual(new Date('2024-06-03'));
        expect(placeEntity.location).toBe('大井');
    });

    it('日付を変更したNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseNarPlaceEntity;
        const newPlaceEntity = placeEntity.copy({
            dateTime: new Date('2025-12-30'),
        });

        expect(newPlaceEntity.dateTime).toEqual(new Date('2025-12-30'));
        expect(newPlaceEntity.location).toBe('大井');
    });

    it('何も変更せずNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseNarPlaceEntity;
        const newPlaceEntity = placeEntity.copy();

        expect(newPlaceEntity).toEqual(placeEntity);
    });

    it('何も変更せずNarPlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseNarPlaceEntity;
        const placeData = placeEntity.toDomainData();

        expect(placeData).toEqual(baseNarPlaceData);
    });
});
