import {
    baseJraPlaceData,
    baseJraPlaceEntity,
} from '../../mock/common/baseData';

describe('JraPlaceEntityクラスのテスト', () => {
    it('正しい入力でJraPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseJraPlaceEntity;

        expect(placeEntity.dateTime).toEqual(new Date('2024-12-22 00:00'));
        expect(placeEntity.location).toBe('中山');
    });

    it('日付を変更したJraPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseJraPlaceEntity;
        const newPlaceEntity = placeEntity.copy({
            dateTime: new Date('2025-12-30'),
        });

        expect(newPlaceEntity.dateTime).toEqual(new Date('2025-12-30'));
        expect(newPlaceEntity.location).toBe('中山');
    });

    it('何も変更せずJraPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseJraPlaceEntity;
        const newPlaceEntity = placeEntity.copy();

        expect(newPlaceEntity).toEqual(placeEntity);
    });

    it('何も変更せずJraPlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseJraPlaceEntity;
        const placeData = placeEntity.toDomainData();

        expect(placeData).toEqual(baseJraPlaceData);
    });
});
