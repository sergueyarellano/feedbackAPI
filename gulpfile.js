var gulp            = require('gulp'),
    less            = require('gulp-less'),
    server          = require('tiny-lr')(),
    minifyCSS       = require('gulp-minify-css'),
    rename          = require('gulp-rename'),
    concat          = require('gulp-concat'),
    jshint          = require('gulp-jshint'),
    jscs            = require('gulp-jscs'),
    stylish         = require('gulp-jscs-stylish'),
    uglify          = require('gulp-uglify'),
    ngAnnotate      = require('gulp-ng-annotate'),
    nodemon         = require('gulp-nodemon'),
    notify          = require('gulp-notify'),
    refresh         = require('gulp-livereload'),
    wiredep         = require('wiredep').stream,
    inject          = require('gulp-inject'),
    angularFilesort = require('gulp-angular-filesort'),
    lrPort          = 3000;

var paths = {
  styles: ['public/assets/css/*.less'],
  scripts: [
    'server.js',
    'public/app/*js',
    'public/app/**/*.js',
    'app/models/*.js'
  ],
  html: [
    'public/app/views/*.html',
    'public/app/views/pages/*.html'
  ],
  assets: ['public/assets/css'],
  angular: ['public/app/*.js', 'public/app/**/*.js'],
  dist: ['public/dist']
};

gulp.task('css', function() {
  return gulp.src(paths.styles)
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest(paths.assets))
    .pipe(refresh(server));
});

gulp.task('js', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jscs())
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(refresh(server));
});

gulp.task('html', function()  {
  gulp.src(paths.html)
    .pipe(refresh(server));
});

gulp.task('angular', function() {
  return gulp.src(paths.angular)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist))
    .pipe(refresh(server));
});

gulp.task('inject', function()  {
  var sources = gulp.src(['./public/assets/script/*.js','./public/assets/css/*.css']);
  return  gulp.src('index.html',  {cwd: './public/app/views'})
    .pipe(inject(sources, {
      read: false,
      ignorePath: 'public/app/views'
    }))
    .pipe(gulp.dest('public/app/views'))
});

gulp.task('wiredep',  function  ()  {
  gulp.src('./public/app/views/index.html')
    .pipe(wiredep({
      directory:  './public/assets/libs'
    }))
    .pipe(gulp.dest('./public/app/views'));
});

gulp.task('watch', function() {
  refresh.listen();
  // watch the less file and run the css task
  gulp.watch('public/assets/css/*.less', ['css', 'inject']);
  refresh.listen();
  gulp.watch(['public/app/views/*.html', 'public/app/views/**/*.html'],['html']);
  gulp.watch(['bower.json'],  ['wiredep']);
  refresh.listen();
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

// Main gulp task
gulp.task('default', ['nodemon', 'watch', 'inject', 'wiredep']);

// https://gist.github.com/Hendrixer/9939346   gulpfile
