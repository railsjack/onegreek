var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var ngAnnotate = require('gulp-ng-annotate');
var argv = require('yargs').argv;

var paths = {
    sass: ['./app/scss/**/*.scss'],
    js: ['./app/js/**/*.js'],
    html: ['./app/html/**/*.html']
};

gulp.task('publish-config', function(done) {
    gulp.src(['./app/config/'+( argv.env || 'local' )+'.js'])
        .pipe(concat('config.js'))
        .pipe(gulp.dest('./www/js'))
        .on('end', done);});

gulp.task('compile', function(done) {
    gulp.start('compilejs', 'copyviews', 'sass');
});

gulp.task('compilejs', function(done) {
    gulp.src(['./app/js/**/*.js'])
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./www/js'))
        .on('end', done);;

});

gulp.task('copyviews', function(done) {
    gulp.src(['./app/html/**/*.html'])
        .pipe(gulp.dest('./www/views'))
        .on('end', done);
    ;
});

gulp.task('sass', function(done) {
    gulp.src('./app/scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['compilejs']);
    gulp.watch(paths.html, ['copyviews']);
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('default', ['compile']);

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '    ' + gutil.colors.red('Git is not installed.'),
            '\n    Git, the version control system, is required to download Ionic.',
            '\n    Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n    Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
