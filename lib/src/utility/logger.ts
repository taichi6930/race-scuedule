export function Logger<T>(
    target: T,
    propertyKey: string,
    descriptor: PropertyDescriptor,
) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: unknown[]) {
        const constructorName = Object.getPrototypeOf(this).constructor.name;
        console.log(`[${constructorName}.${propertyKey}] 開始`);
        try {
            const result = await originalMethod.apply(this, args);
            console.log(`[${constructorName}.${propertyKey}] 終了`);
            return result;
        } catch (error) {
            console.error(
                `[${constructorName}.${propertyKey}] エラー`,
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
