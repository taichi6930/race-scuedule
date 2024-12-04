import { baseBoatraceRaceRecord } from '../../mock/common/baseBoatraceData';

describe('BoatraceRaceRecordクラスのテスト', () => {
    it('正しい入力でBoatraceRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseBoatraceRaceRecord;

        expect(raceRecord.id).toEqual('boatrace202412310411');
        expect(raceRecord.name).toBe('グランプリ');
        expect(raceRecord.dateTime).toEqual(new Date('2024-12-31 16:30'));
        expect(raceRecord.stage).toBe('優勝戦');
        expect(raceRecord.location).toBe('平和島');
        expect(raceRecord.grade).toBe('SG');
        expect(raceRecord.number).toBe(11);
    });

    it('日付を変更したBoatraceRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseBoatraceRaceRecord;
        const newRaceRecord = raceRecord.copy({
            location: '大村',
        });
        expect(newRaceRecord.id).toEqual('boatrace202412310411');
        expect(newRaceRecord.name).toBe('グランプリ');
        expect(newRaceRecord.dateTime).toEqual(new Date('2024-12-31 16:30'));
        expect(newRaceRecord.stage).toBe('優勝戦');
        expect(newRaceRecord.location).toBe('大村');
        expect(newRaceRecord.grade).toBe('SG');
        expect(newRaceRecord.number).toBe(11);
    });

    it('何も変更せずBoatraceRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseBoatraceRaceRecord;
        const newRaceRecord = raceRecord.copy();

        expect(newRaceRecord).toEqual(raceRecord);
    });
});
