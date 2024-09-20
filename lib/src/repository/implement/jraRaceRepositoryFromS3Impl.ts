import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { JraPlaceData } from '../../domain/jraPlaceData';
import { JraRaceData } from '../../domain/jraRaceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import {
    JraGradeType,
    JraRaceCourse,
    JraRaceCourseType,
} from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

@injectable()
export class JraRaceRepositoryFromS3Impl
    implements IRaceRepository<JraRaceData, JraPlaceData>
{
    constructor(
        @inject('JraRaceS3Gateway') private s3Gateway: IS3Gateway<JraRaceData>,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(
        request: FetchRaceListRequest<JraPlaceData>,
    ): Promise<FetchRaceListResponse<JraRaceData>> {
        // startDateからfinishDateまでの日ごとのファイル名リストを生成する
        const fileNames: string[] = [];
        const currentDate = new Date(request.startDate);
        while (currentDate <= request.finishDate) {
            const year = currentDate.getFullYear();
            const month = currentDate.getXDigitMonth(2);
            const day = currentDate.getXDigitDays(2);
            const fileName = `${year}${month}${day}.csv`;
            fileNames.push(fileName);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        console.debug('fileNames:', fileNames);

        // ファイル名リストから競馬場開催データを取得する
        const raceDataList = (
            await Promise.all(
                fileNames.map((fileName) =>
                    this.s3Gateway.fetchDataFromS3(fileName).then((csv) => {
                        return csv
                            .split('\n')
                            .map((line: string) => {
                                const [
                                    raceName,
                                    raceDate,
                                    place,
                                    surfaceType,
                                    distance,
                                    grade,
                                    raceNum,
                                    raceHeld,
                                    raceHeldDay,
                                ] = line.split(',');
                                if (!raceName || isNaN(parseInt(raceNum))) {
                                    return undefined;
                                }
                                return new JraRaceData(
                                    raceName,
                                    new Date(raceDate),
                                    place as JraRaceCourse,
                                    surfaceType as JraRaceCourseType,
                                    parseInt(distance),
                                    grade as JraGradeType,
                                    parseInt(raceNum),
                                    parseInt(raceHeld),
                                    parseInt(raceHeldDay),
                                );
                            })
                            .filter(
                                (raceData): raceData is JraRaceData =>
                                    raceData !== undefined,
                            );
                    }),
                ),
            )
        ).flat();
        return new FetchRaceListResponse(raceDataList);
    }

    /**
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceList(
        request: RegisterRaceListRequest<JraRaceData>,
    ): Promise<RegisterRaceListResponse> {
        const raceData: JraRaceData[] = request.raceDataList;
        // レースデータを日付ごとに分割する
        const raceDataDict: Record<string, JraRaceData[]> = {};
        raceData.forEach((race) => {
            const key = `${race.dateTime.getFullYear()}${race.dateTime.getXDigitMonth(2)}${race.dateTime.getXDigitDays(2)}.csv`;
            if (!raceDataDict[key]) {
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
