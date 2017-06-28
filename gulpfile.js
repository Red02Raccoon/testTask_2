const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const wait = require('gulp-wait');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-csso');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const del = require('del');
const runSequence = require('run-sequence');


/* ------ Конфигурация и настройка сборки  -------- */
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';


// Запускаем сервер. Предварительно выполнив задачи ['html', 'styles', 'images', ...
// ] Сервер наблюдает за папкой "./dist". Здесь же
gulp.task('browser-sync', ['html', 'styles', 'images', 'fonts'], function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  browserSync.watch(['./dist/**/*.*', '!**/*.css'], browserSync.reload);
})

// переносим html файлы
gulp.task('html', function() {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'))
});

// переносим fonts файлы
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'))
});

// перенос картинок
gulp.task('images', function() {
  return gulp.src('app/images/**/*.*')
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('styles', function() {
  return gulp.src('app/styles/main.scss')
    .pipe(wait(500))
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: 'Style',
          message: err.message
        }
      })
    }))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename({
      suffix: '.min'
    }))
/*    .pipe(minifycss())*/
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream())
})


gulp.task('watch', function() {
  gulp.watch("app/**/*.html", ['html']);
  gulp.watch("app/styles/**/*.scss", ['styles']);
  gulp.watch("app/images/**/*.*", ['images']);
})


gulp.task('default', ['browser-sync', 'watch']);


gulp.task('clean', function() {
  return del(['dist'], {
    force: true
  }).then(paths => {
    console.log('Deleted files and folders: in dist');
  });
})


//Выполнить сборку проекта
gulp.task('build', function(cb) {
  runSequence(
    ['clean'], ['html', 'styles', 'images', 'fonts'],
    cb
  );
});
