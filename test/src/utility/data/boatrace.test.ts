import {
    BoatraceGradeTypeSchema,
    BoatraceRaceCourseSchema,
    BoatraceRaceStageSchema,
} from '../../../../lib/src/utility/data/boatrace';

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

describe('BoatraceGradeTypeSchema', () => {
    it('正しいBoatraceGradeType', () => {
        const validBoatraceGradeType = 'GⅠ';
        const result = BoatraceGradeTypeSchema.safeParse(
            validBoatraceGradeType,
        );
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validBoatraceGradeType);
        }
    });

    it('不正なBoatraceGradeType', () => {
        const invalidBoatraceGradeTypeAndMessage: [string, string][] = [
            ['GⅣ', 'ボートレースのグレードではありません'],
            ['GⅤ', 'ボートレースのグレードではありません'],
            ['新馬', 'ボートレースのグレードではありません'],
        ];
        invalidBoatraceGradeTypeAndMessage.forEach(([invalidId, message]) => {
            const result = BoatraceGradeTypeSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('BoatraceRaceStageSchema', () => {
    it('正しいBoatraceRaceStage', () => {
        const validBoatraceRaceStage = '優勝戦';
        const result = BoatraceRaceStageSchema.safeParse(
            validBoatraceRaceStage,
        );
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validBoatraceRaceStage);
        }
    });

    it('不正なBoatraceRaceStage', () => {
        const invalidBoatraceRaceStageAndMessage: [string, string][] = [
            ['東京', 'ボートレースのステージではありません'],
            ['中央', 'ボートレースのステージではありません'],
        ];
        invalidBoatraceRaceStageAndMessage.forEach(([invalidId, message]) => {
            const result = BoatraceRaceStageSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});
