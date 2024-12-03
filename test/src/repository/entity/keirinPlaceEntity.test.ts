import {
    baseKeirinPlaceData,
    baseKeirinPlaceEntity,
} from '../../mock/common/baseData';

describe('KeirinPlaceEntityクラスのテスト', () => {
    it('正しい入力でKeirinPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseKeirinPlaceEntity;

        expect(placeEntity.placeData).toEqual(baseKeirinPlaceData);
    });

    it('日付を変更したKeirinPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseKeirinPlaceEntity;
        const newPlaceEntity = placeEntity.copy({
            placeData: baseKeirinPlaceData.copy({
                dateTime: new Date('2022-12-30'),
            }),
        });

        expect(newPlaceEntity.placeData.dateTime).toEqual(
            new Date('2022-12-30'),
        );
        expect(newPlaceEntity.placeData.location).toBe('平塚');
    });

    it('何も変更せずKeirinPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseKeirinPlaceEntity;
        const newPlaceEntity = placeEntity.copy();

        expect(newPlaceEntity.id).toEqual(placeEntity.id);
        expect(newPlaceEntity.placeData).toBe(placeEntity.placeData);
    });

    it('何も変更せずKeirinPlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseKeirinPlaceEntity;
        const placeData = placeEntity.toDomainData();

        expect(placeData).toEqual(baseKeirinPlaceData);
    });
});
