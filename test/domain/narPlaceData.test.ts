import { NarPlaceData } from '../../src/domain/narPlaceData';
import { NarRaceCourse } from '../../src/utility/raceSpecificData';

describe('NarPlaceDataクラスのテスト', () => {
    it('正しい入力でNarPlaceDataのインスタンスを作成できることを確認', () => {
        const dateTime = new Date('2024-08-12');
        const location = "大井" as NarRaceCourse;

        const placeData = new NarPlaceData(dateTime, location);

        expect(placeData.dateTime).toEqual(dateTime);
        expect(placeData.location).toBe(location);
    });
});