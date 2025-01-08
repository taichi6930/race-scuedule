import { NarRaceCourseSchema } from '../../../../lib/src/utility/data/nar';

describe('NarRaceCourseSchema', () => {
    it('正しいNarRaceCourse', () => {
        const validNarRaceCourse = '大井';
        const result = NarRaceCourseSchema.safeParse(validNarRaceCourse);
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validNarRaceCourse);
        }
    });

    it('不正なNarRaceCourse', () => {
        const invalidNarRaceCourseAndMessage: [string, string][] = [
            ['東京', 'Narの競馬場ではありません'],
            ['中央', 'Narの競馬場ではありません'],
        ];
        invalidNarRaceCourseAndMessage.forEach(([invalidId, message]) => {
            const result = NarRaceCourseSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});
