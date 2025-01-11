import {
    KeirinGradeTypeSchema,
    KeirinPlayerNumberSchema,
    KeirinRaceCourseSchema,
    KeirinRaceStageSchema,
} from '../../../../lib/src/utility/data/keirin';

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

describe('KeirinGradeTypeSchema', () => {
    it('正しいKeirinGradeType', () => {
        const validKeirinGradeType = 'GⅠ';
        const result = KeirinGradeTypeSchema.safeParse(validKeirinGradeType);
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validKeirinGradeType);
        }
    });

    it('不正なKeirinGradeType', () => {
        const invalidKeirinGradeTypeAndMessage: [string, string][] = [
            ['GⅣ', '競輪のグレードではありません'],
            ['GⅤ', '競輪のグレードではありません'],
            ['新馬', '競輪のグレードではありません'],
        ];
        invalidKeirinGradeTypeAndMessage.forEach(([invalidId, message]) => {
            const result = KeirinGradeTypeSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('KeirinRaceStageSchema', () => {
    it('正しいKeirinRaceStage', () => {
        const validKeirinRaceStage = 'S級決勝';
        const result = KeirinRaceStageSchema.safeParse(validKeirinRaceStage);
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validKeirinRaceStage);
        }
    });

    it('不正なKeirinRaceStage', () => {
        const invalidKeirinRaceStageAndMessage: [string, string][] = [
            ['東京', '競輪のステージではありません'],
            ['中央', '競輪のステージではありません'],
        ];
        invalidKeirinRaceStageAndMessage.forEach(([invalidId, message]) => {
            const result = KeirinRaceStageSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('KeirinPlayerNumberSchema', () => {
    it('正しいKeirinPlayerNumber', () => {
        const validKeirinPlayerNumber = 1;
        const result = KeirinPlayerNumberSchema.safeParse(
            validKeirinPlayerNumber,
        );
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validKeirinPlayerNumber);
        }
    });

    it('不正なKeirinPlayerNumber', () => {
        const invalidKeirinPlayerNumberAndMessage: [number, string][] = [
            [0, '選手番号は1以上である必要があります'],
            [-2, '選手番号は1以上である必要があります'],
        ];
        invalidKeirinPlayerNumberAndMessage.forEach(([invalidId, message]) => {
            const result = KeirinPlayerNumberSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});
