import 'reflect-metadata';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { NarPlaceData } from '../../domain/narPlaceData';
import { NarRaceData } from '../../domain/narRaceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import {
    NarGradeType,
    NarRaceCourse,
    NarRaceCourseType,
} from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class NarRaceRepositoryFromS3Impl
    implements IRaceRepository<NarRaceData, NarPlaceData>
{
    constructor(
        @inject('NarRaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<NarRaceData>,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(
        request: FetchRaceListRequest<NarPlaceData>,
    ): Promise<FetchRaceListResponse<NarRaceData>> {
        // startDateからendDateまでの日ごとのファイル名リストを生成する
        const fileNames: string[] = this.generateFilenameList(
            request.startDate,
            request.endDate,
        );

        // ファイル名リストから競馬場開催データを取得する
        const raceDataList = (
            await Promise.all(
                fileNames.map(async (fileName) =>
                    // S3からデータを取得する
                    this.s3Gateway.fetchDataFromS3(fileName).then((csv) => {
                        // csvをパースしてNarRaceDataのリストを生成する
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
                                ] = line.split(',');
                                if (!raceName || isNaN(parseInt(raceNum))) {
                                    return undefined;
                                }
                                return new NarRaceData(
                                    raceName,
                                    new Date(raceDate),
                                    place as NarRaceCourse,
                                    surfaceType as NarRaceCourseType,
                                    parseInt(distance),
                                    grade as NarGradeType,
                                    parseInt(raceNum),
                                );
                            })
                            .filter(
                                (raceData): raceData is NarRaceData =>
                                    raceData !== undefined,
                            );
                    }),
                ),
            )
        ).flat();
        return new FetchRaceListResponse(raceDataList);
    }

    /**
     * startDateからendDateまでの日付ごとのファイル名リストを生成する
     * @param startDate
     * @param endDate
     * @returns
     */
    private generateFilenameList(startDate: Date, endDate: Date): string[] {
        const fileNames: string[] = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const fileName = `${format(currentDate, 'yyyyMMdd')}.csv`;
            fileNames.push(fileName);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return fileNames;
    }

    /**
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceList(
        request: RegisterRaceListRequest<NarRaceData>,
    ): Promise<RegisterRaceListResponse> {
        const raceDataList: NarRaceData[] = request.raceDataList;
        // レースデータを日付ごとに分割する
        const raceDataDict: Record<string, NarRaceData[]> = {};
        raceDataList.forEach((raceData) => {
            const key = `${format(raceData.dateTime, 'yyyyMMdd')}.csv`;
            if (!raceDataDict[key]) {
                raceDataDict[key] = [];
            }
            raceDataDict[key].push(raceData);
        });

        // 月毎に分けられたplaceをS3にアップロードする
        for (const [fileName, raceData] of Object.entries(raceDataDict)) {
            await this.s3Gateway.uploadDataToS3(raceData, fileName);
        }
        return new RegisterRaceListResponse(200);
    }
}
