const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat')
const terser = require('gulp-terser');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));



const cleanDist = () => {
    return gulp.src('./dist', {read: false})
    .pipe(clean())
}

const dev = () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch('./src/**/*', gulp.series(cleanDist, gulp.parallel(html, js, scss, images), (next) => {
        browserSync.reload();
        next();
    }))
}

const html = () => {
    return gulp.src("./src/**/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./dist'))
}

const js = () => {
    return gulp.src('./src/**/*.js')
    .pipe(concat('all.js'))
    .pipe(terser())
    .pipe(gulp.dest('./dist/js'))
}

const scss = () => {
    return gulp.src('./src/scss/main.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist/css'))
}

const images = () => {
    return gulp.src('./src/**/*.+(png|jpg|svg|jpeg)')
    .pipe(gulp.dest('./dist'))
}


gulp.task('scss', scss)
gulp.task('html', html)
gulp.task('js', js)
gulp.task('clean', cleanDist)
gulp.task('images', images)


gulp.task('build', gulp.series(cleanDist, gulp.parallel(html, js, scss, images)))
gulp.task('dev', dev)