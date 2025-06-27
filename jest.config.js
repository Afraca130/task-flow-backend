module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    // File extensions and transform settings
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    // Transform rules
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.json',
            },
        ],
    },

    // Test file patterns
    testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],

    // Files to ignore
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],

    // Files not to transform
    transformIgnorePatterns: ['/node_modules/(?!(.*\\.mjs$))'],

    // Module name mapping
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@domain/(.*)$': '<rootDir>/src/domain/$1',
        '^@application/(.*)$': '<rootDir>/src/application/$1',
    },

    // Module resolution
    moduleDirectories: ['node_modules', 'src'],

    // Coverage settings
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/*.spec.ts', '!src/**/*.test.ts'],

    // Root directory
    rootDir: '.',

    // Cache settings
    cache: false,

    // Timeout
    testTimeout: 30000,

    // Clear mocks
    clearMocks: true,

    // Verbose output
    verbose: true,
};
