import gulp from 'gulp';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import stylelint from "stylelint";
import reporter from "postcss-reporter";
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import eslint from "gulp-eslint";
import sync from 'browser-sync';
import autoprefixer from 'autoprefixer';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import babelify from 'babelify';
import watchify from 'watchify';

gulp.task('css', () => {
  return gulp.src('src/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(postcss([
      autoprefixer(),
      require('postcss-nested'),
      require('postcss-custom-properties'),
      require('postcss-calc'),
      stylelint(),
      reporter({clearMessages: true}),
      require('cssnano'),
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/css'));
});

function lintJS() {
  return gulp.src('src/js/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function bundle(watching = false) {
  const b = browserify({
    entries: ['src/js/main.js'],
    transform: ['babelify'],
    debug: true,
    plugin: (watching) ? [watchify] : null
  })
  .on('update', () => {
    bundler();
  });

  function bundler() {
    lintJS();
    return b.bundle()
      .on('error', (err) => {
        console.log(err.message);
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest('public/js/'));
  }
  return bundler();
}

gulp.task('js', () => {
  bundle();
});

gulp.task('build', ['css', 'js']);

gulp.task('watch', () => {
  bundle(true);
  gulp.watch('src/css/*.css', ['css']);
});

gulp.task('server', ['watch'], () => {
  sync({
    notify: false,
    port: 8000,
    server: {
      baseDir: './public'
    }
  });

  gulp.watch([
    'public/*.html',
    'public/**/*.css',
    'public/**/*.js'
  ]).on('change', sync.reload);
});

gulp.task('default', ['build', 'server']);