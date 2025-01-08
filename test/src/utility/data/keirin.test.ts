import { KeirinRaceCourseSchema } from '../../../../lib/src/utility/data/keirin';

describe('KeirinRaceCourseSchema', () => {
    it('正しいKeirinRaceCourse', () => {
        const validKeirinRaceCourse = '立川';
        const result = KeirinRaceCourseSchema.safeParse(validKeirinRaceCourse);
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validKeirinRaceCourse);
        }
    });

    it('不正なKeirinRaceCourse', () => {
        const invalidKeirinRaceCourseAndMessage: [string, string][] = [
            ['東京', '競輪場ではありません'],
            ['中央', '競輪場ではありません'],
        ];
        invalidKeirinRaceCourseAndMessage.forEach(([invalidId, message]) => {
            const result = KeirinRaceCourseSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});
