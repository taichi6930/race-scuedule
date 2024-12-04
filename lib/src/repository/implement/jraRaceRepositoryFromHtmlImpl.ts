import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { JraRaceData } from '../../domain/jraRaceData';
import { IJraRaceDataHtmlGateway } from '../../gateway/interface/iJraRaceDataHtmlGateway';
import { JraGradeType, JraRaceCourse } from '../../utility/data/jra';
import { Logger } from '../../utility/logger';
import { processJraRaceName } from '../../utility/raceName';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

@injectable()
export class JraRaceRepositoryFromHtmlImpl
    implements IRaceRepository<JraRaceEntity, JraPlaceEntity>
{
    constructor(
        @inject('JraRaceDataHtmlGateway')
        private jraRaceDataHtmlGateway: IJraRaceDataHtmlGateway,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(
        request: FetchRaceListRequest<JraPlaceEntity>,
    ): Promise<FetchRaceListResponse<JraRaceEntity>> {
        const jraRaceEntityList: JraRaceEntity[] = [];
        const placeList = request.placeEntityList;
        // placeListからdateのみをListにする、重複すると思うので重複を削除する
        const dateList = placeList
            ?.map((place) => place.placeData.dateTime)
            .filter((x, i, self) => self.indexOf(x) === i);
        if (dateList) {
            for (const date of dateList) {
                jraRaceEntityList.push(
                    ...(await this.fetchRaceListFromHtmlWithJraPlace(date)),
                );
            }
        }
        return new FetchRaceListResponse(jraRaceEntityList);
    }

    @Logger
    async fetchRaceListFromHtmlWithJraPlace(
        date: Date,
    ): Promise<JraRaceEntity[]> {
        try {
            const [year, month, day] = [
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate(),
            ];
            // レース情報を取得
            const htmlText: string =
                await this.jraRaceDataHtmlGateway.getRaceDataHtml(date);
            const jraRaceDataList: JraRaceEntity[] = [];

            // mockHTML内のsection id="raceInfo"の中のtableを取得
            // HTMLをパースする
            const $ = cheerio.load(htmlText);
            const doc = $(`#raceInfo`);
            const table = doc.find('table');

            table.each((i: number, tableElem: cheerio.Element) => {
                // theadタグを取得
                const thead = $(tableElem).find('thead');
                // thead内のthタグ内に「x回yyz日目」が含まれている
                // 「2回東京8日目」のような文字列が取得できる
                // xは回数、yyは競馬場名、zは日目
                // xには2、yyには東京、zには8が取得できるようにしたい
                // これを取得してレースの開催場所と日程を取得する
                const theadElementMatch = /(\d+)回(.*?)(\d+)日目/.exec(
                    thead.text(),
                );
                if (theadElementMatch === null) {
                    return;
                }
                // 競馬場を取得
                // TODO: JraRaceCourse型に変換できるかどうかは別途検討
                const placeString: string = theadElementMatch[2];
                // placeStringがJraRaceCourseに変換できるかを確認して、OKであればキャストする
                const place: JraRaceCourse = placeString as JraRaceCourse;

                // 開催回数を取得 数字でない場合はreturn
                if (isNaN(parseInt(theadElementMatch[1]))) {
                    return;
                }
                const raceHeld: number = parseInt(theadElementMatch[1]);
                // 開催日程を取得 数字でない場合はreturn
                if (isNaN(parseInt(theadElementMatch[3]))) {
                    return;
                }
                const raceHeldDay: number = parseInt(theadElementMatch[3]);

                // tbody内のtrタグを取得
                $(tableElem)
                    .find('tbody')
                    .find('tr')
                    .each((_: number, elem: cheerio.Element) => {
                        // trタグ内のtdタグを取得
                        const td = $(elem).find('td');
                        // tdが3つある
                        // 1つ目はレース番号とレース開始時間
                        // hh:mmの形式で取得
                        const raceNumAndTime = td.eq(0).text().split(' ')[0];
                        // tdの最初の要素からレース番号を取得 raceNumAndTimeのxRとなっているxを取得
                        const raceNum: number = parseInt(
                            raceNumAndTime.split('R')[0],
                        );
                        // tdの最初の要素からレース開始時間を取得 raceNumAndTimeのhh:mmを取得
                        const raceTime = raceNumAndTime.split('R')[1];
                        // hh:mmの形式からhhとmmを取得
                        const [hour, minute] = raceTime
                            .split(':')
                            .map((time: string) => parseInt(time));

                        // 2つ目はレース名、レースのグレード、馬の種類、距離、頭数
                        // レース名は <a class="" href="/db/race/202405120401/" itemprop="url">サラ系3歳未勝利</a> のような形式で取得
                        let raceName = td
                            .eq(1)
                            .find('a')
                            .text()
                            .replace(/[！-～]/g, (s: string) =>
                                String.fromCharCode(s.charCodeAt(0) - 0xfee0),
                            )
                            .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s: string) =>
                                String.fromCharCode(s.charCodeAt(0) - 0xfee0),
                            )
                            .replace(/ステークス/, 'S')
                            .replace(/カップ/, 'C')
                            .replace('サラ系', '');

                        const surfaceTypeMatch = /[芝ダ障]{1,2}/.exec(
                            td.eq(1).find('span').eq(1).text(),
                        );
                        // ダ である場合には ダート に、障 である場合には 障害 に変換する
                        const surfaceType: string = (
                            surfaceTypeMatch?.[0] ?? ''
                        )
                            .replace('ダ', 'ダート')
                            .replace('障', '障害');
                        if (
                            surfaceType !== '芝' &&
                            surfaceType !== 'ダート' &&
                            surfaceType !== '障害'
                        ) {
                            return;
                        }

                        const distanceMatch = /\d+m/.exec(
                            td.eq(1).find('span').eq(1).text(),
                        );
                        const distance: number = distanceMatch
                            ? parseInt(distanceMatch[0].replace('m', ''))
                            : 0;
                        if (distance === 0) {
                            return;
                        }
                        let raceGrade: JraGradeType | null = null;

                        if (raceName.includes('(GⅠ)')) {
                            raceGrade = surfaceType === '障害' ? 'J.GⅠ' : 'GⅠ';
                            raceName = raceName.replace('(GⅠ)', '');
                        }
                        if (raceName.includes('(GⅡ)')) {
                            raceGrade = surfaceType === '障害' ? 'J.GⅡ' : 'GⅡ';
                            raceName = raceName.replace('(GⅡ)', '');
                        }
                        if (raceName.includes('(GⅢ)')) {
                            raceGrade = surfaceType === '障害' ? 'J.GⅢ' : 'GⅢ';
                            raceName = raceName.replace('(GⅢ)', '');
                        }
                        if (raceName.includes('(L)')) {
                            raceGrade = 'Listed';
                            raceName = raceName.replace('(L)', '');
                        }
                        if (raceGrade === null) {
                            // 2つあるspanのうち1つ目にレースの格が入っているので、それを取得
                            const tbodyTrTdElement1 = td
                                .eq(1)
                                .find('span')
                                .eq(0)
                                .text();
                            if (tbodyTrTdElement1.includes('オープン')) {
                                raceGrade = 'オープン特別';
                            }
                            if (tbodyTrTdElement1.includes('3勝クラス')) {
                                raceGrade = '3勝クラス';
                            }
                            if (tbodyTrTdElement1.includes('2勝クラス')) {
                                raceGrade = '2勝クラス';
                            }
                            if (tbodyTrTdElement1.includes('1勝クラス')) {
                                raceGrade = '1勝クラス';
                            }
                            if (tbodyTrTdElement1.includes('1600万')) {
                                raceGrade = '1600万下';
                            }
                            if (tbodyTrTdElement1.includes('1000万')) {
                                raceGrade = '1000万下';
                            }
                            if (tbodyTrTdElement1.includes('900万')) {
                                raceGrade = '900万下';
                            }
                            if (tbodyTrTdElement1.includes('500万')) {
                                raceGrade = '500万下';
                            }
                            if (tbodyTrTdElement1.includes('未勝利')) {
                                raceGrade = '未勝利';
                            }
                            if (tbodyTrTdElement1.includes('未出走')) {
                                raceGrade = '未出走';
                            }
                            if (tbodyTrTdElement1.includes('新馬')) {
                                raceGrade = '新馬';
                            }
                        }
                        if (raceGrade === null) {
                            if (raceName.includes('オープン')) {
                                raceGrade = 'オープン特別';
                            }
                            if (raceName.includes('3勝クラス')) {
                                raceGrade = '3勝クラス';
                            }
                            if (raceName.includes('2勝クラス')) {
                                raceGrade = '2勝クラス';
                            }
                            if (raceName.includes('1勝クラス')) {
                                raceGrade = '1勝クラス';
                            }
                            if (raceName.includes('1600万')) {
                                raceGrade = '1600万下';
                            }
                            if (raceName.includes('1000万')) {
                                raceGrade = '1000万下';
                            }
                            if (raceName.includes('900万')) {
                                raceGrade = '900万下';
                            }
                            if (raceName.includes('500万')) {
                                raceGrade = '500万下';
                            }
                            if (raceName.includes('未勝利')) {
                                raceGrade = '未勝利';
                            }
                            if (raceName.includes('未出走')) {
                                raceGrade = '未出走';
                            }
                            if (raceName.includes('新馬')) {
                                raceGrade = '新馬';
                            }
                            if (raceName.includes('オープン')) {
                                raceGrade = 'オープン';
                            }
                        }

                        const newRaceName = processJraRaceName({
                            name: raceName,
                            place: place,
                            date: new Date(year, month - 1, day),
                            surfaceType: surfaceType,
                            distance: distance,
                            grade: raceGrade ?? '格付けなし',
                        });

                        const jradata = new JraRaceEntity(
                            null,
                            new JraRaceData(
                                newRaceName,
                                new Date(year, month - 1, day, hour, minute),
                                place,
                                surfaceType,
                                distance,
                                raceGrade as JraGradeType,
                                raceNum,
                                raceHeld,
                                raceHeldDay,
                            ),
                        );
                        jraRaceDataList.push(jradata);
                    });
            });
            return jraRaceDataList;
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
        request: RegisterRaceListRequest<JraRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
