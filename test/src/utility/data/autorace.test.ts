import { AutoraceGradeTypeSchema } from '../../../../lib/src/utility/data/autorace/autoraceGradeType';
import { AutoracePlayerNumberSchema } from '../../../../lib/src/utility/data/autorace/autoracePlayerNumber';
import { AutoraceRaceCourseSchema } from '../../../../lib/src/utility/data/autorace/autoraceRaceCourse';
import { AutoraceRaceStageSchema } from '../../../../lib/src/utility/data/autorace/autoraceRaceStage';

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

describe('AutoraceGradeTypeSchema', () => {
    it('正しいAutoraceGradeType', () => {
        const validAutoraceGradeType = 'GⅠ';
        const result = AutoraceGradeTypeSchema.safeParse(
            validAutoraceGradeType,
        );
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validAutoraceGradeType);
        }
    });

    it('不正なAutoraceGradeType', () => {
        const invalidAutoraceGradeTypeAndMessage: [string, string][] = [
            ['GⅣ', 'オートレースのグレードではありません'],
            ['GⅤ', 'オートレースのグレードではありません'],
            ['新馬', 'オートレースのグレードではありません'],
        ];
        invalidAutoraceGradeTypeAndMessage.forEach(([invalidId, message]) => {
            const result = AutoraceGradeTypeSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('AutoraceRaceStageSchema', () => {
    it('正しいAutoraceRaceStage', () => {
        const validAutoraceRaceStage = '優勝戦';
        const result = AutoraceRaceStageSchema.safeParse(
            validAutoraceRaceStage,
        );
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validAutoraceRaceStage);
        }
    });

    it('不正なAutoraceRaceStage', () => {
        const invalidAutoraceRaceStageAndMessage: [string, string][] = [
            ['東京', 'オートレースのステージではありません'],
            ['中央', 'オートレースのステージではありません'],
        ];
        invalidAutoraceRaceStageAndMessage.forEach(([invalidId, message]) => {
            const result = AutoraceRaceStageSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('AutoracePlayerNumberSchema', () => {
    it('正しいAutoracePlayerNumber', () => {
        const validAutoracePlayerNumber = 1;
        const result = AutoracePlayerNumberSchema.safeParse(
            validAutoracePlayerNumber,
        );
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(validAutoracePlayerNumber);
        }
    });

    it('不正なAutoracePlayerNumber', () => {
        const invalidAutoracePlayerNumberAndMessage: [number, string][] = [
            [0, '選手番号は1以上である必要があります'],
            [-2, '選手番号は1以上である必要があります'],
        ];
        invalidAutoracePlayerNumberAndMessage.forEach(
            ([invalidId, message]) => {
                const result = AutoracePlayerNumberSchema.safeParse(invalidId);
                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].message).toBe(message);
                }
            },
        );
    });
});
