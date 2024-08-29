import { JraPlaceData } from '../../src/domain/jraPlaceData';
import { JraRaceCourse } from '../../src/utility/raceSpecificData';

describe('JraPlaceDataクラスのテスト', () => {
    it('正しい入力でJraPlaceDataのインスタンスを作成できることを確認', () => {
        const dateTime = new Date('2024-08-12');
        const location = "東京" as JraRaceCourse;

        const placeData = new JraPlaceData(dateTime, location);

        expect(placeData.dateTime).toEqual(dateTime);
        expect(placeData.location).toBe(location);
    });
});