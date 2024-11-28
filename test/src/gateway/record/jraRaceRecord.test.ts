import { baseJraRaceRecord } from '../../mock/common/baseData';

describe('JraRaceRecordクラスのテスト', () => {
    it('正しい入力でJraRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseJraRaceRecord;

        expect(raceRecord.id).toEqual('jra202412220511');
        expect(raceRecord.name).toBe('有馬記念');
        expect(raceRecord.dateTime).toEqual(new Date('2024-12-22 15:40'));
        expect(raceRecord.location).toBe('中山');
        expect(raceRecord.surfaceType).toBe('芝');
        expect(raceRecord.distance).toBe(2500);
        expect(raceRecord.grade).toBe('GⅠ');
        expect(raceRecord.number).toBe(11);
        expect(raceRecord.heldTimes).toBe(1);
        expect(raceRecord.heldDayTimes).toBe(1);
    });

    it('日付を変更したJraRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseJraRaceRecord;
        const newRaceRecord = raceRecord.copy({
            location: '東京',
        });
        expect(newRaceRecord.id).toEqual('jra202412220511');
        expect(newRaceRecord.name).toBe('有馬記念');
        expect(newRaceRecord.dateTime).toEqual(new Date('2024-12-22 15:40'));
        expect(newRaceRecord.location).toBe('東京');
        expect(newRaceRecord.surfaceType).toBe('芝');
        expect(newRaceRecord.distance).toBe(2500);
        expect(newRaceRecord.grade).toBe('GⅠ');
        expect(newRaceRecord.number).toBe(11);
        expect(newRaceRecord.heldTimes).toBe(1);
        expect(newRaceRecord.heldDayTimes).toBe(1);
    });

    it('何も変更せずJraRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseJraRaceRecord;
        const newRaceRecord = raceRecord.copy();

        expect(newRaceRecord).toEqual(raceRecord);
    });
});
