import { Options } from 'tsup';

const config: Options = {
  entry: ['src/index.tsx'],
  dts: true,
  sourcemap: true,
  format: ['cjs', 'esm'],
  minify: true,
  clean: true,
};

export default config;
