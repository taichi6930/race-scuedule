const allowedEnvs = [
    'production', // 本番環境
    'ita', // ITA環境
    'local', // ローカル環境
] as const;
type EnvType = (typeof allowedEnvs)[number];

function getEnv(env: string | undefined): EnvType {
    if (env == null || !allowedEnvs.includes(env as unknown as EnvType)) {
        throw new Error(
            `Invalid ENV value: ${env ?? 'undefined'}. Allowed values are: ${allowedEnvs.join(', ')}`,
        );
    }
    return env as EnvType;
}

export const ENV = getEnv(process.env.ENV);
