import {
    WorldGradeTypeSchema,
    WorldRaceCourseSchema,
    WorldRaceCourseTypeSchema,
} from '../../../../lib/src/utility/data/world';

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

describe('WorldGradeTypeSchema', () => {
    it('正しいWorldGradeType', () => {
        const validWorldGradeType = 'GⅠ';
        const result = WorldGradeTypeSchema.safeParse(validWorldGradeType);
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validWorldGradeType);
        }
    });

    it('不正なWorldGradeType', () => {
        const invalidWorldGradeTypeAndMessage: [string, string][] = [
            ['GⅣ', '世界の競馬のグレードではありません'],
            ['GⅤ', '世界の競馬のグレードではありません'],
            ['新馬', '世界の競馬のグレードではありません'],
        ];
        invalidWorldGradeTypeAndMessage.forEach(([invalidId, message]) => {
            const result = WorldGradeTypeSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('WorldRaceCourseTypeSchema', () => {
    it('正しいWorldRaceCourseType', () => {
        const validWorldRaceCourseType = '芝';
        const result = WorldRaceCourseTypeSchema.safeParse(
            validWorldRaceCourseType,
        );
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validWorldRaceCourseType);
        }
    });

    it('不正なWorldRaceCourseType', () => {
        const invalidWorldRaceCourseTypeAndMessage: [string, string][] = [
            ['テスト', '世界の競馬の馬場種別ではありません'],
            ['サークル', '世界の競馬の馬場種別ではありません'],
        ];
        invalidWorldRaceCourseTypeAndMessage.forEach(([invalidId, message]) => {
            const result = WorldRaceCourseTypeSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});
