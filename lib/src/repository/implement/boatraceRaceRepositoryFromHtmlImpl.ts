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
            // id="comheader"を取得
            const comHeader = $('#comheader');
            // class="raceDesc__titleText"を取得
            const raceDescTitleText = comHeader.find('.raceDesc__titleText');

            // id="racelisttable"を取得
            const raceListTable = $('#racelisttable');
            // id="r1"からid="r12"までを取得
            for (let i = 1; i <= 12; i++) {
                const raceSummaryInfo = $(raceListTable).find(
                    `#r${i.toString()}`,
                );
                // レースが存在しない場合は処理を終了
                if (raceSummaryInfo.length === 0) {
                    console.debug('レースが存在しません');
                    break;
                }
                // raceStageはclass="raceType__subTitle"のtext
                const raceStageString = raceSummaryInfo
                    .find('.raceType__subTitle')
                    .text();
                const raceStage = raceStageString as BoatraceRaceStage;

                const raceName = this.extractRaceName(
                    raceDescTitleText.text(),
                    raceStage,
                    i,
                );

                const raceGrade = this.extractRaceGrade(
                    raceName,
                    placeData.grade,
                );

                // <p id="deadLine" class="txt_disable">締切予定時刻 20:40</p>から締切予定時刻を取得
                const deadLine = raceSummaryInfo.find('#deadLine').text();
                // 「締切予定時刻 20:40」の20:40をhourとminuteを取得
                const [hourString, minuteString] = deadLine
                    .split(' ')[1]
                    .split(':');
                const hour = parseInt(hourString);
                const minute = parseInt(minuteString);

                const racePlayerDataList: BoatraceRacePlayerData[] = [];
                for (let j = 1; j <= 6; j++) {
                    const playerNumberElement = $(raceSummaryInfo)
                        .find(`#racername${j.toString()}`)
                        .find('a');

                    const playerNumber = parseInt(
                        playerNumberElement.attr('href')?.split('=')[1] ?? '',
                    );

                    if (!playerNumber) {
                        console.error('選手番号が取得できませんでした');
                        continue;
                    }

                    racePlayerDataList.push(
                        new BoatraceRacePlayerData(j, playerNumber),
                    );
                }

                boatraceRaceEntityList.push(
                    new BoatraceRaceEntity(
                        null,
                        new BoatraceRaceData(
                            raceName,
                            raceStage,
                            new Date(year, month - 1, day, hour, minute),
                            placeData.location,
                            raceGrade,
                            i,
                        ),
                        racePlayerDataList,
                    ),
                );
            }

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

    private extractRaceName(
        raceName: string,
        raceStage: BoatraceRaceStage,
        raceNumber: number,
    ): string {
        // レース名に「チャレンジカップ」が含まれている場合で、
        // レースステージが「優勝戦」、
        // レース番号が12の場合は「チャレンジカップ」とする
        if (
            raceName.includes('チャレンジカップ') &&
            raceStage === '優勝戦' &&
            raceNumber === 12
        ) {
            return 'チャレンジカップ';
        }
        // 11レースの場合は「レディースチャレンジカップ」
        if (
            raceName.includes('チャレンジカップ') &&
            raceStage === '優勝戦' &&
            raceNumber === 11
        ) {
            return 'レディースチャレンジカップ';
        }
        return raceName;
    }

    private extractRaceGrade(
        raceName: string,
        raceGrade: BoatraceGradeType,
    ): BoatraceGradeType {
        // レース名に「レディースチャレンジカップ」が含まれている場合は「GⅡ」
        if (raceName.includes('レディースチャレンジカップ')) {
            return 'GⅡ';
        }
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
