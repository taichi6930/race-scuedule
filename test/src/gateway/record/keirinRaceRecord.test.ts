import { baseKeirinRaceRecord } from '../../mock/common/baseData';

describe('KeirinRaceRecordクラスのテスト', () => {
    it('正しい入力でKeirinRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseKeirinRaceRecord;

        expect(raceRecord.id).toEqual('keirin202412310411');
        expect(raceRecord.name).toBe('KEIRINグランプリ');
        expect(raceRecord.dateTime).toEqual(new Date('2025-12-30 16:30'));
        expect(raceRecord.stage).toBe('グランプリ');
        expect(raceRecord.location).toBe('平塚');
        expect(raceRecord.grade).toBe('GP');
        expect(raceRecord.number).toBe(11);
    });

    it('日付を変更したNarRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseKeirinRaceRecord;
        const newRaceRecord = raceRecord.copy({
            dateTime: new Date('2022-12-30'),
        });
        expect(newRaceRecord.id).toEqual('keirin202412310411');
        expect(newRaceRecord.name).toBe('KEIRINグランプリ');
        expect(newRaceRecord.dateTime).toEqual(new Date('2022-12-30'));
        expect(newRaceRecord.stage).toBe('グランプリ');
        expect(newRaceRecord.location).toBe('平塚');
        expect(newRaceRecord.grade).toBe('GP');
        expect(newRaceRecord.number).toBe(11);
    });

    it('何も変更せずKeirinRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseKeirinRaceRecord;
        const newRaceRecord = raceRecord.copy();

        expect(newRaceRecord).toEqual(raceRecord);
    });
});
