import dotenv from 'dotenv';

dotenv.config();

const allowedEnvs = [
    'PRODUCTION', // 本番環境
    'ITa', // ITA環境
    'LOCAL', // ローカル環境
    'GITHUB_ACTIONS_CI', // GitHub Actions CI環境 HTML取得のテストをスキップするため
] as const;

type EnvType = (typeof allowedEnvs)[number];

function getEnv(env: string | undefined): EnvType {
    if (env == null || !allowedEnvs.includes(env as EnvType)) {
        throw new Error(
            `Invalid ENV value: ${env ?? 'undefined'}. Allowed values are: ${allowedEnvs.join(', ')}`,
        );
    }
    return env as EnvType;
}

export const ENV = getEnv(process.env.ENV);
