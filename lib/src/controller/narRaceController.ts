import { Request, Response, Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { IRaceCalendarUseCase } from '../usecase/interface/IRaceCalendarUseCase';
import { NarRaceData } from '../domain/narRaceData';
import { NAR_SPECIFIED_GRADE_LIST } from '../utility/data/raceSpecific';

@injectable()
export class NarRaceController {
    public router: Router;

    constructor(
        @inject('IRaceCalendarUseCase') private raceCalendarUseCase: IRaceCalendarUseCase<NarRaceData>
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * ルーティングの初期化
     */
    private initializeRoutes() {
        this.router.get('/calendar', this.getRacesFromCalendar.bind(this));
        this.router.post('/calendar', this.updateRacesToCalendar.bind(this));
        this.router.delete('/calendar', this.cleansingRacesFromCalendar.bind(this));
    }

    /**
     * カレンダーからレース情報を取得する
     * @param req
     * @param res
     * @returns
     */
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
}
