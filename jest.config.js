/* eslint-disable */
module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['lib/src/**/*.ts'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        'logger.ts',
        'lib/src/utility/env.ts',
        // lib/src/repository/implement配下はテスト対象外
        'lib/src/repository/implement',
    ],
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': ['@swc/jest'],
    },
};