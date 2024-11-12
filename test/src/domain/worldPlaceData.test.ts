import { WorldPlaceData } from '../../../lib/src/domain/worldPlaceData';

describe('WorldPlaceDataクラスのテスト', () => {
    it('正しい入力でWorldPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = new WorldPlaceData(
            new Date('2024-10-02'),
            'パリロンシャン',
        );

        expect(placeData.dateTime).toEqual(new Date('2024-10-02'));
        expect(placeData.location).toBe('パリロンシャン');
    });

    it('日付を変更したNarPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = new WorldPlaceData(
            new Date('2024-10-02'),
            'パリロンシャン',
        );
        const newPlaceData = placeData.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(newPlaceData.dateTime).toEqual(new Date('2022-12-30'));
        expect(newPlaceData.location).toBe('パリロンシャン');
    });

    it('何も変更せずWorldPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = new WorldPlaceData(
            new Date('2024-10-02'),
            'パリロンシャン',
        );
        const newPlaceData = placeData.copy();

        expect(newPlaceData).toEqual(placeData);
    });
});
