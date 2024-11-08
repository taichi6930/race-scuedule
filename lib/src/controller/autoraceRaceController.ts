import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { AutoracePlaceData } from '../domain/autoracePlaceData';
import { AutoraceRaceData } from '../domain/autoraceRaceData';
import { IPlaceDataUseCase } from '../usecase/interface/IPlaceDataUseCase';
import { IRaceDataUseCase } from '../usecase/interface/IRaceDataUseCase';
import { Logger } from '../utility/logger';

/**
 * 競輪のレース情報コントローラー
 */
@injectable()
export class AutoraceRaceController {
    public router: Router;

    constructor(
        // @inject('AutoraceRaceCalendarUseCase')
        // private readonly raceCalendarUseCase: IRaceCalendarUseCase,
        @inject('AutoraceRaceDataUseCase')
        private readonly autoraceRaceDataUseCase: IRaceDataUseCase<AutoraceRaceData>,
        @inject('AutoracePlaceDataUseCase')
        private readonly autoracePlaceDataUseCase: IPlaceDataUseCase<AutoracePlaceData>,
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
        // this.router.get('/calendar', this.getRacesFromCalendar.bind(this));
        // this.router.post('/calendar', this.updateRacesToCalendar.bind(this));
        // this.router.delete(
        //     '/calendar',
        //     this.cleansingRacesFromCalendar.bind(this),
        // );

        // RaceData関連のAPI
        this.router.get('/race', this.getRaceDataList.bind(this));
        this.router.post('/race', this.updateRaceDataList.bind(this));

        // PlaceData関連のAPI
        this.router.get('/place', this.getPlaceDataList.bind(this));
        this.router.post('/place', this.updatePlaceDataList.bind(this));
    }

    /**
     * 競輪カレンダーからレース情報を取得する
     * @param req リクエスト
     * @param res レスポンス
     * @returns
     * @swagger
     * /api/races/autorace/calendar:
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
     *                     description: 競輪場の名称
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
    // @Logger
    // private async getRacesFromCalendar(
    //     req: Request,
    //     res: Response,
    // ): Promise<void> {
    //     try {
    //         const { startDate, finishDate } = req.query;

    //         // startDateとfinishDateが指定されていない場合はエラーを返す
    //         if (
    //             isNaN(Date.parse(startDate as string)) ||
    //             isNaN(Date.parse(finishDate as string))
    //         ) {
    //             res.status(400).send('startDate、finishDateは必須です');
    //             return;
    //         }

    //         // カレンダーからレース情報を取得する
    //         const races = await this.raceCalendarUseCase.getRacesFromCalendar(
    //             new Date(startDate as string),
    //             new Date(finishDate as string),
    //         );
    //         // レース情報を返す
    //         res.json(races);
    //     } catch (error) {
    //         console.error(
    //             'カレンダーからレース情報を取得中にエラーが発生しました:',
    //             error,
    //         );
    //         const errorMessage =
    //             error instanceof Error ? error.message : String(error);
    //         res.status(500).send(
    //             `サーバーエラーが発生しました: ${errorMessage}`,
    //         );
    //     }
    // }

    /**
     * カレンダーにレース情報を更新する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/autorace/calendar:
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
    // @Logger
    // private async updateRacesToCalendar(
    //     req: Request,
    //     res: Response,
    // ): Promise<void> {
    //     try {
    //         const { startDate, finishDate } = req.body;

    //         // startDateとfinishDateが指定されていない場合はエラーを返す
    //         if (
    //             isNaN(Date.parse(startDate as string)) ||
    //             isNaN(Date.parse(finishDate as string))
    //         ) {
    //             res.status(400).send('startDate、finishDateは必須です');
    //             return;
    //         }

    //         // カレンダーにレース情報を更新する
    //         await this.raceCalendarUseCase.updateRacesToCalendar(
    //             new Date(startDate),
    //             new Date(finishDate),
    //             AUTORACE_SPECIFIED_GRADE_LIST,
    //         );
    //         res.status(200).send();
    //     } catch (error) {
    //         console.error(
    //             'カレンダーにレース情報を更新中にエラーが発生しました:',
    //             error,
    //         );
    //         const errorMessage =
    //             error instanceof Error ? error.message : String(error);
    //         res.status(500).send(
    //             `サーバーエラーが発生しました: ${errorMessage}`,
    //         );
    //     }
    // }

    /**
     * カレンダーからレース情報をクレンジングする
     * @param req
     * @param res
     * @returns
     */
    // @Logger
    // private async cleansingRacesFromCalendar(
    //     req: Request,
    //     res: Response,
    // ): Promise<void> {
    //     try {
    //         const { startDate, finishDate } = req.body;

    //         // startDateとfinishDateが指定されていない場合はエラーを返す
    //         if (
    //             isNaN(Date.parse(startDate as string)) ||
    //             isNaN(Date.parse(finishDate as string))
    //         ) {
    //             res.status(400).send('startDate、finishDateは必須です');
    //             return;
    //         }

    //         // カレンダーからレース情報をクレンジングする
    //         await this.raceCalendarUseCase.cleansingRacesFromCalendar(
    //             new Date(startDate),
    //             new Date(finishDate),
    //         );
    //         // レース情報をクレンジングする
    //         res.status(200).send();
    //     } catch (error) {
    //         console.error(
    //             'カレンダーからレース情報をクレンジング中にエラーが発生しました:',
    //             error,
    //         );
    //         const errorMessage =
    //             error instanceof Error ? error.message : String(error);
    //         res.status(500).send(
    //             `サーバーエラーが発生しました: ${errorMessage}`,
    //         );
    //     }
    // }

    /**
     * レース情報を取得する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/autorace/race:
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
     *                     description: 競輪場の名称
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
            const { startDate, finishDate } = req.query;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // レース情報を取得する
            const races = await this.autoraceRaceDataUseCase.fetchRaceDataList(
                new Date(startDate as string),
                new Date(finishDate as string),
            );
            res.json(races);
        } catch (error) {
            console.error('レース情報の取得中にエラーが発生しました:', error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }

    /**
     * レース情報を更新する
     * @swagger
     * /api/races/autorace/race:
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
            await this.autoraceRaceDataUseCase.updateRaceDataList(
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
     * 競輪場情報を取得する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/autorace/place:
     *   get:
     *     description: 競輪場情報を取得する
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
     *                     description: 競輪場の名称
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

            // 競輪場情報を取得する
            const placeList =
                await this.autoracePlaceDataUseCase.fetchPlaceDataList(
                    new Date(startDate as string),
                    new Date(finishDate as string),
                );
            res.json(placeList);
        } catch (error) {
            console.error('競輪場情報の取得中にエラーが発生しました:', error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }

    /**
     * 競輪場情報を更新する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/autorace/place:
     *   post:
     *     description: 競輪場情報を更新する
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
     *         description: 競輪場情報を更新
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

            // 競輪場情報を取得する
            await this.autoracePlaceDataUseCase.updatePlaceDataList(
                new Date(startDate),
                new Date(finishDate),
            );
            res.status(200).send();
        } catch (error) {
            console.error('競輪場情報の更新中にエラーが発生しました:', error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }
}
