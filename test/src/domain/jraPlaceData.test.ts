import { baseJraPlaceData } from '../mock/common/baseJraData';

describe('JraPlaceDataクラスのテスト', () => {
    it('正しい入力でJraPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseJraPlaceData;

        expect(placeData.dateTime).toEqual(new Date('2024-12-22'));
        expect(placeData.location).toBe('中山');
    });

    it('開催回数が1未満の場合エラーが発生することを確認', () => {
        expect(() => {
            baseJraPlaceData.copy({ heldTimes: 0 });
        }).toThrow('開催回数は1以上である必要があります');
    });

    it('開催日数が1未満の場合エラーが発生することを確認', () => {
        expect(() => {
            baseJraPlaceData.copy({ heldDayTimes: 0 });
        }).toThrow('開催日数は1以上である必要があります');
    });

    it('日付を変更したJraPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseJraPlaceData;
        const newPlaceData = placeData.copy({
            dateTime: new Date('2024-06-04'),
        });

        expect(newPlaceData.dateTime).toEqual(new Date('2024-06-04'));
        expect(newPlaceData.location).toBe('中山');
    });

    it('何も変更せずJraPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseJraPlaceData;
        const newPlaceData = placeData.copy();

        expect(newPlaceData).toEqual(placeData);
    });
});
