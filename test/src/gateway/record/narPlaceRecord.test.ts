import { baseNarPlaceRecord } from '../../mock/common/baseData';

describe('NarPlaceRecordクラスのテスト', () => {
    it('正しい入力でNarPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseNarPlaceRecord;

        expect(placeRecord.id).toEqual('nar2024123144');
        expect(placeRecord.dateTime).toEqual(new Date('2024-12-31'));
        expect(placeRecord.location).toBe('大井');
    });

    it('日付を変更したNarPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseNarPlaceRecord;
        const newPlaceRecord = placeRecord.copy({
            location: '川崎',
        });

        expect(newPlaceRecord.id).toEqual('nar2024123144');
        expect(newPlaceRecord.dateTime).toEqual(new Date('2024-12-31'));
        expect(newPlaceRecord.location).toBe('川崎');
    });

    it('何も変更せずNarPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseNarPlaceRecord;
        const newPlaceRecord = placeRecord.copy();

        expect(newPlaceRecord).toEqual(placeRecord);
    });
});
