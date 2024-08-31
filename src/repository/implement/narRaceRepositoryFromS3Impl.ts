import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { Logger } from "../../utility/logger";
import { IRaceRepository } from "../interface/IRaceRepository";
import { NarPlaceData } from '../../domain/narPlaceData';
import { NarRaceData } from '../../domain/narRaceData';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';
import { IS3Gateway } from '../../gateway/interface/IS3Gateway';
import { NarRaceCourse, NarRaceCourseType, NarGradeType } from '../../utility/data/raceSpecific';
import { format } from 'date-fns';

@injectable()
export class NarRaceRepositoryFromS3Impl implements IRaceRepository<NarRaceData, NarPlaceData> {
    constructor(
        @inject('IS3Gateway') private s3Gateway: IS3Gateway<NarRaceData>,
    ) { }
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(request: FetchRaceListRequest<NarPlaceData>): Promise<FetchRaceListResponse<NarRaceData>> {
        // startDateからendDateまでの日ごとのファイル名リストを生成する
        const fileNames: string[] = this.generateFilenameList(request.startDate, request.endDate);

        // ファイル名リストから競馬場開催データを取得する
        const raceDataList = (await Promise.all(fileNames.map(fileName =>
            // S3からデータを取得する
            this.s3Gateway.fetchDataFromS3(fileName).then(csv => {
                // csvをパースしてNarRaceDataのリストを生成する
                return csv.split('\n').map((line: string) => {
                    const [raceName, raceDate, place, surfaceType, distance, grade, raceNum] = line.split(',');
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
                    .filter((raceData): raceData is NarRaceData => raceData !== undefined);
            })
        ))).flat();
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
        let currentDate = new Date(startDate);
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
    async registerRaceList(request: RegisterRaceListRequest<NarRaceData>): Promise<RegisterRaceListResponse> {
        const raceData: NarRaceData[] = request.raceDataList;
        // レースデータを日付ごとに分割する
        const raceDataDict: { [key: string]: NarRaceData[] } = {};
        raceData.forEach((race) => {
            const key = `${format(race.dateTime, 'yyyyMMdd')}.csv`;
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
