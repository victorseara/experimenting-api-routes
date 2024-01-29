/* eslint-disable */
export default {
  displayName: 'company-settings',
  preset: '../../../jest.preset.js',

  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true,
            legacyDecorators: true,
          },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageDirectory: '../../../coverage/libs/pages/company-settings',
};
