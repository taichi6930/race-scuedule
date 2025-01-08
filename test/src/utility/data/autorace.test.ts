import { AutoraceRaceCourseSchema } from '../../../../lib/src/utility/data/autorace';

describe('AutoraceRaceCourseSchema', () => {
    it('正しいAutoraceRaceCourse', () => {
        const validAutoraceRaceCourse = '川口';
        const result = AutoraceRaceCourseSchema.safeParse(
            validAutoraceRaceCourse,
        );
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validAutoraceRaceCourse);
        }
    });

    it('不正なAutoraceRaceCourse', () => {
        const invalidAutoraceRaceCourseAndMessage: [string, string][] = [
            ['東京', 'オートレース場ではありません'],
            ['中央', 'オートレース場ではありません'],
        ];
        invalidAutoraceRaceCourseAndMessage.forEach(([invalidId, message]) => {
            const result = AutoraceRaceCourseSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});
