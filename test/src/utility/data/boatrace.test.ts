import { BoatraceRaceCourseSchema } from '../../../../lib/src/utility/data/boatrace';

describe('BoatraceRaceCourseSchema', () => {
    it('正しいBoatraceRaceCourse', () => {
        const validBoatraceRaceCourse = '平和島';
        const result = BoatraceRaceCourseSchema.safeParse(
            validBoatraceRaceCourse,
        );
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validBoatraceRaceCourse);
        }
    });

    it('不正なBoatraceRaceCourse', () => {
        const invalidBoatraceRaceCourseAndMessage: [string, string][] = [
            ['東京', 'ボートレース場ではありません'],
            ['中央', 'ボートレース場ではありません'],
        ];
        invalidBoatraceRaceCourseAndMessage.forEach(([invalidId, message]) => {
            const result = BoatraceRaceCourseSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});
