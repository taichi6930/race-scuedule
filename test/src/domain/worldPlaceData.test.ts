import { baseWorldPlaceData } from '../mock/common/baseData';

describe('WorldPlaceDataクラスのテスト', () => {
    it('正しい入力でWorldPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseWorldPlaceData;

        expect(placeData.dateTime).toEqual(new Date('2024-10-01'));
        expect(placeData.location).toBe('パリロンシャン');
    });

    it('日付を変更したWorldPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseWorldPlaceData;
        const newPlaceData = placeData.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(newPlaceData.dateTime).toEqual(new Date('2022-12-30'));
        expect(newPlaceData.location).toBe('パリロンシャン');
    });

    it('何も変更せずWorldPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseWorldPlaceData;
        const newPlaceData = placeData.copy();

        expect(newPlaceData).toEqual(placeData);
    });
});
