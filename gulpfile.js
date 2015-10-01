var gulp = require('gulp');

var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var jshint  = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');


gulp.task('css', function() {
  // Grab the less file, save to main.css
  return gulp.src('public/assets/css/main.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest('public/assets/css'));
});

gulp.task('js', function() {
  return gulp.src(['server.js', 'public/app/*js', 'public/app/**/*.js', 'app/models/*.js'])
    .pipe(jshint())
    .pipe(jscs())                             // enforce style guide
    .pipe(stylish.combineWithHintResults())   // combine with jshint results
    .pipe(jshint.reporter('jshint-stylish'));
});

// task to lint, minify, and concat frontend angular files
gulp.task('angular', function() {
  return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist'));
});

gulp.task('watch', function() {
  // watch the less file and run the css task
  gulp.watch('public/assets/css/*.less', ['css']);

  // watch js files and run lint and run js and angular tasks
  gulp.watch(['server.js', 'public/app/*.js', 'public/app/**/*.js', 'app/models/*.js'], ['js', 'angular']);
});

gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html less',
    env: { 'NODE_ENV': 'development' }
  })
    .on('restart', function () {
      console.log('Restarted!')
    });
});

https://github.com/JacksonGariety/gulp-nodemon

// Main gulp task
gulp.task('default', ['nodemon', 'watch'])
