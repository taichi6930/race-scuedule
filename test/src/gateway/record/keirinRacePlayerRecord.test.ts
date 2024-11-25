import { baseKeirinRacePlayerRecord } from '../../mock/common/baseData';

describe('KeirinRacePlayerRecordクラスのテスト', () => {
    it('正しい入力でKeirinRacePlayerRecordのインスタンスを作成できることを確認', () => {
        const racePlayerRecord = baseKeirinRacePlayerRecord;

        expect(racePlayerRecord.id).toBe(`keirin20241231041101`);
        expect(racePlayerRecord.raceId).toBe(`keirin202412310411`);
        expect(racePlayerRecord.positionNumber).toBe(1);
        expect(racePlayerRecord.playerNumber).toBe(10000);
    });

    it('日付を変更したNarRacePlayerRecordのインスタンスを作成できることを確認', () => {
        const racePlayerRecord = baseKeirinRacePlayerRecord;
        const newRacePlayerRecord = racePlayerRecord.copy({
            positionNumber: 2,
            playerNumber: 10001,
        });
        expect(racePlayerRecord.id).toBe(`keirin20241231041101`);
        expect(racePlayerRecord.raceId).toBe(`keirin202412310411`);
        expect(newRacePlayerRecord.positionNumber).toBe(2);
        expect(newRacePlayerRecord.playerNumber).toBe(10001);
    });

    it('何も変更せずKeirinRacePlayerRecordのインスタンスを作成できることを確認', () => {
        const racePlayerRecord = baseKeirinRacePlayerRecord;
        const newRacePlayerRecord = racePlayerRecord.copy();

        expect(newRacePlayerRecord).toEqual(racePlayerRecord);
    });
});
