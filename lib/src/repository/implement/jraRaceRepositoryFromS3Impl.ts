import '../../utility/format';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import {
    JraGradeType,
    JraRaceCourse,
    JraRaceCourseType,
} from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

@injectable()
export class JraRaceRepositoryFromS3Impl
    implements IRaceRepository<JraRaceEntity, JraPlaceEntity>
{
    constructor(
        @inject('JraRaceS3Gateway')
        private s3Gateway: IS3Gateway<JraRaceEntity>,
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
        // startDateからfinishDateまでの日ごとのファイル名リストを生成する
        const fileNames: string[] = [];
        const currentDate = new Date(request.startDate);
        while (currentDate <= request.finishDate) {
            const fileName = `${format(currentDate, 'yyyyMMdd')}.csv`;
            fileNames.push(fileName);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        console.debug('fileNames:', fileNames);

        // ファイル名リストから競馬場開催データを取得する
        const raceDataList = (
            await Promise.all(
                fileNames.map(async (fileName) => {
                    try {
                        const csv =
                            await this.s3Gateway.fetchDataFromS3(fileName);

                        // CSVを行ごとに分割
                        const lines = csv.split('\n');

                        // ヘッダー行を解析
                        const headers = lines[0].split(',');

                        // ヘッダーに基づいてインデックスを取得
                        const idIndex = headers.indexOf('id');
                        const raceNameIndex = headers.indexOf('name');
                        const raceDateIndex = headers.indexOf('dateTime');
                        const placeIndex = headers.indexOf('location');
                        const surfaceTypeIndex = headers.indexOf('surfaceType');
                        const distanceIndex = headers.indexOf('distance');
                        const gradeIndex = headers.indexOf('grade');
                        const raceNumIndex = headers.indexOf('number');
                        const heldTimesIndex = headers.indexOf('heldTimes');
                        const heldDayTimesIndex =
                            headers.indexOf('heldDayTimes');

                        // データ行を解析してJraRaceEntityのリストを生成
                        return lines
                            .slice(1)
                            .map((line: string) => {
                                const columns = line.split(',');

                                // 必要なフィールドが存在しない場合はundefinedを返す
                                if (
                                    !columns[raceNameIndex] ||
                                    isNaN(parseInt(columns[raceNumIndex]))
                                ) {
                                    return undefined;
                                }

                                return new JraRaceEntity(
                                    idIndex < 0 ? null : columns[idIndex],
                                    columns[raceNameIndex],
                                    new Date(columns[raceDateIndex]),
                                    columns[placeIndex] as JraRaceCourse,
                                    columns[
                                        surfaceTypeIndex
                                    ] as JraRaceCourseType,
                                    parseInt(columns[distanceIndex]),
                                    columns[gradeIndex] as JraGradeType,
                                    parseInt(columns[raceNumIndex]),
                                    parseInt(columns[heldTimesIndex]),
                                    parseInt(columns[heldDayTimesIndex]),
                                );
                            })
                            .filter(
                                (raceData): raceData is JraRaceEntity =>
                                    raceData !== undefined,
                            );
                    } catch (error) {
                        console.error(
                            `Error processing file ${fileName}:`,
                            error,
                        );
                        return [];
                    }
                }),
            )
        ).flat();

        return new FetchRaceListResponse<JraRaceEntity>(raceDataList);
    }

    /**
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceList(
        request: RegisterRaceListRequest<JraRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        const raceData: JraRaceEntity[] = request.raceDataList;
        // レースデータを日付ごとに分割する
        const raceDataDict: Record<string, JraRaceEntity[]> = {};
        raceData.forEach((race) => {
            const key = `${format(race.dateTime, 'yyyyMMdd')}.csv`;
            if (!(key in raceDataDict)) {
                raceDataDict[key] = [];
            }
            raceDataDict[key].push(race);
        });

        // 月毎に分けられたplaceをS3にアップロードする
        for (const [fileName, raceData] of Object.entries(raceDataDict)) {
            await this.s3Gateway.uploadDataToS3(raceData, fileName);
        }
        return new RegisterRaceListResponse(200);
    }
}
