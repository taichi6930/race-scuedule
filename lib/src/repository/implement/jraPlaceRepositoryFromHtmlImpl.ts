import * as cheerio from 'cheerio';
import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { JraPlaceData } from '../../domain/jraPlaceData';
import { IJraPlaceDataHtmlGateway } from '../../gateway/interface/iJraPlaceDataHtmlGateway';
import { JraPlaceRecord } from '../../gateway/record/jraPlaceRecord';
import { JraRaceCourse } from '../../utility/data/jra';
import { NETKEIBA_BABACODE } from '../../utility/data/netkeiba';
import { Logger } from '../../utility/logger';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

@injectable()
export class JraPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<JraPlaceEntity>
{
    constructor(
        @inject('JraPlaceDataHtmlGateway')
        private jraPlaceDataHtmlGateway: IJraPlaceDataHtmlGateway,
    ) {}

    /**
     * 競馬場開催データを取得する
     *
     * このメソッドで日付の範囲を指定して競馬場開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<JraPlaceEntity>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<JraPlaceEntity>> {
        const years: Date[] = await this.generateYears(
            request.startDate,
            request.finishDate,
        );

        // 年ごとの競馬場開催データを取得
        const placeRecords = (
            await Promise.all(
                years.map((year) => this.fetchYearPlaceRecordList(year)),
            )
        ).flat();

        // Entityに変換
        const placeEntityList: JraPlaceEntity[] = placeRecords.map(
            (placeRecord) => {
                return new JraPlaceEntity(
                    placeRecord.id,
                    new JraPlaceData(
                        placeRecord.dateTime,
                        placeRecord.location,
                        placeRecord.heldTimes,
                        placeRecord.heldDayTimes,
                    ),
                );
            },
        );

        // filterで日付の範囲を指定
        const filteredPlaceEntityList = placeEntityList.filter(
            (placeEntity) =>
                placeEntity.placeData.dateTime >= request.startDate &&
                placeEntity.placeData.dateTime <= request.finishDate,
        );

        return new FetchPlaceListResponse(filteredPlaceEntityList);
    }

    /**
     * ターゲットの年リストを生成する
     *
     * startDateからfinishDateまでの年のリストを生成する
     *
     * @param startDate
     * @param finishDate
     * @returns
     */
    @Logger
    private generateYears(startDate: Date, finishDate: Date): Promise<Date[]> {
        const years: Date[] = [];
        let currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            const year = currentDate.getFullYear();
            const date = new Date(year, 0, 1);
            years.push(date);

            // 次の年の1日を取得
            currentDate = new Date(year + 1, 0, 1);
        }
        console.debug(
            `年リストを生成しました: ${years.map((year) => year.toISOString().split('T')[0]).join(', ')}`,
        );
        return Promise.resolve(years);
    }

    /**
     * S3から競馬場開催データを取得する
     *
     * ファイル名を利用してS3から競馬場開催データを取得する
     * placeDataが存在しない場合はundefinedを返すので、filterで除外する
     *
     * @param date
     * @returns
     */
    @Logger
    private async fetchYearPlaceRecordList(
        date: Date,
    ): Promise<JraPlaceRecord[]> {
        console.log(`S3から${date.toISOString().split('T')[0]}を取得します`);
        // レース情報を取得
        const htmlText: string =
            await this.jraPlaceDataHtmlGateway.getPlaceDataHtml(date);

        const $ = cheerio.load(htmlText);

        const jraPlaceRecordList: JraPlaceRecord[] = [];

        // 競馬場のイニシャルと名前のマッピング
        const placeMap: Record<string, JraRaceCourse> = {
            札: '札幌',
            函: '函館',
            福: '福島',
            新: '新潟',
            東: '東京',
            中: '中山',
            名: '中京',
            京: '京都',
            阪: '阪神',
            小: '小倉',
        };

        // 開催日数を計算するためのdict
        // keyは競馬場、valueは「key: 開催回数、value: 開催日数」のdict
        const placeHeldDayTimesCountDict: Record<
            string,
            Record<string, number>
        > = {};

        // 競馬場名を取得する関数
        const getPlaceName = (placeInitial: string): JraRaceCourse =>
            placeMap[placeInitial] || null;

        Array.from({ length: 12 }, (_, k) => k + 1).forEach((month) => {
            const monthData = $(`#mon_${month.toString()}`);
            Array.from({ length: 31 }, (_, k) => k + 1).forEach((day) => {
                monthData
                    .find(`.d${day.toString()}`)
                    .each((index: number, element: cheerio.Element) => {
                        // 開催競馬場のイニシャルを取得
                        const placeInitial = $(element).find('span').text();
                        const place = getPlaceName(placeInitial);
                        if (!place) return;
                        // aタグの中の数字を取得、spanタグの中の文字はいらない
                        const heldTimesInitial = $(element).find('a').text();
                        // 数字のみを取得（3東の形になっているので、placeInitialの分を削除）
                        const heldTimes = parseInt(
                            heldTimesInitial.replace(placeInitial, ''),
                        );
                        // placeCountDictに競馬場が存在しない場合は初期化
                        if (!(place in placeHeldDayTimesCountDict)) {
                            placeHeldDayTimesCountDict[place] = {};
                        }
                        // 開催回数が存在しない場合は初期化
                        if (!(heldTimes in placeHeldDayTimesCountDict[place])) {
                            placeHeldDayTimesCountDict[place][heldTimes] = 0;
                        }
                        // placeCountDict[place][heldTimes]に1を加算
                        placeHeldDayTimesCountDict[place][heldTimes] += 1;
                        // 開催日数を取得
                        const heldDayTimes =
                            placeHeldDayTimesCountDict[place][heldTimes];
                        jraPlaceRecordList.push(
                            new JraPlaceRecord(
                                `jra${format(date, 'yyyyMMdd')}${NETKEIBA_BABACODE[place]}`,
                                new Date(date.getFullYear(), month - 1, day),
                                getPlaceName(placeInitial),
                                heldTimes,
                                heldDayTimes,
                            ),
                        );
                    });
            });
        });
        return jraPlaceRecordList;
    }

    /**
     * 競馬場開催データを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerPlaceList(
        request: RegisterPlaceListRequest<JraPlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
