/**
 * 日付をフォーマットする
 * @param date
 * @returns
 */
export const formatDate = (date: Date) => {
    return date.toISOString().replace('Z', '+09:00');
};