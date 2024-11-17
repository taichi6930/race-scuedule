import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { IBoatracePlaceDataHtmlGateway } from '../../gateway/interface/iBoatracePlaceDataHtmlGateway';
import {
    BoatraceGradeType,
    BoatraceRaceCourse,
} from '../../utility/data/boatrace';
import { Logger } from '../../utility/logger';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

/**
 * 競馬場データリポジトリの実装
 */
@injectable()
export class BoatracePlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<BoatracePlaceEntity>
{
    constructor(
        @inject('BoatracePlaceDataHtmlGateway')
        private readonly boatracePlaceDataHtmlGateway: IBoatracePlaceDataHtmlGateway,
    ) {}

    /**
     * 競馬場開催データを取得する
     *
     * このメソッドで日付の範囲を指定して競馬場開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<BoatracePlaceEntity>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<BoatracePlaceEntity>> {
        const months: Date[] = await this.generateMonths(
            request.startDate,
            request.finishDate,
        );
        const promises = months.map(async (month) =>
            this.fetchMonthPlaceEntityList(month).then((childPlaceEntityList) =>
                childPlaceEntityList.filter(
                    (PlaceEntity) =>
                        PlaceEntity.placeData.dateTime >= request.startDate &&
                        PlaceEntity.placeData.dateTime <= request.finishDate,
                ),
            ),
        );
        const PlaceEntityLists = await Promise.all(promises);
        const PlaceEntityList = PlaceEntityLists.flat();
        return new FetchPlaceListResponse(PlaceEntityList);
    }

    /**
     * ターゲットの月リストを生成する
     *
     * startDateからfinishDateまでの月のリストを生成する
     *
     * @param startDate
     * @param finishDate
     * @returns
     */
    @Logger
    private generateMonths(startDate: Date, finishDate: Date): Promise<Date[]> {
        console.log('startDate', startDate);
        console.log('finishDate', finishDate);
        const months: Date[] = [];
        let currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1,
            );
            months.push(date);

            // 次の月の1日を取得
            currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1,
            );
        }
        console.log(
            `月リストを生成しました: ${months.map((month) => formatDate(month, 'yyyy-MM-dd')).join(', ')}`,
        );
        return Promise.resolve(months);
    }

    /**
     * S3から競馬場開催データを取得する
     *
     * ファイル名を利用してS3から競馬場開催データを取得する
     * PlaceEntityが存在しない場合はundefinedを返すので、filterで除外する
     *
     * @param date
     * @returns
     */
    @Logger
    private async fetchMonthPlaceEntityList(
        date: Date,
    ): Promise<BoatracePlaceEntity[]> {
        const boatracePlaceEntityList: BoatracePlaceEntity[] = [];
        console.log(`HTMLから${formatDate(date, 'yyyy-MM')}を取得します`);
        // レース情報を取得
        const htmlText: string =
            await this.boatracePlaceDataHtmlGateway.getPlaceDataHtml(date);

        const $ = cheerio.load(htmlText);

        const chartWrapprer = $('#content');

        // tableタグが複数あるので、全て取得
        const tables = chartWrapprer.find('table');

        tables.each((index: number, element: cheerio.Element) => {
            // その中のtbodyを取得
            const tbody = $(element).find('tbody');
            // tr class="ref_sche"を取得
            const trs = tbody.find('tr');
            trs.each((index: number, element: cheerio.Element) => {
                // thを取得
                const th = $(element).find('th');

                // thのテキストが BoatraceRaceCourseに含まれているか
                if (!(th.text() as BoatraceRaceCourse)) {
                    return;
                }
                const place: BoatraceRaceCourse =
                    th.text() as BoatraceRaceCourse;

                const tds = $(element).find('td');
                tds.each((index: number, element: cheerio.Element) => {
                    const imgs = $(element).find('img');
                    let grade: BoatraceGradeType | undefined;
                    imgs.each((_, img) => {
                        const alt = $(img).attr('alt');
                        if (
                            alt !== null &&
                            alt !== undefined &&
                            alt.trim() !== ''
                        ) {
                            grade = alt
                                .replace('1', 'Ⅰ')
                                .replace('2', 'Ⅱ')
                                .replace('3', 'Ⅲ') as BoatraceGradeType;
                        }
                    });

                    // alt属性を出力
                    if (grade) {
                        boatracePlaceEntityList.push(
                            new BoatracePlaceEntity(
                                null,
                                new BoatracePlaceData(
                                    new Date(
                                        date.getFullYear(),
                                        date.getMonth(),
                                        index + 1,
                                    ),
                                    place,
                                    grade,
                                ),
                            ),
                        );
                    }
                });
            });
        });
        console.log('boatracePlaceEntityList:', boatracePlaceEntityList);
        return boatracePlaceEntityList;
    }

    /**
     * 競馬場開催データを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerPlaceList(
        request: RegisterPlaceListRequest<BoatracePlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
