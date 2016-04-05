const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const webpack = require('webpack');
const uglify = require('gulp-uglify');


/******************************************************************************
 * compress
 * minify bundled app
 ******************************************************************************/
gulp.task('compress', function() {
  return gulp.src('dist/*.js')
    .pipe(uglify({
            mangle: false
          }))
    .pipe(gulp.dest('dist'));
});

/******************************************************************************
 * compressBuild
 * Build & bundle app and then compress it
 ******************************************************************************/
gulp.task('compressBuild',['build'], function(done) {
  return gulp.src('dist/*.js')
    .pipe(uglify({
            mangle: false
          }))
    .pipe(gulp.dest('dist'));
});


/******************************************************************************
 * watch
 * Build the app and watch for source file changes.
 ******************************************************************************/
gulp.task('serve:before', ['watch']);

gulp.task('watch', ['copy.css', 'copy.html'], function(done) {
  watch('app/**/*.css', function(){
    gulp.start('copy.css');
  });
  watch('/app/**/*.html', function(){
    gulp.start('copy.html');
  });
  bundle(true, done);
});


/******************************************************************************
 * build
 * Build the app once, without watching for source file changes.
 ******************************************************************************/
gulp.task('build', ['copy.css', 'copy.html'], function(done) {
  bundle(false, done);
});


/******************************************************************************
 * sass
 * Convert Sass files to a single bundled CSS file. Uses auto-prefixer
 * to automatically add required vendor prefixes when needed.
 ******************************************************************************/
gulp.task('copy.css', function(){
  return gulp.src('app/**/*.css')
    .pipe(gulp.dest('dist'))
});


/******************************************************************************
 * copy.html
 * Copy html files to build directory.
 ******************************************************************************/
gulp.task('copy.html', function(){
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));
});


/******************************************************************************
 * clean
 * Delete previous build files.
 ******************************************************************************/
gulp.task('clean', function(done) {
  del(['dist'], done);
});


/******************************************************************************
 * Bundle
 * Transpiles source files and bundles them into build directory using webpack.
 ******************************************************************************/
function bundle(watch, cb) {
  // prevent gulp calling done callback more than once when watching
  var firstTime = true;

  // load webpack config
  var config = require('./webpack.config.js');

  // https://github.com/webpack/docs/wiki/node.js-api#statstojsonoptions
  var statsOptions = {
    'colors': true,
    'modules': false,
    'chunks': false,
    'exclude': ['node_modules']
  }

  var compiler = webpack(config);
  if (watch) {
    compiler.watch(null, compileHandler);
  } else {
    compiler.run(compileHandler);
  }

  function compileHandler(err, stats){
    if (firstTime) {
      firstTime = false;
      cb();
    }

    // print build stats and errors
    console.log(stats.toString(statsOptions));
  }
}