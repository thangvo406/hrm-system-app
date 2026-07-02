// FIXME: https://github.com/import-js/eslint-plugin-import/issues/3169
declare module 'eslint-plugin-import' {
  import type { Linter } from 'eslint';

  export const flatConfigs: {
    [key: string]: Linter.Config | undefined;
    recommended: Linter.Config;
    typescript: Linter.Config;
  };
}

declare module '*.png' {
  const content: number;
  export default content;
}

declare module '*.webp' {
  const content: number;
  export default content;
}

declare module '*.svg' {
  import type React from 'react';
  import type { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}
