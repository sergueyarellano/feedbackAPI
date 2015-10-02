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
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');

gulp.task('css', function() {
  // Grab the less file, save to main.css
  return gulp.src('public/assets/css/main.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(livereload());
});

gulp.task('js', function() {
  return gulp.src(['server.js', 'public/app/*js', 'public/app/**/*.js', 'app/models/*.js'])
    .pipe(jshint())
    .pipe(jscs())                             // enforce style guide
    .pipe(stylish.combineWithHintResults())   // combine with jshint results
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(livereload());
});

gulp.task('html', function()  {
  gulp.src('./app/**/*.html')
    .pipe(livereload());
});

// task to lint, minify, and concat frontend angular files
gulp.task('angular', function() {
  return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist'))
    .pipe(livereload());
});

//  Busca en  las carpetas  de  estilos y javascript  los archivos
//  para  inyectarlos en  el  index.html
gulp.task('inject', function()  {
  return  gulp.src('index.html',  {cwd: 'public/app/views'})
    .pipe(inject(
        gulp.src(['public/app/assets/js/*.js']).pipe(angularFilesort()),  {
        read: false,
        ignorePath: 'public/app/views'
    }))
    .pipe(inject(
      gulp.src(['public/app/assets/css/*.css']), {
        read: false,
        ignorePath: 'public/app/views'
      }
    ))
    .pipe(gulp.dest('public/app/views'));
});

gulp.task('wiredep',  function  ()  {
  gulp.src('public/app/views/index.html')
    .pipe(wiredep({
      directory:  'public/assets/libs'
    }))
    .pipe(gulp.dest('public/app/views'));
});

gulp.task('watch', function() {
  livereload.listen();
  // watch the less file and run the css task
  gulp.watch('public/assets/css/*.less', ['css', 'inject']);
  livereload.listen();
  gulp.watch(['public/app/views/*.html', 'public/app/views/**/*.html'],['html']);
  gulp.watch(['bower.json'],  ['wiredep']);
  livereload.listen();
  gulp.watch(['server.js', 'public/app/*.js', 'public/app/**/*.js', 'app/models/*.js'], ['js', 'angular', 'inject']);
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
gulp.task('default', ['nodemon', 'watch', 'inject', 'wiredep']);
