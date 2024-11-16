import { NarPlaceData } from '../../../lib/src/domain/narPlaceData';
import { baseNarPlaceData } from '../mock/common/baseData';

describe('NarPlaceDataクラスのテスト', () => {
    it('正しい入力でNarPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseNarPlaceData;

        expect(placeData.dateTime).toEqual(new Date('2024-06-03'));
        expect(placeData.location).toBe('大井');
    });

    it('日付を変更したNarPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseNarPlaceData;
        const newPlaceData = placeData.copy({
            dateTime: new Date('2024-06-04'),
        });

        expect(newPlaceData.dateTime).toEqual(new Date('2024-06-04'));
        expect(newPlaceData.location).toBe('大井');
    });

    it('何も変更せずNarPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = new NarPlaceData(new Date('2024-06-03'), '大井');
        const newPlaceData = placeData.copy();

        expect(newPlaceData).toEqual(placeData);
    });
});
