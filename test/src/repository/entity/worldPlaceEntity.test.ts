import {
    baseWorldPlaceData,
    baseWorldPlaceEntity,
} from '../../mock/common/baseData';

describe('WorldPlaceEntityクラスのテスト', () => {
    it('正しい入力でWorldPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseWorldPlaceEntity;

        expect(placeEntity.dateTime).toEqual(new Date('2024-10-01'));
        expect(placeEntity.location).toBe('パリロンシャン');
    });

    it('日付を変更したNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseWorldPlaceEntity;
        const newPlaceEntity = placeEntity.copy({
            dateTime: new Date('2025-12-30'),
        });

        expect(newPlaceEntity.dateTime).toEqual(new Date('2025-12-30'));
        expect(newPlaceEntity.location).toBe('パリロンシャン');
    });

    it('何も変更せずWorldPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseWorldPlaceEntity;
        const newPlaceEntity = placeEntity.copy();

        expect(newPlaceEntity).toEqual(placeEntity);
    });

    it('何も変更せずWorldPlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseWorldPlaceEntity;
        const placeData = placeEntity.toDomainData();

        expect(placeData).toEqual(baseWorldPlaceData);
    });
});
