import { JraPlaceIdSchema } from '../../../lib/src/utility/raceId';

describe('JraPlaceIdSchema', () => {
    it('should validate a correct JraPlaceId', () => {
        const validId = 'jra2024010110'; // 有効なIDの例
        const result = JraPlaceIdSchema.safeParse(validId);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validId); // 値がそのまま返ることを確認
        }
    });

    it('should invalidate an ID with incorrect prefix', () => {
        const invalidId = 'abc2024010110'; // プレフィックスが誤っている
        const result = JraPlaceIdSchema.safeParse(invalidId);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Invalid input');
        }
    });

    it('should invalidate an ID with less than 8 digits for date', () => {
        const invalidId = 'jra202401110'; // 開催日部分が7桁しかない
        const result = JraPlaceIdSchema.safeParse(invalidId);
        expect(result.success).toBe(false);
    });

    it('should invalidate an ID with less than 2 digits for location', () => {
        const invalidId = 'jra202401011'; // 開催場所部分が1桁しかない
        const result = JraPlaceIdSchema.safeParse(invalidId);
        expect(result.success).toBe(false);
    });

    it('should invalidate an ID with extra characters', () => {
        const invalidId = 'jra202401011099'; // 余分な数字が含まれている
        const result = JraPlaceIdSchema.safeParse(invalidId);
        expect(result.success).toBe(false);
    });

    it('should invalidate an empty string', () => {
        const invalidId = ''; // 空文字列
        const result = JraPlaceIdSchema.safeParse(invalidId);
        expect(result.success).toBe(false);
    });

    it('should invalidate a non-string input', () => {
        const invalidId = 1234567890; // 数値を入力
        const result = JraPlaceIdSchema.safeParse(invalidId);
        expect(result.success).toBe(false);
    });
});
