/*!
 * tribble - gulpfile.js
 * MIT License (c) 2015
 * https://github.com/codenameyau/tribble
 */
'use strict';


/********************************************************************
* DEPENDENCIES
*********************************************************************/
var gulp = require('gulp');
var gulpif = require('gulp-if');
var useref = require('gulp-useref');
var mincss = require('gulp-minify-css');
var minjson = require('gulp-jsonminify');
var minhtml = require('gulp-minify-html');
var uglify = require('gulp-uglify');
var rimraf = require('rimraf');


/********************************************************************
* DEFINITIONS
*********************************************************************/
var PATH = {
  src: 'public/',
  dest: 'build/',
};

var HTML_OPTS = {
  empty: true,
  comments: false,
  spare: false,
  quotes: false,
  loose: false,
};


/********************************************************************
* GULP TASKS
*********************************************************************/
gulp.task('clean', function(cb) {
  rimraf(PATH.dest, cb);
});

gulp.task('copy', function() {
  gulp.src([
    PATH.src + 'templates/**/*.html',
    PATH.src + 'app/data/**/*',
    PATH.src + 'app/img/**/*',
    PATH.src + 'projects/images/**/*',
  ], {base: PATH.src})
  .pipe(gulpif('*.json', minjson()))
  .pipe(gulp.dest(PATH.dest));
});

gulp.task('pipeline', function() {
  var assets = useref.assets();
  return gulp.src(PATH.src + 'index.html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', mincss()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulpif('*.html', minhtml(HTML_OPTS)))
    .pipe(gulp.dest(PATH.dest));
});

gulp.task('build', ['pipeline', 'copy']);

gulp.task('default', ['build']);
