/* eslint-disable */
export default {
  displayName: 'api-core',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: false, decorators: true },
          transform: {
            react: { runtime: 'automatic' },
            legacyDecorator: true,
            decoratorMetadata: true,
          },
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/api-utils/api-core',
};
