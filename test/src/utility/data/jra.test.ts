import { JraRaceCourseSchema } from '../../../../lib/src/utility/data/jra';

describe('JraRaceCourseSchema', () => {
    it('正しいJraRaceCourse', () => {
        const validJraRaceCourse = '中山';
        const result = JraRaceCourseSchema.safeParse(validJraRaceCourse);
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validJraRaceCourse);
        }
    });

    it('不正なJraRaceCourse', () => {
        const invalidJraRaceCourseAndMessage: [string, string][] = [
            ['大井', 'Jraの競馬場ではありません'],
            ['中央', 'Jraの競馬場ではありません'],
        ];
        invalidJraRaceCourseAndMessage.forEach(([invalidId, message]) => {
            const result = JraRaceCourseSchema.safeParse(invalidId);
            expect(result.success).toBe(false);

            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});
