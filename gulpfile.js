var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');

gulp.task('sass', function() {
    gulp.src('src/css/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    gulp.src('src/js/app.js')
        .pipe(jshint())
    	.pipe(jshint.reporter('default'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(browserSync.stream());
});

gulp.task('serve', function() {
    browserSync.init({
        server: "./"
    });
});

gulp.task('default', ['serve', 'sass', 'js'], function () {
    gulp.watch('src/css/**/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('./**/*.html').on('change', browserSync.reload);
});
