import { KeirinPlaceData } from '../../../lib/src/domain/keirinPlaceData';
import { baseKeirinPlaceData } from '../mock/common/baseData';

describe('KeirinPlaceDataクラスのテスト', () => {
    it('正しい入力でKeirinPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseKeirinPlaceData;

        expect(placeData.dateTime).toEqual(new Date('2025-12-30'));
        expect(placeData.location).toBe('平塚');
    });

    it('日付を変更したNarPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = new KeirinPlaceData(
            new Date('2025-12-30'),
            '平塚',
            'GⅠ',
        );
        const newPlaceData = placeData.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(newPlaceData.dateTime).toEqual(new Date('2022-12-30'));
        expect(newPlaceData.location).toBe('平塚');
    });

    it('何も変更せずKeirinPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = new KeirinPlaceData(
            new Date('2025-12-30'),
            '平塚',
            'GⅠ',
        );
        const newPlaceData = placeData.copy();

        expect(newPlaceData).toEqual(placeData);
    });
});
