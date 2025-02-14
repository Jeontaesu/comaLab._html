import gulp from 'gulp';
import gpug from 'gulp-pug';
import { deleteAsync } from 'del'; // 수정된 부분

const routes = {
    pug: {
        src: 'src/pug/**/*.pug',
        dest: 'dist',
    },
};

const pug = () =>
    gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => deleteAsync(['dist']); // 수정된 부분

const prepare = gulp.series(clean); // [] 제거
const assets = gulp.series(pug); // [] 제거

export const dev = gulp.series(prepare, assets); // [] 제거
