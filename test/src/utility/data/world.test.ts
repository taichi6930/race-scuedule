import { WorldRaceCourseSchema } from '../../../../lib/src/utility/data/world';

describe('WorldRaceCourseSchema', () => {
    it('正しいWorldRaceCourse', () => {
        const validWorldRaceCourse = 'ロンシャン';
        const result = WorldRaceCourseSchema.safeParse(validWorldRaceCourse);
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validWorldRaceCourse);
        }
    });

    it('不正なWorldRaceCourse', () => {
        const invalidWorldRaceCourseAndMessage: [string, string][] = [
            ['東京', '世界の競馬場ではありません'],
            ['中央', '世界の競馬場ではありません'],
        ];
        invalidWorldRaceCourseAndMessage.forEach(([invalidId, message]) => {
            const result = WorldRaceCourseSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});
