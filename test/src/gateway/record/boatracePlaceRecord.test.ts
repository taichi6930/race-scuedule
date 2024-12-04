import { baseBoatracePlaceRecord } from '../../mock/common/baseBoatraceData';

describe('BoatracePlaceRecordクラスのテスト', () => {
    it('正しい入力でBoatracePlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseBoatracePlaceRecord;

        expect(placeRecord.dateTime).toEqual(new Date('2024-12-31'));
        expect(placeRecord.location).toBe('平和島');
    });

    it('日付を変更したNarPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseBoatracePlaceRecord;
        const newPlaceRecord = placeRecord.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(newPlaceRecord.dateTime).toEqual(new Date('2022-12-30'));
        expect(newPlaceRecord.location).toBe('平和島');
    });

    it('何も変更せずBoatracePlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseBoatracePlaceRecord;
        const newPlaceRecord = placeRecord.copy();

        expect(newPlaceRecord).toEqual(placeRecord);
    });
});
