import { baseAutoraceRaceRecord } from '../../mock/common/baseData';

describe('AutoraceRaceRecordクラスのテスト', () => {
    it('正しい入力でAutoraceRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseAutoraceRaceRecord;

        expect(raceRecord.id).toEqual('autorace202412310511');
        expect(raceRecord.name).toBe('スーパースター王座決定戦');
        expect(raceRecord.dateTime).toEqual(new Date('2024-12-31 16:30'));
        expect(raceRecord.stage).toBe('優勝戦');
        expect(raceRecord.location).toBe('飯塚');
        expect(raceRecord.grade).toBe('SG');
        expect(raceRecord.number).toBe(11);
    });

    it('日付を変更したAutoraceRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseAutoraceRaceRecord;
        const newRaceRecord = raceRecord.copy({
            dateTime: new Date('2022-12-30'),
        });
        expect(newRaceRecord.id).toEqual('autorace202412310511');
        expect(newRaceRecord.name).toBe('スーパースター王座決定戦');
        expect(newRaceRecord.dateTime).toEqual(new Date('2022-12-30 00:00'));
        expect(newRaceRecord.stage).toBe('優勝戦');
        expect(newRaceRecord.location).toBe('飯塚');
        expect(newRaceRecord.grade).toBe('SG');
        expect(newRaceRecord.number).toBe(11);
    });

    it('何も変更せずAutoraceRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseAutoraceRaceRecord;
        const newRaceRecord = raceRecord.copy();

        expect(newRaceRecord).toEqual(raceRecord);
    });
});
