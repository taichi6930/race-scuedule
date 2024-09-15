import { injectable, inject } from 'tsyringe';
import { Logger } from '../../utility/logger';
import { IRaceRepository } from '../interface/IRaceRepository';
import { NarPlaceData } from '../../domain/narPlaceData';
import { NarRaceData } from '../../domain/narRaceData';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';
import {
    NarRaceCourseType,
    NarGradeType,
} from '../../utility/data/raceSpecific';
import { processNarRaceName } from '../../utility/raceName';
import { INarRaceDataHtmlGateway } from '../../gateway/interface/iNarRaceDataHtmlGateway';
import * as cheerio from 'cheerio';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class NarRaceRepositoryFromHtmlImpl
    implements IRaceRepository<NarRaceData, NarPlaceData>
{
    constructor(
        @inject('NarRaceDataHtmlGateway')
        private readonly narRaceDataHtmlGateway: INarRaceDataHtmlGateway,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(
        request: FetchRaceListRequest<NarPlaceData>,
    ): Promise<FetchRaceListResponse<NarRaceData>> {
        const narRaceDataList: NarRaceData[] = [];
        const placeList = request.placeDataList;
        if (placeList) {
            for (const place of placeList) {
                narRaceDataList.push(
                    ...(await this.fetchRaceListFromHtmlWithNarPlace(place)),
                );
            }
        }
        return new FetchRaceListResponse(narRaceDataList);
    }

    @Logger
    async fetchRaceListFromHtmlWithNarPlace(
        placeData: NarPlaceData,
    ): Promise<NarRaceData[]> {
        try {
            const [year, month, day] = [
                placeData.dateTime.getFullYear(),
                placeData.dateTime.getMonth() + 1,
                placeData.dateTime.getDate(),
            ];
            const htmlText = await this.narRaceDataHtmlGateway.getRaceDataHtml(
                placeData.dateTime,
                placeData.location,
            );

            if (typeof htmlText !== 'string') {
                throw new Error('Expected htmlText to be a string');
            }

            const narRaceDataList: NarRaceData[] = [];
            const $ = cheerio.load(htmlText);
            const raceTable = $('section.raceTable');
            const trs = raceTable.find('tr.data');

            Array.from(trs).forEach((tr: cheerio.Element) => {
                const tds = $(tr).find('td');
                const distance = this.extractDistance(
                    Array.from(tds).map((td: cheerio.Element) => $(td).text()),
                );
                if (distance <= 0) {
                    return;
                }
                const [hour, minute] = this.extractRaceTime(
                    Array.from(tds).map((td: cheerio.Element) => $(td).text()),
                );
                const raceName = this.extractRaceName(
                    Array.from(tds).map((td: cheerio.Element) => $(td).text()),
                );
                const grade = this.extractGrade(
                    Array.from(tds).map((td: cheerio.Element) => $(td).text()),
                );
                const surfaceType = this.extractSurfaceType(
                    Array.from(tds).map((td: cheerio.Element) => $(td).text()),
                );
                const newRaceName = processNarRaceName({
                    name: raceName,
                    place: placeData.location,
                    date: new Date(year, month - 1, day),
                    surfaceType: surfaceType,
                    distance: distance,
                    grade: grade ?? '一般',
                });
                narRaceDataList.push(
                    new NarRaceData(
                        newRaceName,
                        new Date(year, month - 1, day, hour, minute),
                        placeData.location,
                        surfaceType,
                        distance,
                        grade,
                        this.extractRaceNumber(
                            Array.from(tds).map((td: cheerio.Element) =>
                                $(td).text(),
                            ),
                        ),
                    ),
                );
            });
            return narRaceDataList;
        } catch (e) {
            console.error('htmlを取得できませんでした', e);
            return [];
        }
    }

    private extractRaceNumber(race: string[]): number {
        return (
            race
                .map((item) => {
                    const match = /(\d+)[Rr]/.exec(item);
                    return match ? parseInt(match[1]) : 0;
                })
                .find((item) => item !== 0) ?? 0
        );
    }

    private extractDistance(race: string[]): number {
        return (
            race
                .map((item) => {
                    const match = /(\d+)m/.exec(item);
                    return match ? parseInt(match[1]) : 0;
                })
                .find((item) => item !== 0) ?? 0
        );
    }

    private extractRaceTime(race: string[]): [number, number] {
        const [hour, minute] = (
            race
                .map((item) => {
                    const match = /(\d+):(\d+)/.exec(item);
                    return match ? match[0] : '0:0';
                })
                .find((item) => item !== '0:0') ?? '0:0'
        )
            .split(':')
            .map((item) => parseInt(item));
        return [hour, minute];
    }

    private extractSurfaceType(race: string[]): NarRaceCourseType {
        const regex = /(芝)[左右直]+[0-9]+m/;
        const trackType = race.find((item) => regex.test(item));
        return trackType ? '芝' : 'ダート';
    }

    private extractGrade(race: string[]): NarGradeType {
        let grade: NarGradeType = '一般';
        if (race.includes('準重賞')) {
            return '地方準重賞';
        }
        if (race.includes('重賞')) {
            grade = '地方重賞';
        }
        const regexMap: Record<string, string> = {
            JpnIII: 'JpnⅢ',
            JpnII: 'JpnⅡ',
            JpnI: 'JpnⅠ',
            JpnＩ: 'JpnⅠ',
            ＧＩ: 'GⅠ',
        };
        const regexList = ['JpnIII', 'JpnII', 'JpnI', 'JpnＩ', 'ＧＩ'];
        for (const regex of regexList) {
            if (race.some((item) => item.includes(regex))) {
                grade = regexMap[regex] as NarGradeType;
                break;
            }
        }
        return grade || '地方重賞';
    }

    private extractRaceName(race: string[]): string {
        // 重賞の取得
        const regexList = ['JpnIII', 'JpnII', 'JpnI', 'JpnＩ', 'ＧＩ'];
        let raceName: string | null = null;
        for (const regex of regexList) {
            for (const item of race) {
                const _raceName = item.match(regex);
                if (_raceName !== null) {
                    raceName = item.replace(regex, '');
                }
            }
            if (raceName !== null) {
                break;
            }
        }
        return (raceName ? raceName : race[4]).replace(/\n/g, '');
    }

    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    async registerRaceList(
        request: RegisterRaceListRequest<NarRaceData>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録しません');
    }
}
