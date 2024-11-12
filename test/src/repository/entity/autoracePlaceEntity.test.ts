import {
    baseAutoracePlaceData,
    baseAutoracePlaceEntity,
} from '../../../src/mock/common/baseData';

describe('AutoracePlaceEntityクラスのテスト', () => {
    it('正しい入力でAutoracePlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseAutoracePlaceEntity;

        expect(placeEntity.dateTime).toEqual(new Date('2024-12-31'));
        expect(placeEntity.location).toBe('飯塚');
    });

    it('日付を変更したNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseAutoracePlaceEntity;
        const newPlaceEntity = placeEntity.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(newPlaceEntity.dateTime).toEqual(new Date('2022-12-30'));
        expect(newPlaceEntity.location).toBe('飯塚');
    });

    it('何も変更せずAutoracePlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseAutoracePlaceEntity;
        const newPlaceEntity = placeEntity.copy();

        expect(newPlaceEntity).toEqual(placeEntity);
    });

    it('何も変更せずAutoracePlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseAutoracePlaceEntity;
        const placeData = placeEntity.toDomainData();

        expect(placeData).toEqual(baseAutoracePlaceData);
    });
});
