import {
    baseWorldPlaceData,
    baseWorldPlaceEntity,
} from '../../mock/common/baseData';

describe('WorldPlaceEntityクラスのテスト', () => {
    it('正しい入力でWorldPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseWorldPlaceEntity;

        expect(placeEntity.placeData).toEqual(baseWorldPlaceData);
    });

    it('何も変更せずWorldPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseWorldPlaceEntity;
        const newPlaceEntity = placeEntity.copy();

        expect(newPlaceEntity.id).toEqual(placeEntity.id);
        expect(newPlaceEntity.placeData).toBe(placeEntity.placeData);
    });

    it('何も変更せずWorldPlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseWorldPlaceEntity;
        const placeData = placeEntity.placeData;

        expect(placeData).toEqual(baseWorldPlaceData);
    });
});
