var gulp = require('gulp')
var less = require('gulp-less')
var nodemon = require('gulp-nodemon')
var jshint  = require('gulp-jshint')


gulp.task('css', function() {

  // Grab the less file, process the less, save to style.css
  return gulp.src('public/assets/css/style.less')
    .pipe(less())
    .pipe(gulp.dest('public/assets/css'));
});



gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html'
  })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function () {
      console.log('Restarted!')
    });
});

// Main gulp task
gulp.task('default', ['nodemon'])
