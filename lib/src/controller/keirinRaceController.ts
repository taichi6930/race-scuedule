import { Router } from 'express';
import { injectable } from 'tsyringe';

import { Logger } from '../utility/logger';

/**
 * 競輪のレース情報コントローラー
 */
@injectable()
export class KeirinRaceController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * ルーティングの初期化
     */
    @Logger
    private initializeRoutes(): void {}
}
