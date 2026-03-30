/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg?react' {
  import { type FC, type SVGProps } from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

declare module '*.svg' {
  import { type FC, type SVGProps } from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}