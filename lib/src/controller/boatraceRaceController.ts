import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { BoatraceRaceData } from '../domain/boatraceRaceData';
import { BoatracePlaceEntity } from '../repository/entity/boatracePlaceEntity';
import { IPlaceDataUseCase } from '../usecase/interface/IPlaceDataUseCase';
import { IRaceCalendarUseCase } from '../usecase/interface/IRaceCalendarUseCase';
import { IRaceDataUseCase } from '../usecase/interface/IRaceDataUseCase';
import {
    BOATRACE_SPECIFIED_GRADE_LIST,
    BoatraceGradeType,
    BoatraceRaceCourse,
    BoatraceRaceStage,
} from '../utility/data/boatrace';
import { Logger } from '../utility/logger';

/**
 * ボートレースのレース情報コントローラー
 */
@injectable()
export class BoatraceRaceController {
    public router: Router;

    constructor(
        @inject('BoatraceRaceCalendarUseCase')
        private readonly raceCalendarUseCase: IRaceCalendarUseCase,
        @inject('BoatraceRaceDataUseCase')
        private readonly boatraceRaceDataUseCase: IRaceDataUseCase<
            BoatraceRaceData,
            BoatraceGradeType,
            BoatraceRaceCourse,
            BoatraceRaceStage
        >,
        @inject('BoatracePlaceDataUseCase')
        private readonly boatracePlaceDataUseCase: IPlaceDataUseCase<BoatracePlaceEntity>,
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * ルーティングの初期化
     */
    @Logger
    private initializeRoutes(): void {
        // Calendar関連のAPI
        this.router.get('/calendar', this.getRacesFromCalendar.bind(this));
        this.router.post('/calendar', this.updateRacesToCalendar.bind(this));
        this.router.delete(
            '/calendar',
            this.cleansingRacesFromCalendar.bind(this),
        );

        // RaceData関連のAPI
        this.router.get('/race', this.getRaceDataList.bind(this));
        this.router.post('/race', this.updateRaceDataList.bind(this));

        // PlaceData関連のAPI
        this.router.get('/place', this.getPlaceDataList.bind(this));
        this.router.post('/place', this.updatePlaceDataList.bind(this));
    }

    /**
     * ボートレースカレンダーからレース情報を取得する
     * @param req リクエスト
     * @param res レスポンス
     * @returns
     * @swagger
     * /api/races/boatrace/calendar:
     *   get:
     *     description: カレンダーからレース情報を取得する
     *     parameters:
     *       - name: startDate
     *         in: query
     *         description: レース情報の開始日
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *       - name: finishDate
     *         in: query
     *         description: レース情報の終了日
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *     responses:
     *       200:
     *         description: レース情報を取得
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: レースID
     *                   title:
     *                     type: string
     *                     description: レースタイトル
     *                   startTime:
     *                     type: string
     *                     format: date-time
     *                     description: レース開始時刻
     *                   endTime:
     *                     type: string
     *                     format: date-time
     *                     description: レース終了時刻
     *                   location:
     *                     type: string
     *                     description: ボートレース場の名称
     *                   description:
     *                     type: string
     *                     description: レースの説明
     *       400:
     *         description: 不正なリクエスト。`startDate` または `finishDate` が指定されていない場合
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: エラーメッセージ `startDate`、`finishDate` は必須です
     *                 details:
     *                   type: string
     *                   description: エラーの詳細（任意でより具体的な説明を提供することができます）
     *       500:
     *         description: サーバーエラー。カレンダーからのレース情報取得中にエラーが発生した場合
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: エラーメッセージ サーバーエラーが発生しました
     *                 details:
     *                   type: string
     *                   description: エラーの詳細（任意でより具体的な説明を提供することができます）
     */
    @Logger
    private async getRacesFromCalendar(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate } = req.query;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // カレンダーからレース情報を取得する
            const races = await this.raceCalendarUseCase.getRacesFromCalendar(
                new Date(startDate as string),
                new Date(finishDate as string),
            );
            // レース情報を返す
            res.json(races);
        } catch (error) {
            console.error(
                'カレンダーからレース情報を取得中にエラーが発生しました:',
                error,
            );
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }

    /**
     * カレンダーにレース情報を更新する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/boatrace/calendar:
     *   post:
     *     description: カレンダーにレース情報を更新する
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               startDate:
     *                 type: string
     *                 format: date-time
     *                 description: レース情報の開始日
     *               finishDate:
     *                 type: string
     *                 format: date-time
     *                 description: レース情報の終了日
     *     responses:
     *       200:
     *         description: レース情報を更新
     *       400:
     *         description: 不正なリクエスト。`startDate` または `finishDate` が指定されていない場合
     *       500:
     *         description: サーバーエラー。カレンダーへのレース情報更新中にエラーが発生した場合
     */
    @Logger
    private async updateRacesToCalendar(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate } = req.body;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // カレンダーにレース情報を更新する
            await this.raceCalendarUseCase.updateRacesToCalendar(
                new Date(startDate),
                new Date(finishDate),
                BOATRACE_SPECIFIED_GRADE_LIST,
            );
            res.status(200).send();
        } catch (error) {
            console.error(
                'カレンダーにレース情報を更新中にエラーが発生しました:',
                error,
            );
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }

    /**
     * カレンダーからレース情報をクレンジングする
     * @param req
     * @param res
     * @returns
     */
    @Logger
    private async cleansingRacesFromCalendar(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate } = req.query;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // カレンダーからレース情報をクレンジングする
            await this.raceCalendarUseCase.cleansingRacesFromCalendar(
                new Date(startDate as string),
                new Date(finishDate as string),
            );
            // レース情報をクレンジングする
            res.status(200).send();
        } catch (error) {
            console.error(
                'カレンダーからレース情報をクレンジング中にエラーが発生しました:',
                error,
            );
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }

    /**
     * レース情報を取得する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/boatrace/race:
     *   get:
     *     description: レース情報を取得する
     *     parameters:
     *       - name: startDate
     *         in: query
     *         description: レース情報の開始日
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *       - name: finishDate
     *         in: query
     *         description: レース情報の終了日
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *     responses:
     *       200:
     *         description: レース情報を取得
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   name:
     *                     type: string
     *                     description: レース名
     *                   stage:
     *                     type: string
     *                     description: ステージ（決勝、準決勝、予選など）
     *                   dateTime:
     *                     type: string
     *                     format: date-time
     *                     description: レース開始時刻
     *                   location:
     *                     type: string
     *                     description: ボートレース場の名称
     *                   distance:
     *                     type: number
     *                     description: 距離
     *                   grade:
     *                     type: string
     *                     description: レースのグレード
     *                   number:
     *                     type: number
     *                     description: レース番号
     *       400:
     *         description: 不正なリクエスト。`startDate` または `finishDate` が指定されていない場合
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: エラーメッセージ `startDate`、`finishDate` は必須です
     *                 details:
     *                   type: string
     *                   description: エラーの詳細（任意でより具体的な説明を提供することができます）
     *       500:
     *         description: サーバーエラー。カレンダーからのレース情報取得中にエラーが発生した場合
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: エラーメッセージ サーバーエラーが発生しました
     *                 details:
     *                   type: string
     *                   description: エラーの詳細（任意でより具体的な説明を提供することができます）
     */
    @Logger
    private async getRaceDataList(req: Request, res: Response): Promise<void> {
        try {
            // gradeが複数来ることもある
            const { startDate, finishDate, grade, location, stage } = req.query;
            // gradeが配列だった場合、配列に変換する、配列でなければ配列にしてあげる
            const gradeList =
                typeof grade === 'string'
                    ? [grade as BoatraceGradeType]
                    : typeof grade === 'object'
                      ? Array.isArray(grade)
                          ? (grade as string[]).map(
                                (g: string) => g as BoatraceGradeType,
                            )
                          : undefined
                      : undefined;

            const locationList =
                typeof location === 'string'
                    ? [location as BoatraceRaceCourse]
                    : typeof location === 'object'
                      ? Array.isArray(location)
                          ? (location as string[]).map(
                                (l: string) => l as BoatraceRaceCourse,
                            )
                          : undefined
                      : undefined;

            const stageList =
                typeof stage === 'string'
                    ? [stage as BoatraceRaceStage]
                    : typeof stage === 'object'
                      ? Array.isArray(stage)
                          ? (stage as string[]).map(
                                (s: string) => s as BoatraceRaceStage,
                            )
                          : undefined
                      : undefined;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).json({
                    error: 'startDate、finishDateは必須です',
                    details: 'startDateとfinishDateの両方を指定してください',
                });
                return;
            }

            // レース情報を取得する
            const races =
                await this.boatraceRaceDataUseCase.fetchRaceEntityList(
                    new Date(startDate as string),
                    new Date(finishDate as string),
                    {
                        gradeList: gradeList,
                        locationList: locationList,
                        stageList: stageList,
                    },
                );
            res.json(races);
        } catch (error) {
            console.error('レース情報の取得中にエラーが発生しました:', error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).json({
                error: 'サーバーエラーが発生しました',
                details: `レース情報の取得中にエラーが発生しました: ${errorMessage}`,
            });
        }
    }

    /**
     * レース情報を更新する
     * @swagger
     * /api/races/boatrace/race:
     *   post:
     *     description: レース情報を更新する
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               startDate:
     *                 type: string
     *                 format: date-time
     *                 description: レース情報の開始日
     *               finishDate:
     *                 type: string
     *                 format: date-time
     *                 description: レース情報の終了日
     *     responses:
     *       200:
     *         description: レース情報を更新
     *       400:
     *         description: 不正なリクエスト。`startDate` または `finishDate` が指定されていない場合
     *       500:
     *         description: サーバーエラー。カレンダーへのレース情報更新中にエラーが発生した場合
     */
    @Logger
    private async updateRaceDataList(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate } = req.body;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            console.log('test: updateRaceDataList');
            // レース情報を取得する
            await this.boatraceRaceDataUseCase.updateRaceEntityList(
                new Date(startDate),
                new Date(finishDate),
            );
            res.status(200).send();
        } catch (error) {
            console.error('レース情報の更新中にエラーが発生しました:', error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }

    /**
     * ボートレース場情報を取得する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/boatrace/place:
     *   get:
     *     description: ボートレース場情報を取得する
     *     parameters:
     *       - name: startDate
     *         in: query
     *         description: レース情報の開始日
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *       - name: finishDate
     *         in: query
     *         description: レース情報の終了日
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *     responses:
     *       200:
     *         description: レース情報を取得
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   dateTime:
     *                     type: string
     *                     format: date-time
     *                     description: レース開始時刻
     *                   location:
     *                     type: string
     *                     description: ボートレース場の名称
     *       400:
     *         description: 不正なリクエスト。`startDate` または `finishDate` が指定されていない場合
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: エラーメッセージ `startDate`、`finishDate` は必須です
     *                 details:
     *                   type: string
     *                   description: エラーの詳細（任意でより具体的な説明を提供することができます）
     *       500:
     *         description: サーバーエラー。カレンダーからのレース情報取得中にエラーが発生した場合
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: エラーメッセージ サーバーエラーが発生しました
     *                 details:
     *                   type: string
     *                   description: エラーの詳細（任意でより具体的な説明を提供することができます）
     */
    @Logger
    private async getPlaceDataList(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, finishDate } = req.query;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // ボートレース場情報を取得する
            const placeList =
                await this.boatracePlaceDataUseCase.fetchPlaceEntityList(
                    new Date(startDate as string),
                    new Date(finishDate as string),
                );
            res.json(placeList);
        } catch (error) {
            console.error(
                'ボートレース場情報の取得中にエラーが発生しました:',
                error,
            );
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }

    /**
     * ボートレース場情報を更新する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/boatrace/place:
     *   post:
     *     description: ボートレース場情報を更新する
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               startDate:
     *                 type: string
     *                 format: date-time
     *                 description: レース情報の開始日
     *               finishDate:
     *                 type: string
     *                 format: date-time
     *                 description: レース情報の終了日
     *     responses:
     *       200:
     *         description: ボートレース場情報を更新
     *       400:
     *         description: 不正なリクエスト。`startDate` または `finishDate` が指定されていない場合
     *       500:
     *         description: サーバーエラー。カレンダーへのレース情報更新中にエラーが発生した場合
     */
    @Logger
    private async updatePlaceDataList(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate } = req.body;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // ボートレース場情報を取得する
            await this.boatracePlaceDataUseCase.updatePlaceEntityList(
                new Date(startDate),
                new Date(finishDate),
            );
            res.status(200).send();
        } catch (error) {
            console.error(
                'ボートレース場情報の更新中にエラーが発生しました:',
                error,
            );
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }
}
