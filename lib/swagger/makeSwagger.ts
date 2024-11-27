import swaggerAutogen from 'swagger-autogen';

const translateFiles = [
    {
        raceType: 'jra',
        outputPath: './output-jra.json',
        controllerPath: '../src/controller/jraRaceController.ts',
    },
    {
        raceType: 'nar',
        outputPath: './output-nar.json',
        controllerPath: '../src/controller/narRaceController.ts',
    },
    {
        raceType: 'world',
        outputPath: './output-world.json',
        controllerPath: '../src/controller/worldRaceController.ts',
    },
    {
        raceType: 'keirin',
        outputPath: './output-keirin.json',
        controllerPath: '../src/controller/keirinRaceController.ts',
    },
    {
        raceType: 'boatrace',
        outputPath: './output-boatrace.json',
        controllerPath: '../src/controller/boatraceRaceController.ts',
    },
    {
        raceType: 'autorace',
        outputPath: './output-autorace.json',
        controllerPath: '../src/controller/autoraceRaceController.ts',
    },
]; // エンドポイントの定義ファイル

translateFiles.forEach((file) => {
    const doc = {
        info: {
            title: `API Documentation for ${file.raceType}`,
            description: `Generated API documentation for ${file.raceType}`,
            version: '1.0.0',
        },
        host: 'localhost:3000', // サーバーホスト
        basePath: `/api/races/${file.raceType}`, // 各 API のベースパス
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
    };

    try {
        console.log(`Generating Swagger file for ${file.raceType}...`);
        swaggerAutogen(file.outputPath, [file.controllerPath], doc);
        console.log(`Swagger file created: ${file.outputPath}`);
    } catch (error) {
        console.error(
            `Error generating Swagger file for ${file.raceType}:`,
            error,
        );
    }
});
