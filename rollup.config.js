import babel from 'rollup-plugin-babel'
import url from 'rollup-plugin-url'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import sourcemaps from 'rollup-plugin-sourcemaps'
import filesize from 'rollup-plugin-filesize'
import uglify from 'rollup-plugin-uglify'
import postcss from 'rollup-plugin-postcss'
import postcssModules from 'postcss-modules'
import postcssImport from 'postcss-import'
import cssnext from 'postcss-cssnext'

const cssExportMap = {}

export default {
  entry: 'client/src/app.js',
  format: 'iife',
  sourceMap: true,
  plugins: [
    url({
      limit: 10 * 1024, // inline files < 10k, copy files > 10k
      include: ['**/*.svg'] // defaults to .svg, .png, .jpg and .gif files
    }),
    postcss({
      plugins: [
        postcssImport(),
        cssnext(),
        postcssModules({
          getJSON (id, exportTokens) {
            cssExportMap[id] = exportTokens
          }
        })
      ],
      getExport (id) {
        return cssExportMap[id]
      }
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        'node_modules/react/react.js': ['PropTypes', 'Component'],
        'node_modules/victory-chart/lib/index.js': ['VictoryArea', 'VictoryBar']
      }
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    sourcemaps(),
    filesize(),
    process.env.NODE_ENV === 'production' && uglify()
  ],
  dest: 'client/dist/app.bundle.js' // equivalent to --output
}
