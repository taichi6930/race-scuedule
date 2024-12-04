import { baseAutoracePlaceRecord } from '../../mock/common/baseAutoraceData';

describe('AutoracePlaceRecordクラスのテスト', () => {
    it('正しい入力でAutoracePlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseAutoracePlaceRecord;

        expect(placeRecord.id).toEqual('autorace2024123105');
        expect(placeRecord.dateTime).toEqual(new Date('2024-12-31'));
        expect(placeRecord.location).toBe('飯塚');
        expect(placeRecord.grade).toBe('SG');
    });

    it('日付を変更したAutoracePlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseAutoracePlaceRecord;
        const newPlaceRecord = placeRecord.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(newPlaceRecord.id).toEqual('autorace2024123105');
        expect(newPlaceRecord.dateTime).toEqual(new Date('2022-12-30'));
        expect(newPlaceRecord.location).toBe('飯塚');
        expect(newPlaceRecord.grade).toBe('SG');
    });

    it('何も変更せずAutoracePlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseAutoracePlaceRecord;
        const newPlaceRecord = placeRecord.copy();

        expect(newPlaceRecord).toEqual(placeRecord);
    });
});
