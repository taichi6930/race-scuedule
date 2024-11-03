import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { IWorldRaceDataHtmlGateway } from '../../gateway/interface/iWorldRaceDataHtmlGateway';
import { Logger } from '../../utility/logger';
import { WorldPlaceEntity } from '../entity/worldPlaceEntity';
import { WorldRaceEntity } from '../entity/worldRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class WorldRaceRepositoryFromHtmlImpl
    implements IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
{
    constructor(
        @inject('WorldRaceDataHtmlGateway')
        private readonly worldRaceDataHtmlGateway: IWorldRaceDataHtmlGateway,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(
        request: FetchRaceListRequest<WorldPlaceEntity>,
    ): Promise<FetchRaceListResponse<WorldRaceEntity>> {
        const months: Date[] = await this.generateMonths(
            request.startDate,
            request.finishDate,
        );
        const worldRaceDataList: WorldRaceEntity[] = [];
        for (const month of months) {
            worldRaceDataList.push(
                ...(await this.fetchRaceListFromHtml(month)),
            );
            console.debug('1秒待ちます');
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.debug('1秒経ちました');
        }
        return new FetchRaceListResponse(worldRaceDataList);
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
        console.debug(
            `月リストを生成しました: ${formatDate(currentDate, 'yyyy-MM-dd')}`,
        );
        return Promise.resolve(months);
    }

    @Logger
    async fetchRaceListFromHtml(date: Date): Promise<WorldRaceEntity[]> {
        try {
            const htmlText =
                await this.worldRaceDataHtmlGateway.getRaceDataHtml(date);
            const worldRaceDataList: WorldRaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            const content = $('.racelist');
            // class="racelist__day"が複数あるのでeachで回す
            content.find('.racelist__day').each((index, element) => {
                // class="un-trigger"があればskipする
                if ($(element).find('.un-trigger').length > 0) {
                    return;
                }
                const dayElement = $(element);
                const dataTarget = dayElement.attr('data-target'); // data-target属性を取得
                const [year, month, day] = [
                    dataTarget?.slice(0, 4),
                    dataTarget?.slice(4, 6),
                    dataTarget?.slice(6, 8),
                ].map(Number);
                console.log('start---------');
                console.log(index, dataTarget);
                console.log('end---------');
                /*
                <div class="racelist__day" data-target="20241011">
                    <div class="trigger">11日（金）</div>
                    <div class="body">
                        <div class="racelist__race">
                            <a href="/schedule/result/R1013225/" class="racelist__race__info">
                                <p class="racelist__race__sub">
                                    <span class="flags flag_bri"></span>
                                    <span class="course">ニューマーケット</span>
                                    /
                                    <span class="type">芝1600m</span>
                                    /
                                    <span class="time">23:36発走</span>
                                </p>
                                <h3 class="racelist__race__title">
                                    <span class="name">フィリーズマイル</span>
                                    <span class="grade _g1"><span>G1</span></span>
                                </h3>
                                <p class="racelist__race__tag">
                                    <span class="item _video active"><i class="fas fa-play-circle"></i>動画</span>
                                    <span class="item _photo"><i class="fas fa-camera"></i>フォト</span>
                                    <span class="item _news active"><i class="far fa-newspaper"></i>ニュース</span>
                                    <span class="item _special"><i class="fas fa-horse-head"></i>特集</span>
                                </p>
                            </a>
                        </div>
                    </div>
                </div>
                */
                $(dayElement)
                    .find('.racelist__race')
                    .each((_, raceElement) => {
                        const raceName = $(raceElement)
                            .find('.racelist__race__title')
                            .find('.name')
                            .text();
                        worldRaceDataList.push(
                            new WorldRaceEntity(
                                null,
                                raceName,
                                new Date(year, month - 1, day),
                                'ロンシャン',
                                '芝',
                                2400,
                                'GⅠ',
                                12,
                            ),
                        );
                    });
            });
            return worldRaceDataList;
        } catch (e) {
            console.error('htmlを取得できませんでした', e);
            return [];
        }
    }
    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerRaceList(
        request: RegisterRaceListRequest<WorldRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
