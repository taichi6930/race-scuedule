/* eslint-disable */
module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['lib/src/**/*.ts'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        'logger.ts',
        'lib/src/utility/env.ts',
        // TODO: データ用意が大変なので一旦除外、どこかでテストしたい
        'lib/src/repository/implement/autorace.*.ts',
        'lib/src/repository/implement/boatrace.*.ts',
        'lib/src/repository/implement/keirin.*.ts',
        'lib/src/repository/implement/worldRaceRepositoryFromHtmlImpl.ts',
        'lib/src/repository/implement/narRaceRepositoryFromHtmlImpl.ts',
        'lib/src/repository/implement/narPlaceRepositoryFromHtmlImpl.ts',
        'lib/src/repository/implement/jraRaceRepositoryFromHtmlImpl.ts',
        'lib/src/repository/implement/jraPlaceRepositoryFromHtmlImpl.ts',
    ],
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': ['@swc/jest'],
    },
};
