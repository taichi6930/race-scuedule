import { baseJraPlaceRecord } from '../../mock/common/baseJraData';

describe('JraPlaceRecordクラスのテスト', () => {
    it('正しい入力でJraPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseJraPlaceRecord;

        expect(placeRecord.id).toEqual('jra2024122206');
        expect(placeRecord.dateTime).toEqual(new Date('2024-12-22'));
        expect(placeRecord.location).toBe('中山');
        expect(placeRecord.heldTimes).toBe(5);
        expect(placeRecord.heldDayTimes).toBe(8);
    });

    it('日付を変更したJraPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseJraPlaceRecord;
        const newPlaceRecord = placeRecord.copy({
            location: '東京',
        });

        expect(newPlaceRecord.id).toEqual('jra2024122206');
        expect(newPlaceRecord.dateTime).toEqual(new Date('2024-12-22'));
        expect(newPlaceRecord.location).toBe('東京');
        expect(newPlaceRecord.heldTimes).toBe(5);
        expect(newPlaceRecord.heldDayTimes).toBe(8);
    });

    it('何も変更せずJraPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseJraPlaceRecord;
        const newPlaceRecord = placeRecord.copy();

        expect(newPlaceRecord).toEqual(placeRecord);
    });
});
