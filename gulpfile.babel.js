import gulp from 'gulp';
import gpug from 'gulp-pug';
import { deleteAsync } from 'del'; // 수정된 부분
import ws from 'gulp-webserver';
import image from 'gulp-image';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoPrefixer from 'gulp-autoprefixer';
import miniCSS from 'gulp-csso';
import bro from 'gulp-bro';
import babelify from 'babelify';
import ghPages from 'gulp-gh-pages';

const sass = gulpSass(dartSass);

const routes = {
    pug: {
        watch: 'src/pug/**/*.pug',
        src: 'src/pug/**/*.pug',
        dest: 'dist',
    },
    img: {
        src: 'src/img/*',
        dest: 'dist/img',
    },
    scss: {
        watch: 'src/scss/**/*.scss',
        src: 'src/scss/*.scss',
        dest: 'dist/css',
    },
    js: {
        watch: 'src/js/**/*.js',
        src: 'src/js/main.js',
        dest: 'dist/js',
    },
};

const pug = () =>
    gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => deleteAsync(['dist', '.publish']); // 수정된 부분

const webserver = () =>
    gulp.src('dist').pipe(ws({ livereload: true, open: true }));

const img = () =>
    gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
    gulp
        .src(routes.scss.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(
            autoPrefixer({
                overrideBrowserslist: ['last 2 versions', '> 1%'],
                cascade: false,
            }),
        )
        .pipe(miniCSS())
        .pipe(gulp.dest(routes.scss.dest));

const js = () =>
    gulp
        .src(routes.js.src)
        .pipe(
            bro({
                transform: [
                    babelify.configure({ presets: ['@babel/preset-env'] }),
                    ['uglifyify', { global: true }],
                ],
            }),
        )
        .pipe(gulp.dest(routes.js.dest));

const ghdeploy = () => gulp.src('dist/**/*').pipe(ghPages());

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.img.src, img);
    gulp.watch(routes.scss.watch, styles);
    gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series(clean, img); // [] 제거

const assets = gulp.series(pug, styles, js); // [] 제거

const postDev = gulp.parallel(webserver, watch);

export const build = gulp.series(prepare, assets);
export const dev = gulp.series(build, postDev);
export const deploy = gulp.series(build, ghdeploy, clean);
