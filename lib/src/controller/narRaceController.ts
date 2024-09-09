import { Request, Response, Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { NarRaceData } from '../domain/narRaceData';
import { IRaceCalendarUseCase } from '../usecase/interface/IRaceCalendarUseCase';
import { NAR_SPECIFIED_GRADE_LIST } from '../utility/data/raceSpecific';
import { Logger } from '../utility/logger';
import { IRaceDataUseCase } from '../usecase/interface/IRaceDataUseCase';
import { IPlaceDataUseCase } from '../usecase/interface/IPlaceDataUseCase';
import { NarPlaceData } from '../domain/narPlaceData';

/**
 * 地方競馬のレース情報コントローラー
 */
@injectable()
export class NarRaceController {
    public router: Router;

    constructor(
        @inject('IRaceCalendarUseCase') private raceCalendarUseCase: IRaceCalendarUseCase<NarRaceData>,
        @inject('IRaceDataUseCase') private narRaceDataUseCase: IRaceDataUseCase,
        @inject('IPlaceDataUseCase') private narPlaceDataUseCase: IPlaceDataUseCase<NarPlaceData>,
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * ルーティングの初期化
     */
    @Logger
    private initializeRoutes() {
        // Calendar関連のAPI
        this.router.get('/nar/calendar', this.getRacesFromCalendar.bind(this));
        this.router.post('/nar/calendar', this.updateRacesToCalendar.bind(this));
        this.router.delete('/nar/calendar', this.cleansingRacesFromCalendar.bind(this));

        // RaceData関連のAPI
        this.router.post('/nar/race', this.updateRaceDataList.bind(this));

        // PlaceData関連のAPI
        this.router.post('/nar/place', this.updatePlaceDataList.bind(this));
    }

    /**
     * カレンダーからレース情報を取得する
     * @param req
     * @param res
     * @returns
     */
    @Logger
    private async getRacesFromCalendar(req: Request, res: Response) {
        try {
            const { startDate, finishDate } = req.query;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (!startDate || !finishDate) {
                res.status(400).send('startDateとfinishDateは必須です');
                return;
            }

            // カレンダーからレース情報を取得する
            const races = await this.raceCalendarUseCase.getRacesFromCalendar(new Date(startDate as string), new Date(finishDate as string));
            // レース情報を返す
            res.json(races);
        } catch (error) {
            console.error('カレンダーからレース情報を取得中にエラーが発生しました:', error);
            res.status(500).send('サーバーエラーが発生しました');
        }
    }

    /**
     * カレンダーにレース情報を更新する
     * @param req
     * @param res
     * @returns
     */
    @Logger
    private async updateRacesToCalendar(req: Request, res: Response) {
        try {
            const { startDate, finishDate } = req.body;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (!startDate || !finishDate) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // カレンダーにレース情報を更新する
            await this.raceCalendarUseCase.updateRacesToCalendar(new Date(startDate), new Date(finishDate), NAR_SPECIFIED_GRADE_LIST);
            res.status(200).send();
        } catch (error) {
            console.error('カレンダーにレース情報を更新中にエラーが発生しました:', error);
            res.status(500).send('サーバーエラーが発生しました');
        }
    }

    /**
     * カレンダーからレース情報をクレンジングする
     * @param req
     * @param res
     * @returns
     */
    @Logger
    private async cleansingRacesFromCalendar(req: Request, res: Response) {
        try {
            const { startDate, finishDate } = req.body;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (!startDate || !finishDate) {
                res.status(400).send('startDateとfinishDateは必須です');
                return;
            }

            // カレンダーからレース情報をクレンジングする
            await this.raceCalendarUseCase.cleansingRacesFromCalendar(new Date(startDate), new Date(finishDate));
            // レース情報をクレンジングする
            res.status(200).send();
        } catch (error) {
            console.error('カレンダーからレース情報をクレンジング中にエラーが発生しました:', error);
            res.status(500).send('サーバーエラーが発生しました');
        }
    }

    /**
     * レース情報を更新する
     */
    @Logger
    private async updateRaceDataList(req: Request, res: Response) {
        try {
            const { startDate, finishDate } = req.body;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (!startDate || !finishDate) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // レース情報を取得する
            await this.narRaceDataUseCase.updateRaceDataList(new Date(startDate), new Date(finishDate));
            res.status(200).send();
        } catch (error) {
            console.error('レース情報の更新中にエラーが発生しました:', error);
            res.status(500).send('サーバーエラーが発生しました');
        }
    }

    /**
     * 競馬場情報を更新する
     */
    @Logger
    private async updatePlaceDataList(req: Request, res: Response) {
        try {
            const { startDate, finishDate } = req.body;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (!startDate || !finishDate) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // 競馬場情報を取得する
            await this.narPlaceDataUseCase.updatePlaceDataList(new Date(startDate), new Date(finishDate));
            res.status(200).send();
        } catch (error) {
            console.error('競馬場情報の更新中にエラーが発生しました:', error);
            res.status(500).send('サーバーエラーが発生しました');
        }
    }
}