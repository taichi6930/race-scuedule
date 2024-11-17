import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KeirinRaceData } from '../../domain/keirinRaceData';
import { IKeirinRaceDataHtmlGateway } from '../../gateway/interface/iKeirinRaceDataHtmlGateway';
import { KEIRIN_STAGE_MAP } from '../../utility/data/keirin';
import { KeirinGradeType, KeirinRaceStage } from '../../utility/data/keirin';
import { Logger } from '../../utility/logger';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../entity/keirinRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class KeirinRaceRepositoryFromHtmlImpl
    implements IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
{
    constructor(
        @inject('KeirinRaceDataHtmlGateway')
        private readonly keirinRaceDataHtmlGateway: IKeirinRaceDataHtmlGateway,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(
        request: FetchRaceListRequest<KeirinPlaceEntity>,
    ): Promise<FetchRaceListResponse<KeirinRaceEntity>> {
        const keirinRaceDataList: KeirinRaceEntity[] = [];
        const placeList = request.placeDataList;
        if (placeList) {
            for (const place of placeList) {
                keirinRaceDataList.push(
                    ...(await this.fetchRaceListFromHtmlWithKeirinPlace(
                        place.placeData,
                    )),
                );
                console.debug('1秒待ちます');
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.debug('1秒経ちました');
            }
        }
        return new FetchRaceListResponse(keirinRaceDataList);
    }

    @Logger
    async fetchRaceListFromHtmlWithKeirinPlace(
        placeData: KeirinPlaceData,
    ): Promise<KeirinRaceEntity[]> {
        try {
            const [year, month, day] = [
                placeData.dateTime.getFullYear(),
                placeData.dateTime.getMonth() + 1,
                placeData.dateTime.getDate(),
            ];
            const htmlText =
                await this.keirinRaceDataHtmlGateway.getRaceDataHtml(
                    placeData.dateTime,
                    placeData.location,
                );
            const keirinRaceDataList: KeirinRaceEntity[] = [];
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
                            raceName,
                            placeData.grade,
                            raceStage ?? '',
                            new Date(year, month - 1, day),
                        );
                        if (
                            raceStage !== null &&
                            raceStage !== undefined &&
                            raceStage.trim() !== ''
                        ) {
                            keirinRaceDataList.push(
                                new KeirinRaceEntity(
                                    null,
                                    new KeirinRaceData(
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
                                    ),
                                ),
                            );
                        }
                    });
            });
            return keirinRaceDataList;
        } catch (e) {
            console.error('htmlを取得できませんでした', e);
            return [];
        }
    }
    private extractRaceStage(
        raceSummaryInfoChild: string,
    ): KeirinRaceStage | null {
        for (const [pattern, stage] of Object.entries(KEIRIN_STAGE_MAP)) {
            if (new RegExp(pattern).exec(raceSummaryInfoChild)) {
                return stage;
            }
        }
        return null;
    }

    private extractRaceGrade(
        raceName: string,
        raceGrade: KeirinGradeType,
        raceStage: KeirinRaceStage,
        raceDate: Date,
    ): KeirinGradeType {
        // raceStageが「ヤンググランプリ」の場合、GⅡを返す
        if (raceStage === 'ヤンググランプリ') {
            return 'GⅡ';
        }
        // raceNameに女子オールスター競輪が入っている場合、2024年であればFⅡ、2025年以降であればGⅠを返す
        if (
            /女子オールスター競輪/.exec(raceName) &&
            raceDate.getFullYear() >= 2025
        ) {
            return 'GⅠ';
        }
        if (
            /女子オールスター競輪/.exec(raceName) &&
            raceDate.getFullYear() === 2024
        ) {
            return 'FⅡ';
        }
        // raceNameにサマーナイトフェスティバルが入っている場合、raceStageが「ガールズ」が含まれている場合、FⅡを返す
        if (
            /サマーナイトフェスティバル/.exec(raceName) &&
            /ガールズ/.exec(raceStage)
        ) {
            return 'FⅡ';
        }
        // raceNameに寺内大吉記念杯競輪が入っている場合、FⅠを返す
        if (/寺内大吉記念杯競輪/.exec(raceName)) {
            return 'FⅠ';
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
        request: RegisterRaceListRequest<KeirinRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
