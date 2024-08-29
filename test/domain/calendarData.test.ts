import { CalendarData } from '../../src/domain/calendarData';

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
    // 他のバリデーションテストを追加することも可能です
});
