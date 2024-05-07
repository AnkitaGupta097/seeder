const config = {
    preset: 'ts-jest',
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage',
    collectCoverageFrom: ['src/**/*.ts'],
    globalSetup: '<rootDir>/jestSetup.ts',
    globalTeardown: '<rootDir>/jestTeardown.ts',
};


module.exports = config;