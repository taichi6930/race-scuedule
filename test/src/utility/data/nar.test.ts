import {
    NarGradeTypeSchema,
    NarRaceCourseSchema,
    NarRaceCourseTypeSchema,
    NarRaceDistanceSchema,
} from '../../../../lib/src/utility/data/nar';

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
            ['東京', 'NARの競馬場ではありません'],
            ['中央', 'NARの競馬場ではありません'],
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

describe('NarGradeTypeSchema', () => {
    it('正しいNarGradeType', () => {
        const validNarGradeType = 'GⅠ';
        const result = NarGradeTypeSchema.safeParse(validNarGradeType);
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validNarGradeType);
        }
    });

    it('不正なNarGradeType', () => {
        const invalidNarGradeTypeAndMessage: [string, string][] = [
            ['GⅣ', 'NARのグレードではありません'],
            ['GⅤ', 'NARのグレードではありません'],
            ['新馬', 'NARのグレードではありません'],
        ];
        invalidNarGradeTypeAndMessage.forEach(([invalidId, message]) => {
            const result = NarGradeTypeSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('NarRaceCourseTypeSchema', () => {
    it('正しいNarRaceCourseType', () => {
        const validNarRaceCourseType = '芝';
        const result = NarRaceCourseTypeSchema.safeParse(
            validNarRaceCourseType,
        );
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validNarRaceCourseType);
        }
    });

    it('不正なNarRaceCourseType', () => {
        const invalidNarRaceCourseTypeAndMessage: [string, string][] = [
            ['テスト', 'NARの馬場種別ではありません'],
            ['サークル', 'NARの馬場種別ではありません'],
        ];
        invalidNarRaceCourseTypeAndMessage.forEach(([invalidId, message]) => {
            const result = NarRaceCourseTypeSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('NarRaceDistanceSchema', () => {
    it('正しいNarRaceDistance', () => {
        const validNarRaceDistance = 2000;
        const result = NarRaceDistanceSchema.safeParse(validNarRaceDistance);
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validNarRaceDistance);
        }
    });

    it('不正なNarRaceDistance', () => {
        const invalidNarRaceDistanceAndMessage: [number, string][] = [
            [0, '距離は0よりも大きい必要があります'],
            [-1, '距離は0よりも大きい必要があります'],
        ];
        invalidNarRaceDistanceAndMessage.forEach(([invalidId, message]) => {
            const result = NarRaceDistanceSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});
