export function Logger(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        console.log(`[${target.constructor.name}.${propertyKey}] 開始`);
        try {
            const result = await originalMethod.apply(this, args);
            console.log(`[${target.constructor.name}.${propertyKey}] 終了`);
            return result;
        } catch (error) {
            console.error(
                `[${target.constructor.name}.${propertyKey}] エラー`,
                error,
            );
            throw error;
        }
    };
}

// cdkで保存したENVがproductionの場合、console.errorをオーバーライドする
if (process.env.IS_DEBUG === 'false') {
    console.debug = function () {};
}
