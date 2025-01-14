import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { NarPlaceData } from '../../domain/narPlaceData';
import { INarPlaceDataHtmlGateway } from '../../gateway/interface/iNarPlaceDataHtmlGateway';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

/**
 * 競馬場データリポジトリの実装
 */
@injectable()
export class NarPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<NarPlaceEntity>
{
    constructor(
        @inject('NarPlaceDataHtmlGateway')
        private readonly narPlaceDataHtmlGateway: INarPlaceDataHtmlGateway,
    ) {}

    /**
     * 競馬場開催データを取得する
     *
     * このメソッドで日付の範囲を指定して競馬場開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<NarPlaceEntity>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceEntityList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<NarPlaceEntity>> {
        const monthList: Date[] = await this.generateMonthList(
            request.startDate,
            request.finishDate,
        );
        const placeEntityList: NarPlaceEntity[] = (
            await Promise.all(
                monthList.map(async (month) =>
                    this.fetchMonthPlaceEntityList(month),
                ),
            )
        ).flat();

        // startDateからfinishDateまでの中でのデータを取得
        const filteredPlaceEntityList: NarPlaceEntity[] =
            placeEntityList.filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= request.startDate &&
                    placeEntity.placeData.dateTime <= request.finishDate,
            );

        return new FetchPlaceListResponse(filteredPlaceEntityList);
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
    private generateMonthList(
        startDate: Date,
        finishDate: Date,
    ): Promise<Date[]> {
        const monthList: Date[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            monthList.push(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            );
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        console.debug(
            `月リストを生成しました: ${monthList.map((month) => formatDate(month, 'yyyy-MM-dd')).join(', ')}`,
        );
        return Promise.resolve(monthList);
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
    private async fetchMonthPlaceEntityList(
        date: Date,
    ): Promise<NarPlaceEntity[]> {
        console.log(`S3から${formatDate(date, 'yyyy-MM')}を取得します`);
        // レース情報を取得
        const htmlText: string =
            await this.narPlaceDataHtmlGateway.getPlaceDataHtml(date);

        const $ = cheerio.load(htmlText);
        // <div class="chartWrapprer">を取得
        const chartWrapprer = $('.chartWrapprer');
        // <div class="chartWrapprer">内のテーブルを取得
        const table = chartWrapprer.find('table');
        // その中のtbodyを取得
        const tbody = table.find('tbody');
        // tbody内のtrたちを取得
        // 1行目のtrはヘッダーとして取得
        // 2行目のtrは曜日
        // ３行目のtr以降はレース情報
        const trs = tbody.find('tr');
        const narPlaceDataDict: Record<string, number[]> = {};

        trs.each((index: number, element: cheerio.Element) => {
            if (index < 2) {
                return;
            }
            const tds = $(element).find('td');
            const place = $(tds[0]).text();
            tds.each((index: number, element: cheerio.Element) => {
                if (index === 0) {
                    if (!(place in narPlaceDataDict)) {
                        narPlaceDataDict[place] = [];
                    }
                    return;
                }
                if (
                    $(element).text().includes('●') ||
                    $(element).text().includes('☆') ||
                    $(element).text().includes('Ｄ')
                ) {
                    narPlaceDataDict[place].push(index);
                }
            });
        });

        const narPlaceDataList: NarPlaceEntity[] = [];
        for (const [place, raceDays] of Object.entries(narPlaceDataDict)) {
            raceDays.forEach((raceDay) => {
                narPlaceDataList.push(
                    new NarPlaceEntity(
                        null,
                        NarPlaceData.create(
                            new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                raceDay,
                            ),
                            place,
                        ),
                        getJSTDate(new Date()),
                    ),
                );
            });
        }
        return narPlaceDataList;
    }

    /**
     * 競馬場開催データを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerPlaceEntityList(
        request: RegisterPlaceListRequest<NarPlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
