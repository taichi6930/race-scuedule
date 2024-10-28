import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { JraPlaceData } from '../../domain/jraPlaceData';
import { IJraPlaceDataHtmlGateway } from '../../gateway/interface/iJraPlaceDataHtmlGateway';
import { JraRaceCourse } from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

@injectable()
export class JraPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<JraPlaceData>
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
     * @returns Promise<FetchPlaceListResponse<JraPlaceData>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<JraPlaceData>> {
        const years: Date[] = await this.generateYears(
            request.startDate,
            request.finishDate,
        );
        const promises = years.map((year) =>
            this.fetchYearPlaceDataList(year).then((childPlaceDataList) =>
                childPlaceDataList.filter(
                    (placeData) =>
                        placeData.dateTime >= request.startDate &&
                        placeData.dateTime <= request.finishDate,
                ),
            ),
        );
        const placeDataLists = await Promise.all(promises);
        const placeDataList = placeDataLists.flat();
        return new FetchPlaceListResponse(placeDataList);
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
            `年リストを生成しました: ${years.map((year) => year.toISOString().split('T')[0])}`,
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
    private async fetchYearPlaceDataList(date: Date): Promise<JraPlaceData[]> {
        console.log(`S3から${date.toISOString().split('T')[0]}を取得します`);
        // レース情報を取得
        const htmlText: string =
            await this.jraPlaceDataHtmlGateway.getPlaceDataHtml(date);

        const $ = cheerio.load(htmlText);

        const jraPlaceDataList: JraPlaceData[] = [];

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

        // 競馬場名を取得する関数
        const getPlaceName = (placeInitial: string): JraRaceCourse =>
            placeMap[placeInitial] || null;

        Array.from({ length: 12 }, (_, k) => k + 1).forEach((month) => {
            const monthData = $(`#mon_${month}`);
            Array.from({ length: 31 }, (_, k) => k + 1).forEach((day) => {
                monthData
                    .find(`.d${day}`)
                    .each((index: number, element: cheerio.Element) => {
                        const placeInitial = $(element).find('span').text();
                        const place = getPlaceName(placeInitial);
                        if (!place) return;
                        jraPlaceDataList.push(
                            new JraPlaceData(
                                new Date(date.getFullYear(), month - 1, day),
                                getPlaceName(placeInitial),
                            ),
                        );
                    });
            });
        });
        return jraPlaceDataList;
    }

    /**
     * 競馬場開催データを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerPlaceList(
        request: RegisterPlaceListRequest<JraPlaceData>,
    ): Promise<RegisterPlaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
