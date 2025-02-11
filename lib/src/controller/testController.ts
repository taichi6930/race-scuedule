import { Request, Response, Router } from 'express';
import * as sqlite3 from 'sqlite3';

import { Logger } from '../utility/logger';

export class TestController {
    public router: Router;
    private readonly db: sqlite3.Database;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
        this.db = new sqlite3.Database('/mnt/sqlite/database.db');
        try {
            console.log('SQLite3 successfully loaded:', this.db);
        } catch (error) {
            console.error('Failed to load SQLite3:', error);
        }
    }

    /**
     * ルーティングの初期化
     */
    @Logger
    private initializeRoutes(): void {
        // Calendar関連のAPI
        this.router.get('/db', (req: Request, res: Response) =>
            this.getData(req, res),
        );
    }

    /**
     * データベースからデータを取得する
     * @param req リクエスト
     * @param res レスポンス
     */
    @Logger
    private async getData(req: Request, res: Response): Promise<void> {
        console.log(req);
        console.log(res);
        await this.selectData();
    }

    createTable(): void {
        this.db.serialize(() => {
            this.db.run('CREATE TABLE lorem (info TEXT)');
        });
    }

    // データの挿入
    insertData(): void {
        this.db.serialize(() => {
            const stmt = this.db.prepare('INSERT INTO lorem VALUES (?)');
            for (let i = 0; i < 10; i++) {
                stmt.run('Ipsum ' + i);
            }
            stmt.finalize();
        });
    }

    // データの取得
    async selectData(): Promise<void> {
        this.db.each(
            'SELECT rowid AS id, info FROM lorem',
            (err: Error, row: { id: number; info: string }) => {
                console.log(row.id + ': ' + row.info);
            },
        );
        await new Promise<void>((resolve, reject) => {
            this.db.each(
                'SELECT rowid AS id, info FROM lorem',
                (err: Error, row: { id: number; info: string }) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(row.id + ': ' + row.info);
                    }
                },
                (err: Error, count: number) => {
                    console.log('count:', count);
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                },
            );
        });
        this.close();
    }

    // データベースのクローズ
    close(): void {
        this.db.close();
    }
}
