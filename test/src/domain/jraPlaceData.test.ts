import { JraPlaceData } from '../../../lib/src/domain/jraPlaceData';

describe('JraPlaceDataクラスのテスト', () => {
    it('正しい入力でJraPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = new JraPlaceData(
            new Date('2024-05-26'),
            "東京",
        );

        expect(placeData.dateTime).toEqual(new Date('2024-05-26'));
        expect(placeData.location).toBe("東京");
    });

    it('日付を変更したNarPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = new JraPlaceData(
            new Date('2024-05-26'),
            "東京",
        );
        const newPlaceData = placeData.copy({ dateTime: new Date('2024-06-04') });

        expect(newPlaceData.dateTime).toEqual(new Date('2024-06-04'));
        expect(newPlaceData.location).toBe("東京");
    });

    it('何も変更せずJraPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = new JraPlaceData(
            new Date('2024-05-26'),
            "東京",
        );
        const newPlaceData = placeData.copy();

        expect(newPlaceData).toEqual(placeData);
    });
});