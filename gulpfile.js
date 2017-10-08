'use strict';

const page = ['index'];

// Define Gulp Plugins

const   gulp = require('gulp'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    plumber = require('gulp-plumber'),
    fileSystem = require('fs'),
    gulpSequence = require('gulp-sequence'),
    rename = require('gulp-rename'),
    minify = require('gulp-minifier'),

    pug = require('gulp-pug'),
    yaml = require('gulp-yaml'),
    mergeJson = require('gulp-merge-json'),
    w3cjs = require('gulp-w3cjs'),
    html_prettify = require('gulp-html-prettify'),

    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');

// _______________________________SETUP_______________________________________


// Brower sync
gulp.task('browser-sync', function () {
    return browserSync.init({
        server: {
            baseDir: 'dist'
        },
        open: false
    });
});

// Clean
gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('clean-production', function () {
    return del(['production']);
});

// _______________________________VENDOR______________________________________

gulp.task('vendor', function () {
    gulp.src('app/vendor/*/**')
        .pipe(gulp.dest('dist/vendor'));
});

gulp.task('vendor-export', function () {
    gulp.src('app/vendor/*/**')
        .pipe(gulp.dest('production/release/vendor'));
});
// _______________________________BUILD HTML___________________________________

const views_options = {
    prettify: {
        'indent_size': 2,
        'unformatted': ['pre', 'code'],
        'indent_with_tabs': false,
        'preserve_newlines': true,
        'brace_style': 'expand',
        'end_with_newline': true,
        'indent_char': ' ',
        'space_before_conditional': true,
        'wrap_attributes': 'auto'
    }
};

gulp.task('yaml-json', function () {
    return gulp.src(['app/**/*.yml'])
        .pipe(plumber())
        .pipe(yaml({ schema: 'DEFAULT_SAFE_SCHEMA' }))
        .pipe(mergeJson({
            fileName: 'data.json',
            json5: false
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('.tmp'));
});

gulp.task('views', function () {
    const data = JSON.parse(fileSystem.readFileSync('.tmp/data.json'));
    return gulp.src('app/*.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true, locals: data}))
        .pipe(w3cjs())
        .pipe(w3cjs.reporter())
        .pipe(html_prettify(views_options.prettify))
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist'));
});

gulp.task('views-only', function (done) {
    const data = JSON.parse(fileSystem.readFileSync('.tmp/data.json'));
    const pathPage = [];
    for (var i = 0; i < page.length; i++) {
        pathPage.push("app/" + page[i] + '.pug');
    }
    console.log(pathPage);
    gulp.src(pathPage)
        .pipe(plumber())
        .pipe(pug({pretty: true, locals: data}))
        .pipe(html_prettify(views_options.prettify))
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist'))
        .on('end', done)
});

gulp.task('html-build', function (cb) {
    return gulpSequence(
        'yaml-json',
        'views',
        cb
    );
});

gulp.task('html-build-only', function (cb) {
    return gulpSequence(
        'yaml-json',
        'views-only',
        cb
    );
});

gulp.task('views-export', function () {
    const data = JSON.parse(fileSystem.readFileSync('.tmp/data.json'));
    return gulp.src(['app/*.pug', '!app/sample.pug'])
        .pipe(pug({pretty: true, locals: data}))
        .pipe(html_prettify(views_options.prettify))
        .pipe(gulp.dest('production/release'));
});

gulp.task('build-html-export', function (cb) {
    return gulpSequence(
        'yaml-json',
        'views-export',
        cb
    );
});

// _______________________________BUILD CSS_________________________________

const AUTOPREFIXER_BROWSERS = [
    'ie >= 1',
    'ie_mob >= 1',
    'ff >= 1',
    'chrome >= 1',
    'safari >= 1',
    'opera >= 1',
    'ios >= 1',
    'android >= 1',
    'bb >= 1'
];

gulp.task('css-build', function () {
    return gulp
        .src('app/scss/*.scss')
        .pipe(plumber())
        .pipe(sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(plumber.stop())
        .pipe(autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS,
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true,
            minifyCSS: true,
            getKeptComment: function (content, filePath) {
                var m = content.match(/\/\*![\s\S]*?\*\//img);
                return m && m.join('\n') + '\n' || '';
            }
        }))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('css-export', function () {
    return gulp
        .src('app/scss/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS,
            cascade: false
        }))
        .pipe(gulp.dest('production/release/css'))
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true,
            minifyCSS: true,
            getKeptComment: function (content, filePath) {
                var m = content.match(/\/\*![\s\S]*?\*\//img);
                return m && m.join('\n') + '\n' || '';
            }
        }))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('production/release/css'));
});

// Color CSS

gulp.task('colors-build', function () {
    return gulp
        .src('app/scss/colors/*.scss')
        .pipe(plumber())
        .pipe(sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(plumber.stop())
        .pipe(autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS,
            cascade: false
        }))
        .pipe(gulp.dest('dist/css/colors'))
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true,
            minifyCSS: true,
            getKeptComment: function (content, filePath) {
                var m = content.match(/\/\*![\s\S]*?\*\//img);
                return m && m.join('\n') + '\n' || '';
            }
        }))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/css/colors'));
});

gulp.task('colors-export', function () {
    return gulp
        .src('app/scss/colors/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS,
            cascade: false
        }))
        .pipe(gulp.dest('production/release/css/colors'))
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true,
            minifyCSS: true,
            getKeptComment: function (content, filePath) {
                var m = content.match(/\/\*![\s\S]*?\*\//img);
                return m && m.join('\n') + '\n' || '';
            }
        }))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('production/release/css/colors'));
});

gulp.task('build-css-export', function (cb) {
    return gulpSequence(
        'css-export',
        'colors-export',
        cb
    );
});

// _______________________________BUILD JS_________________________________

gulp.task('js-build', function () {
    return gulp.src(['app/js/**/*.js'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/js'))
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true,
            minifyCSS: true,
            getKeptComment: function (content, filePath) {
                var m = content.match(/\/\*![\s\S]*?\*\//img);
                return m && m.join('\n') + '\n' || '';
            }
        }))
        .pipe(rename({suffix:'.min'}))
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('js-export', function () {
    return gulp.src(['app/js/**/*.js'])
        .pipe(plumber())
        .pipe(gulp.dest('production/release/js'))
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true,
            minifyCSS: true,
            getKeptComment: function (content, filePath) {
                var m = content.match(/\/\*![\s\S]*?\*\//img);
                return m && m.join('\n') + '\n' || '';
            }
        }))
        .pipe(rename({suffix:'.min'}))
        .pipe(plumber.stop())
        .pipe(gulp.dest('production/release/js'));
});

gulp.task('build-js-export', function (cb) {
    return gulpSequence(
        'js-export',
        cb
    );
});


// _______________________________BUILD FONTS_________________________________


gulp.task('fonts-build', function () {
    return gulp.src(['app/fonts/*'])
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('fonts-export', function () {
    return gulp.src(['app/fonts/*'])
        .pipe(gulp.dest('production/release/fonts'));
});

// _______________________________BUILD IMAGES________________________________

gulp.task('images-build', function(cb) {
    gulp.src(['app/images/**/*'])
        .pipe(gulp.dest('dist/images')).on('end', cb).on('error', cb);
});

gulp.task('favicon-build', function(cb) {
    gulp.src(['app/*.png'])
        .pipe(gulp.dest('dist')).on('end', cb).on('error', cb);
});

gulp.task('favicon-export', function(cb) {
    gulp.src(['app/*.png'])
        .pipe(gulp.dest('production/release')).on('end', cb).on('error', cb);
});

gulp.task('images-export', function(cb) {
    gulp.src(['app/images/**/*'])
        .pipe(gulp.dest('production/release')).on('end', cb).on('error', cb);
});

// _______________________________BUILD INCLUDE________________________________

gulp.task('includes-build', function () {
    gulp.src('app/includes/*')
        .pipe(gulp.dest('dist/includes'));
});

gulp.task('includes-export', function () {
    gulp.src('app/includes/*')
        .pipe(gulp.dest('production/release/includes'));
});


// _______________________________WATCH FILES__________________________________

gulp.task('watch', function () {

    // Watch .pug files
    gulp.watch(
        ['app/views/*.pug', 'app/views/**/*.pug', 'app/views/**/*.yml', 'app/*.pug'],
        ['html-build-only', browserSync.reload]
    );

    // Watch .scss files
    gulp.watch(['app/scss/**/*.scss', 'app/scss/*.scss'], ['css-build', browserSync.reload]);

    // Watch .js files
    gulp.watch('app/js/**/*.js', ['js-build', browserSync.reload]);

    // Watch image files
    gulp.watch(['app/images/**/*', 'app/images/icons/*'], ['images-build', browserSync.reload]);

});

// _______________________________MAIN TASKS___________________________________

gulp.task('build-dev', function (cb) {
    return gulpSequence(
        'vendor', 'css-build', 'colors-build', 'fonts-build', 'images-build', 'favicon-build', 'js-build', 'html-build',
        cb
    );
});

gulp.task('build-export', function (cb) {
    return gulpSequence(
        'vendor-export', 'fonts-export', 'images-export', 'favicon-export', 'build-css-export', 'build-js-export',
        'build-html-export',
        cb
    );
});

gulp.task('default',function (cb) {
    return gulpSequence(
        'clean',
        'build-dev',
        'watch',
        'browser-sync',
        cb
    );
});

gulp.task('build',function (cb) {
    return gulpSequence(
        'clean-production',
        'build-export',
        cb
    );
});

gulp.task('check',function (cb) {
    return gulpSequence(
        'watch',
        'browser-sync',
        cb
    );
});