import { baseKeirinPlaceRecord } from '../../mock/common/baseData';

describe('KeirinPlaceRecordクラスのテスト', () => {
    it('正しい入力でKeirinPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseKeirinPlaceRecord;

        expect(placeRecord.id).toEqual('keirin2024123104');
        expect(placeRecord.dateTime).toEqual(new Date('2025-12-30'));
        expect(placeRecord.location).toBe('平塚');
        expect(placeRecord.grade).toBe('GP');
    });

    it('日付を変更したNarPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseKeirinPlaceRecord;
        const newPlaceRecord = placeRecord.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(newPlaceRecord.id).toEqual('keirin2024123104');
        expect(newPlaceRecord.dateTime).toEqual(new Date('2022-12-30'));
        expect(newPlaceRecord.location).toBe('平塚');
        expect(newPlaceRecord.grade).toBe('GP');
    });

    it('何も変更せずKeirinPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseKeirinPlaceRecord;
        const newPlaceRecord = placeRecord.copy();

        expect(newPlaceRecord).toEqual(placeRecord);
    });
});
