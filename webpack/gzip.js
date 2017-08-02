const gulp = require('gulp');
const gzip = require('gulp-gzip');

gulp.task('gzip', () => {
  if (process.env.GZIP !== 'false') {
    return setTimeout(() =>
      gulp.src(
        [
          './build/**/*.html',
          './build/**/*.js',
          './build/**/*.json',
          './build/**/*.css',
          './build/**/*.svg',
          './build/**/*.ico',
        ]
      )
      .pipe(gzip({ append: false }))
      .pipe(gulp.dest('./build/'))

    , 100);
  }
});