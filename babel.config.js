/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@hooks': './src/hooks',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@services': './src/services',
          '@tests': './src/tests',
          '@translations': './src/translations',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        root: ['./src'],
      },
    ],
    '@babel/plugin-transform-export-namespace-from',
    'react-native-worklets/plugin', // need to be the last plugin
  ],
  presets: ['module:@react-native/babel-preset'],
};
