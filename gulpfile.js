'use strict';

let autoprefix = require('gulp-autoprefixer');
let babel      = require('gulp-babel');
let concat     = require('gulp-concat');
let connect    = require('gulp-connect');
let copy       = require('gulp-copy');
let eslint     = require('gulp-eslint');
let gulp       = require('gulp');
let sass       = require('gulp-sass');
let sasslint   = require('gulp-sass-lint');


const paths = {
  scss: `source/assets/stylesheets/**/*.scss`,
  js: `source/assets/javascripts/**/*.js`,
};

gulp.task('sass', () =>
  gulp.src([ paths.scss ])
    .pipe(sass({
      includePaths: [ ]}
    ).on('error', sass.logError))
    .pipe(autoprefix('last 2 versions'))
    .pipe(gulp.dest('source/assets/stylesheets/'))
);

gulp.task('sasslint', () =>
  gulp.src([ 'src/**/*.s+(a|c)ss' ])
    .pipe(sasslint({
      options: {
        formatter: 'stylish',
      },
      configFile: '.sass-lint.yml',
    }))
    .pipe(sasslint.format())
);

gulp.task('javascripts', () =>
  gulp.src([ paths.js, '!source/assets/javascripts/application.js' ])
    .pipe(babel({
      presets: [ 'env' ],
    }))
    .pipe(concat('application.js'))
    .pipe(gulp.dest('source/assets/javascripts/'))
);

gulp.task('eslint', () =>
  gulp.src([ paths.js, 'gulpfile.babel.js','!node_modules/**' ])
    .pipe(eslint({
      configFile: '.eslintrc',
    }))
    .pipe(eslint.format())
);

gulp.task('connect', () =>
  connect.server({
    root: "source",
    port: 8000,
    livereload: true
  })
);

gulp.task('build', [ 'sass', 'sasslint', 'javascripts', 'eslint' ]);

gulp.task('default', [ 'build', 'connect' ], () =>
  gulp.watch([ paths.scss, paths.js ], [ 'sass', 'sasslint', 'javascripts', 'eslint' ])
);
