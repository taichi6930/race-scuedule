import { CalendarData } from '../../../lib/src/domain/calendarData';

describe('CalendarDataクラスのテスト', () => {

    it('正しい入力でCalendarDataのインスタンスを作成できることを確認', () => {
        const calendarData = new CalendarData(
            'event1',
            'イベントタイトル',
            new Date('2024-08-12T09:00:00'),
            new Date('2024-08-12T10:00:00'),
            '東京',
            'イベントの説明'
        );

        expect(calendarData.id).toBe('event1');
        expect(calendarData.title).toBe('イベントタイトル');
        expect(calendarData.startTime).toEqual(new Date('2024-08-12T09:00:00'));
        expect(calendarData.endTime).toEqual(new Date('2024-08-12T10:00:00'));
        expect(calendarData.location).toBe('東京');
        expect(calendarData.description).toBe('イベントの説明');
    });

    it('copyメソッドが正常に動作することを確認', () => {
        const calendarData = new CalendarData(
            'event1',
            'イベントタイトル',
            new Date('2024-08-12T09:00:00'),
            new Date('2024-08-12T10:00:00'),
            '東京',
            'イベントの説明'
        );

        const copiedCalendarData = calendarData.copy({
            title: 'イベントタイトル（コピー）',
        });
        expect(copiedCalendarData.id).toBe('event1');
        expect(copiedCalendarData.title).toBe('イベントタイトル（コピー）');
        expect(copiedCalendarData.startTime).toEqual(new Date('2024-08-12T09:00:00'));
        expect(copiedCalendarData.endTime).toEqual(new Date('2024-08-12T10:00:00'));
        expect(copiedCalendarData.location).toBe('東京');
        expect(copiedCalendarData.description).toBe('イベントの説明');
    });
});
