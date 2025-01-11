import {
    JraGradeTypeSchema,
    JraHeldDayTimesSchema,
    JraHeldTimesSchema,
    JraRaceCourseSchema,
    JraRaceCourseTypeSchema,
    JraRaceDistanceSchema,
} from '../../../../lib/src/utility/data/jra';

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

describe('JraGradeTypeSchema', () => {
    it('正しいJraGradeType', () => {
        const validJraGradeType = 'GⅠ';
        const result = JraGradeTypeSchema.safeParse(validJraGradeType);
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validJraGradeType);
        }
    });

    it('不正なJraGradeType', () => {
        const invalidJraGradeTypeAndMessage: [string, string][] = [
            ['GⅣ', 'JRAのグレードではありません'],
            ['GⅤ', 'JRAのグレードではありません'],
        ];
        invalidJraGradeTypeAndMessage.forEach(([invalidId, message]) => {
            const result = JraGradeTypeSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('JraRaceCourseTypeSchema', () => {
    it('正しいJraRaceCourseType', () => {
        const validJraRaceCourseType = '芝';
        const result = JraRaceCourseTypeSchema.safeParse(
            validJraRaceCourseType,
        );
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validJraRaceCourseType);
        }
    });

    it('不正なJraRaceCourseType', () => {
        const invalidJraRaceCourseTypeAndMessage: [string, string][] = [
            ['テスト', 'JRAの馬場種別ではありません'],
            ['サークル', 'JRAの馬場種別ではありません'],
        ];
        invalidJraRaceCourseTypeAndMessage.forEach(([invalidId, message]) => {
            const result = JraRaceCourseTypeSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('JraRaceDistanceSchema', () => {
    it('正しいJraRaceDistance', () => {
        const validJraRaceDistance = 2000;
        const result = JraRaceDistanceSchema.safeParse(validJraRaceDistance);
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validJraRaceDistance);
        }
    });

    it('不正なJraRaceDistance', () => {
        const invalidJraRaceDistanceAndMessage: [number, string][] = [
            [0, '距離は0よりも大きい必要があります'],
            [-1, '距離は0よりも大きい必要があります'],
        ];
        invalidJraRaceDistanceAndMessage.forEach(([invalidId, message]) => {
            const result = JraRaceDistanceSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('JraHeldTimesSchema', () => {
    it('正しいJraHeldTimes', () => {
        const validJraHeldTimes = 1;
        const result = JraHeldTimesSchema.safeParse(validJraHeldTimes);
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validJraHeldTimes);
        }
    });

    it('不正なJraHeldTimes', () => {
        const invalidJraHeldTimesAndMessage: [number, string][] = [
            [0, '開催回数は1以上である必要があります'],
            [-1, '開催回数は1以上である必要があります'],
        ];
        invalidJraHeldTimesAndMessage.forEach(([invalidId, message]) => {
            const result = JraHeldTimesSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('JraHeldDayTimesSchema', () => {
    it('正しいJraHeldDayTimes', () => {
        const validJraHeldDayTimes = 1;
        const result = JraHeldDayTimesSchema.safeParse(validJraHeldDayTimes);
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validJraHeldDayTimes);
        }
    });

    it('不正なJraHeldDayTimes', () => {
        const invalidJraHeldDayTimesAndMessage: [number, string][] = [
            [0, '開催日数は1以上である必要があります'],
            [-1, '開催日数は1以上である必要があります'],
        ];
        invalidJraHeldDayTimesAndMessage.forEach(([invalidId, message]) => {
            const result = JraHeldDayTimesSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});
