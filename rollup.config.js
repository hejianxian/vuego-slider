import vue from 'rollup-plugin-vue';
import babel from 'rollup-plugin-babel';

const pkg = require('./package.json');
const banner =
  '/**\n' +
  ' * ' + pkg.name + '.js v' + pkg.version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' ' + pkg.author + '\n' +
  ' * Released under the MIT License.\n' +
  ' */\n';

export default {
  input: 'src/install.js',
  output: {
    name: 'VuegoSlider',
    globals: ['Hammer'],
    format: 'iife',
    file: 'dist/vuego-slider.js',
    banner: banner,
  },
  external: ['hammerjs'],
  plugins: [
    vue(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
