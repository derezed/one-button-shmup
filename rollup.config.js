import serve from 'rollup-plugin-serve';
import buble from '@rollup/plugin-buble';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import builtins from 'rollup-plugin-node-builtins';

export default {
  input: 'src/assets/main.js',
  output: {
    format: 'iife',
    name: 'index',
    file: 'src/web/compiled/main.bundle.js'
  },
  plugins: [
    serve('src'),
    builtins(),
    nodeResolve({
      browser: true,
      preferBuiltins: true
    }),
    commonjs({
      namedExports: {
          'resource-loader': ['Resource']
      }
    }),
    buble(),
    nodePolyfills(),
  ],
  watch: {
    clearScreen: false,
  }
}