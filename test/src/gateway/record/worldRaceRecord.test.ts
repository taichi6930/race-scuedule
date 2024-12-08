import {
    baseWorldRaceEntity,
    baseWorldRaceRecord,
} from '../../mock/common/baseWorldData';

describe('WorldRaceRecordクラスのテスト', () => {
    it('正しい入力でWorldRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseWorldRaceRecord;
        expect(raceRecord.id).toEqual('world20241001longchamp11');
        expect(raceRecord.name).toBe('凱旋門賞');
        expect(raceRecord.dateTime).toEqual(new Date('2024-10-01 16:30'));
        expect(raceRecord.location).toBe('パリロンシャン');
        expect(raceRecord.surfaceType).toBe('芝');
        expect(raceRecord.distance).toBe(2400);
        expect(raceRecord.grade).toBe('GⅠ');
        expect(raceRecord.number).toBe(11);
    });

    it('日付を変更したWorldRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseWorldRaceRecord;
        const newRaceRecord = raceRecord.copy({
            location: 'シャティン',
        });

        expect(newRaceRecord.id).toEqual('world20241001longchamp11');
        expect(newRaceRecord.name).toBe('凱旋門賞');
        expect(newRaceRecord.dateTime).toEqual(new Date('2024-10-01 16:30'));
        expect(newRaceRecord.location).toBe('シャティン');
        expect(newRaceRecord.surfaceType).toBe('芝');
        expect(newRaceRecord.distance).toBe(2400);
        expect(newRaceRecord.grade).toBe('GⅠ');
        expect(newRaceRecord.number).toBe(11);
    });

    it('何も変更せずWorldRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseWorldRaceRecord;
        const newRaceRecord = raceRecord.copy();

        expect(newRaceRecord).toEqual(raceRecord);
    });

    it('WorldRaceEntityに変換できることを確認', () => {
        const raceRecord = baseWorldRaceRecord;
        const raceEntity = raceRecord.toEntity();

        expect(raceEntity).toEqual(baseWorldRaceEntity);
    });
});
