import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { NarRaceData } from '../../domain/narRaceData';
import { INarRaceDataHtmlGateway } from '../../gateway/interface/iNarRaceDataHtmlGateway';
import {
    NarGradeType,
    NarRaceCourse,
    NarRaceCourseType,
    NarRaceDistance,
    NarRaceDistanceSchema,
    NarRaceNumber,
    NarRaceNumberSchema,
} from '../../utility/data/nar';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { processNarRaceName } from '../../utility/raceName';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { NarRaceEntity } from '../entity/narRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class NarRaceRepositoryFromHtmlImpl
    implements IRaceRepository<NarRaceEntity, NarPlaceEntity>
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
    async fetchRaceEntityList(
        request: FetchRaceListRequest<NarPlaceEntity>,
    ): Promise<FetchRaceListResponse<NarRaceEntity>> {
        const narRaceDataList: NarRaceEntity[] = [];
        const placeEntityList = request.placeEntityList;
        if (placeEntityList) {
            for (const placeEntity of placeEntityList) {
                narRaceDataList.push(
                    ...(await this.fetchRaceListFromHtmlWithNarPlace(
                        placeEntity,
                    )),
                );
            }
        }
        return new FetchRaceListResponse(narRaceDataList);
    }

    @Logger
    async fetchRaceListFromHtmlWithNarPlace(
        placeEntity: NarPlaceEntity,
    ): Promise<NarRaceEntity[]> {
        try {
            const htmlText = await this.narRaceDataHtmlGateway.getRaceDataHtml(
                placeEntity.placeData.dateTime,
                placeEntity.placeData.location,
            );
            const narRaceDataList: NarRaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            const raceTable = $('section.raceTable');
            const trs = raceTable.find('tr.data');

            Array.from(trs).forEach((tr: cheerio.Element) => {
                const tds = $(tr).find('td');
                try {
                    const distance: NarRaceDistance = this.extractDistance(
                        Array.from(tds).map((td: cheerio.Element) =>
                            $(td).text(),
                        ),
                    );
                    // レースの開催日時を生成
                    const raceDateTime = this.extractRaceDateTime(
                        Array.from(tds).map((td: cheerio.Element) =>
                            $(td).text(),
                        ),
                        placeEntity.placeData.dateTime,
                    );
                    // レースのグレードを生成
                    const grade: NarGradeType = this.extractGrade(
                        Array.from(tds).map((td: cheerio.Element) =>
                            $(td).text(),
                        ),
                    );
                    // レースの馬場の種類を生成
                    const surfaceType: NarRaceCourseType =
                        this.extractSurfaceType(
                            Array.from(tds).map((td: cheerio.Element) =>
                                $(td).text(),
                            ),
                        );
                    const raceName: string = this.extractRaceName(
                        Array.from(tds).map((td: cheerio.Element) =>
                            $(td).text(),
                        ),
                        placeEntity.placeData.location,
                        raceDateTime,
                        surfaceType,
                        distance,
                        grade,
                    );
                    narRaceDataList.push(
                        new NarRaceEntity(
                            null,
                            new NarRaceData(
                                raceName,
                                raceDateTime,
                                placeEntity.placeData.location,
                                surfaceType,
                                distance,
                                grade,
                                this.extractRaceNumber(
                                    Array.from(tds).map((td: cheerio.Element) =>
                                        $(td).text(),
                                    ),
                                ),
                            ),
                            getJSTDate(new Date()),
                        ),
                    );
                } catch (e) {
                    console.error('レースデータを取得できませんでした', e);
                }
            });
            return narRaceDataList;
        } catch (e) {
            console.error('htmlを取得できませんでした', e);
            return [];
        }
    }

    /**
     * レース番号を生成
     * @param
     * @returns
     */
    private extractRaceNumber(race: string[]): NarRaceNumber {
        return NarRaceNumberSchema.parse(
            race
                .map((item) => {
                    const match = /(\d+)[Rr]/.exec(item);
                    return match ? parseInt(match[1]) : 0;
                })
                .find((item) => item !== 0) ?? 0,
        );
    }

    /**
     * レースの距離を生成
     * @param race
     * @returns
     */
    private extractDistance(race: string[]): NarRaceDistance {
        return NarRaceDistanceSchema.parse(
            race
                .map((item) => {
                    const match = /(\d+)m/.exec(item);
                    return match ? parseInt(match[1]) : 0;
                })
                .find((item) => item !== 0) ?? 0,
        );
    }

    /**
     * レースの開催時間を生成
     * @param race
     * @param date
     * @returns
     */
    private extractRaceDateTime(race: string[], date: Date): Date {
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
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hour,
            minute,
        );
    }

    /**
     * レースの馬場の種類を生成
     * @param race
     * @returns
     */
    private extractSurfaceType(race: string[]): NarRaceCourseType {
        const regex = /(芝)[左右直]+[0-9]+m/;
        const trackType = race.find((item) => regex.test(item));
        if (trackType === null || trackType === undefined || trackType === '') {
            return 'ダート';
        }
        return '芝';
    }

    /**
     * レースのグレードを生成
     * @param race
     * @returns
     */
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
                grade = regexMap[regex];
                break;
            }
        }
        return grade || '地方重賞';
    }

    /**
     * レース名を生成
     * @param race
     * @param place
     * @param date
     * @param surfaceType
     * @param distance
     * @param grade
     * @returns
     */
    private extractRaceName(
        race: string[],
        place: NarRaceCourse,
        date: Date,
        surfaceType: NarRaceCourseType,
        distance: NarRaceDistance,
        grade: NarGradeType,
    ): string {
        // 重賞の取得
        const regexList = ['JpnIII', 'JpnII', 'JpnI', 'JpnＩ', 'ＧＩ'];
        let _rowRaceName: string | null = null;
        for (const regex of regexList) {
            for (const item of race) {
                const _raceName = item.match(regex);
                if (_raceName !== null) {
                    _rowRaceName = item.replace(regex, '');
                }
            }
            if (_rowRaceName !== null) {
                break;
            }
        }
        const rowRaceName = (_rowRaceName ?? race[4] ?? '').replace(/\n/g, '');
        return processNarRaceName({
            name: rowRaceName,
            place: place,
            date: date,
            surfaceType: surfaceType,
            distance: distance,
            grade: grade,
        });
    }

    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerRaceEntityList(
        request: RegisterRaceListRequest<NarRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
