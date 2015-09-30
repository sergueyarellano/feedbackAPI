var gulp = require('gulp');
var stylus = require('gulp-stylus');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var jshint  = require('gulp-jshint');
var stylish = require('gulp-jscs-stylish');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jscs = require('gulp-jscs');
var ngAnnotate = require('gulp-ng-annotate');
var nodemon = require('gulp-nodemon');


gulp.task('css', function() {
  // Grab the stylus file, save to main.css
  return gulp.src('public/assets/css/main.styl')
    .pipe(stylus({ use: nib() }))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest('public/assets/css'));
});

gulp.task('js', function() {
  return gulp.src(['server.js', 'public/app/*js', 'public/app/**/*.js', 'app/*.js', 'app/**/*.js'])
    .pipe(jshint())                           // hint (optional)
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
  gulp.watch('public/assets/css/*.styl', ['css']);

  // watch js files and run lint and run js and angular tasks
  gulp.watch(['server.js', 'public/app/*.js', 'public/app/**/*.js', './gulpfile.js', 'app/*.js', 'app/**/*.js'], ['js', 'angular']);
});

gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html styl'
  })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function () {
      console.log('Restarted!')
    });
});

// Main gulp task
gulp.task('default', ['nodemon'])
