'use strict';

const del = require('del');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');
const assets = () => gulp.src(JSON_FILES)
    .pipe(gulp.dest('build'));

gulp.task('scripts', () => {
    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('build'));
});

gulp.task('clean', () => del('build', {force: true}));

gulp.task('build', ['clean', 'scripts'], assets);