const gulp = require('gulp');
const fs = require('fs');
const browserify = require('browserify');
const babelify = require('babelify');

gulp.task('default', function() {
  return browserify({debug: true})
      .transform(babelify)
      .require('./js/src/app.js', {entry: true})
      .bundle()
      .on('error', function(err) { console.log('Error: ' + err.message); })
      .pipe(fs.createWriteStream('./js/dist/app.js'));
});

gulp.watch('js/src/**/*.js', ['default']);
