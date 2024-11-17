import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import { BoatraceRacePlayerData } from '../../domain/boatraceRacePlayerData';
import { IBoatraceRaceDataHtmlGateway } from '../../gateway/interface/iBoatraceRaceDataHtmlGateway';
import {
    BOATRACE_STAGE_MAP,
    BoatraceGradeType,
    BoatraceRaceStage,
} from '../../utility/data/boatrace';
import { Logger } from '../../utility/logger';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../entity/boatraceRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class BoatraceRaceRepositoryFromHtmlImpl
    implements IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
{
    constructor(
        @inject('BoatraceRaceDataHtmlGateway')
        private readonly boatraceRaceDataHtmlGateway: IBoatraceRaceDataHtmlGateway,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(
        request: FetchRaceListRequest<BoatracePlaceEntity>,
    ): Promise<FetchRaceListResponse<BoatraceRaceEntity>> {
        const boatraceRaceDataList: BoatraceRaceEntity[] = [];
        const placeList = request.placeDataList;
        if (placeList) {
            for (const place of placeList) {
                boatraceRaceDataList.push(
                    ...(await this.fetchRaceListFromHtmlWithBoatracePlace(
                        place.placeData,
                    )),
                );
                console.debug('0.8秒待ちます');
                await new Promise((resolve) => setTimeout(resolve, 800));
                console.debug('0.8秒経ちました');
            }
        }
        return new FetchRaceListResponse(boatraceRaceDataList);
    }

    @Logger
    async fetchRaceListFromHtmlWithBoatracePlace(
        placeData: BoatracePlaceData,
    ): Promise<BoatraceRaceEntity[]> {
        try {
            const [year, month, day] = [
                placeData.dateTime.getFullYear(),
                placeData.dateTime.getMonth() + 1,
                placeData.dateTime.getDate(),
            ];
            const htmlText =
                await this.boatraceRaceDataHtmlGateway.getRaceDataHtml(
                    placeData.dateTime,
                    placeData.location,
                );
            const boatraceRaceEntityList: BoatraceRaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            // id="content"を取得
            const content = $('#content');
            const raceName =
                content
                    .find('h2')
                    .text()
                    .split('\n')
                    .filter((name) => name)[1] ??
                `${placeData.location}${placeData.grade}`;
            // class="section1"を取得
            const section1 = content.find('.section1');
            console.log(
                `raceInfo: ${year.toString()}/${month.toXDigits(2)}/${day.toXDigits(2)} ${placeData.location} ${placeData.grade} ${raceName}`,
            );
            section1.each((index, element) => {
                // class="w480px"を取得
                $(element)
                    .find('.w480px')
                    .each((index, element) => {
                        // 発走時間の取得 10: 50
                        const raceTime = $(element)
                            .find('.tx_blue')
                            .next()
                            .text()
                            .trim();
                        const [hour, minute] = raceTime.split(':').map(Number);
                        // レースナンバーの取得 aタグの中にある 第11R の11
                        // 第 と R の間にある
                        const raceNumber = /第(\d+)R/.exec(
                            $(element).find('a').text(),
                        )?.[1];
                        const raceStage = this.extractRaceStage(
                            $(element).text(),
                        );
                        const raceGrade = this.extractRaceGrade(
                            placeData.grade,
                        );
                        const racePlayerDataList: BoatraceRacePlayerData[] = [];
                        // tableを取得
                        const table = $(element).find('table');
                        // class="bg-1-pl", "bg-2-pl"..."bg-9-pl"を取得
                        Array.from({ length: 9 }, (_, i) => i + 1) // 1から9までの配列を作成
                            .map((i) => {
                                const className = `bg-${i.toString()}-pl`;
                                // class="bg-1-pl"を取得
                                const tableRow = table.find(`.${className}`);
                                // class="bg-1-pl"の中にあるtdを取得
                                // <td class="no1">1</td>のような形なので、"no${i}"の中のテキストを取得、枠番になる
                                const frameNumber = tableRow
                                    .find(`.no${i.toString()}`)
                                    .text();
                                // <td class="al-left"><a href="./PlayerDetail.do?playerCd=015480">松本秀之介</a></td>
                                // 015480が選手の登録番号なので、これを取得
                                // "./PlayerDetail.do?playerCd=015480"のような形になっているので、parseして取得
                                const playerNumber =
                                    tableRow
                                        .find('.al-left')
                                        .find('a')
                                        .attr('href')
                                        ?.split('=')[1] ?? null;
                                if (frameNumber && playerNumber !== null) {
                                    racePlayerDataList.push(
                                        new BoatraceRacePlayerData(
                                            Number(frameNumber),
                                            Number(playerNumber),
                                        ),
                                    );
                                }
                            });
                        const boatraceRaceData =
                            raceStage !== null &&
                            raceStage !== undefined &&
                            raceStage.trim() !== ''
                                ? new BoatraceRaceData(
                                      raceName,
                                      raceStage,
                                      new Date(
                                          year,
                                          month - 1,
                                          day,
                                          hour,
                                          minute,
                                      ),
                                      placeData.location,
                                      raceGrade,
                                      Number(raceNumber),
                                  )
                                : null;
                        if (
                            boatraceRaceData != null &&
                            racePlayerDataList.length !== 0
                        ) {
                            boatraceRaceEntityList.push(
                                new BoatraceRaceEntity(
                                    null,
                                    boatraceRaceData,
                                    racePlayerDataList,
                                ),
                            );
                        }
                    });
            });
            return boatraceRaceEntityList;
        } catch (e) {
            console.error('htmlを取得できませんでした', e);
            return [];
        }
    }
    private extractRaceStage(
        raceSummaryInfoChild: string,
    ): BoatraceRaceStage | null {
        for (const [pattern, stage] of Object.entries(BOATRACE_STAGE_MAP)) {
            if (new RegExp(pattern).exec(raceSummaryInfoChild)) {
                return stage;
            }
        }
        return null;
    }

    private extractRaceGrade(raceGrade: BoatraceGradeType): BoatraceGradeType {
        return raceGrade;
    }
    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerRaceList(
        request: RegisterRaceListRequest<BoatraceRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
