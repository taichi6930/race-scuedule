import {
    baseNarPlaceData,
    baseNarPlaceEntity,
} from '../../mock/common/baseData';

describe('NarPlaceEntityクラスのテスト', () => {
    it('正しい入力でNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseNarPlaceEntity;

        expect(placeEntity.placeData).toEqual(baseNarPlaceData);
    });

    it('何も変更せずNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseNarPlaceEntity;
        const newPlaceEntity = placeEntity.copy();

        expect(newPlaceEntity.id).toEqual(placeEntity.id);
        expect(newPlaceEntity.placeData).toBe(placeEntity.placeData);
    });

    it('何も変更せずNarPlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseNarPlaceEntity;
        const placeData = placeEntity.placeData;

        expect(placeData).toEqual(baseNarPlaceData);
    });
});
