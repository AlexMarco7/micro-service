var gulp = require('gulp');
var ts = require('gulp-typescript');
var typescript = require('typescript');
var watch = require('gulp-watch');
var del = require('del');
var path = require('path');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', ['clean','copy','ts']);


gulp.task('watch', ['clean','copy','ts'], function(){
    gulp.watch('src/**/*.ts', function(e) { gulp.start('ts');});
});

gulp.task('clean', function () {
	 del(['dist/**/*']);
});

gulp.task('ts', function () {
    tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("./dist/"));
});

gulp.task('copy', function() {
    gulp.src(['./package.json'])
    .pipe(gulp.dest('./dist'));
});