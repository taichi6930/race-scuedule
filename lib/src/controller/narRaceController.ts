import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { NarPlaceData } from '../domain/narPlaceData';
import { NarRaceData } from '../domain/narRaceData';
import { IPlaceDataUseCase } from '../usecase/interface/IPlaceDataUseCase';
import { IRaceCalendarUseCase } from '../usecase/interface/IRaceCalendarUseCase';
import { IRaceDataUseCase } from '../usecase/interface/IRaceDataUseCase';
import { NAR_SPECIFIED_GRADE_LIST } from '../utility/data/raceSpecific';
import { Logger } from '../utility/logger';

/**
 * 地方競馬のレース情報コントローラー
 */
@injectable()
export class NarRaceController {
    public router: Router;

    constructor(
        @inject('NarRaceCalendarUseCase')
        private readonly raceCalendarUseCase: IRaceCalendarUseCase,
        @inject('NarRaceDataUseCase')
        private readonly narRaceDataUseCase: IRaceDataUseCase<NarRaceData>,
        @inject('NarPlaceDataUseCase')
        private readonly narPlaceDataUseCase: IPlaceDataUseCase<NarPlaceData>,
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
     * NARカレンダーからレース情報を取得する
     * @param req リクエスト
     * @param res レスポンス
     * @returns
     * @swagger
     * /api/races/nar/calendar:
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
     *                     description: 競馬場の名称
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
            res.status(500).send(`サーバーエラーが発生しました: ${error}`);
        }
    }

    /**
     * カレンダーにレース情報を更新する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/nar/calendar:
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
                NAR_SPECIFIED_GRADE_LIST,
            );
            res.status(200).send();
        } catch (error) {
            console.error(
                'カレンダーにレース情報を更新中にエラーが発生しました:',
                error,
            );
            res.status(500).send(`サーバーエラーが発生しました: ${error}`);
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
            res.status(500).send(`サーバーエラーが発生しました: ${error}`);
        }
    }

    /**
     * レース情報を取得する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/nar/race:
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
     *                   dateTime:
     *                     type: string
     *                     format: date-time
     *                     description: レース開始時刻
     *                   location:
     *                     type: string
     *                     description: 競馬場の名称
     *                   surfaceType:
     *                     type: string
     *                     description: 馬場の種類
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
            const races = await this.narRaceDataUseCase.fetchRaceDataList(
                new Date(startDate as string),
                new Date(finishDate as string),
            );
            res.json(races);
        } catch (error) {
            console.error('レース情報の取得中にエラーが発生しました:', error);
            res.status(500).send(`サーバーエラーが発生しました: ${error}`);
        }
    }

    /**
     * レース情報を更新する
     * @swagger
     * /api/races/nar/race:
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

            // レース情報を取得する
            await this.narRaceDataUseCase.updateRaceDataList(
                new Date(startDate),
                new Date(finishDate),
            );
            res.status(200).send();
        } catch (error) {
            console.error('レース情報の更新中にエラーが発生しました:', error);
            res.status(500).send(`サーバーエラーが発生しました: ${error}`);
        }
    }

    /**
     * 競馬場情報を取得する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/nar/place:
     *   get:
     *     description: 競馬場情報を取得する
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
     *                     description: 競馬場の名称
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

            // 競馬場情報を取得する
            const placeList = await this.narPlaceDataUseCase.fetchPlaceDataList(
                new Date(startDate as string),
                new Date(finishDate as string),
            );
            res.json(placeList);
        } catch (error) {
            console.error('競馬場情報の取得中にエラーが発生しました:', error);
            res.status(500).send(`サーバーエラーが発生しました: ${error}`);
        }
    }

    /**
     * 競馬場情報を更新する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/nar/place:
     *   post:
     *     description: 競馬場情報を更新する
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
     *         description: 競馬場情報を更新
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

            // 競馬場情報を取得する
            await this.narPlaceDataUseCase.updatePlaceDataList(
                new Date(startDate),
                new Date(finishDate),
            );
            res.status(200).send();
        } catch (error) {
            console.error('競馬場情報の更新中にエラーが発生しました:', error);
            res.status(500).send(`サーバーエラーが発生しました: ${error}`);
        }
    }
}
