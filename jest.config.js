const config = {
    preset: 'ts-jest',
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage',
    collectCoverageFrom: ['src/**/*.ts']
};
module.exports = config;