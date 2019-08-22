import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
// import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const external = id => !id.startsWith('.') && !id.startsWith('/');

const input = 'src/index.jsx';

const buildEs = {
  input,
  external,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [resolve(), commonjs()]
};

export default buildEs;
