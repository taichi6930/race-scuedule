import z from 'zod';

/**
 * WorldRaceCourseTypeのzod型定義
 */
export const WorldRaceCourseTypeSchema = z.string().refine((value) => {
    return WorldRaceCourseTypeList.includes(value);
}, '海外競馬の馬場種別ではありません');

/**
 * WorldRaceCourseTypeの型定義
 */
export type WorldRaceCourseType = z.infer<typeof WorldRaceCourseTypeSchema>;

/**
 * 海外競馬の馬場種別 リスト
 */
const WorldRaceCourseTypeList: string[] = ['芝', 'ダート', '障害', 'AW'];

/**
 * 海外競馬の馬場種別のバリデーション
 * @param type - 海外競馬の馬場種別
 * @returns - バリデーション済みの海外競馬の馬場種別
 */
export const validateWorldRaceCourseType = (
    type: string,
): WorldRaceCourseType => {
    const result = WorldRaceCourseTypeSchema.safeParse(type);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
