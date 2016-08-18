'use strict';

var gulp      = require('gulp'),
  concat    = require('gulp-concat'),
  util      = require('gulp-util'),
  watch     = require('gulp-watch'),
  rename    = require('gulp-rename'),
  sass      = require('gulp-sass'),
  uglifycss = require('gulp-uglifycss'),
  maps      = require('gulp-sourcemaps')
  ;
var log = util.log;

var scss_files = [
  './css/main.scss'
];

gulp.task('compile-sass', function() {
  return gulp.src(scss_files)
    .pipe(maps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat('all.min.css'))

    .pipe(maps.write('./'))
    .pipe(gulp.dest('./css/compiled'));
});

gulp.task('watch', function() {

  gulp
    .watch('./css/**/*.scss', ['compile-sass'])
    .on('change', logWatch)
    .on('error', logError);

  function logWatch(event) {
    log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
  }

  function logError(error) {
    console.log(error.toString());

    this.emit('end');
  }
});

gulp.task('default', [], function() {
  console.log("This is the default task!");
});