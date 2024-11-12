import {
    baseKeirinPlaceData,
    baseKeirinPlaceEntity,
} from '../../mock/common/baseData';

describe('KeirinPlaceEntityクラスのテスト', () => {
    it('正しい入力でKeirinPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseKeirinPlaceEntity;

        expect(placeEntity.dateTime).toEqual(new Date('2025-12-30'));
        expect(placeEntity.location).toBe('平塚');
    });

    it('日付を変更したNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseKeirinPlaceEntity;
        const newPlaceEntity = placeEntity.copy({
            dateTime: new Date('2025-12-30'),
        });

        expect(newPlaceEntity.dateTime).toEqual(new Date('2025-12-30'));
        expect(newPlaceEntity.location).toBe('平塚');
    });

    it('何も変更せずKeirinPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseKeirinPlaceEntity;
        const newPlaceEntity = placeEntity.copy();

        expect(newPlaceEntity).toEqual(placeEntity);
    });

    it('何も変更せずKeirinPlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseKeirinPlaceEntity;
        const placeData = placeEntity.toDomainData();

        expect(placeData).toEqual(baseKeirinPlaceData);
    });
});
