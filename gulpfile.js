var gulp            = require('gulp'),
    connect         = require('gulp-connect'),
    csslint         = require('gulp-csslint'),
    eslint          = require('gulp-eslint'),
    lintspaces      = require('gulp-lintspaces'),
    rename          = require('gulp-rename'),
    sass            = require('gulp-sass'),
    tildeImporter   = require('node-sass-tilde-importer'),
    uglify          = require('gulp-uglify'),
    autoprefixer    = require('gulp-autoprefixer'),
    cleanCSS        = require('gulp-clean-css');

gulp.task('csslint', function() {
    return gulp.src('src/multilevelmenu.css')
        .pipe(csslint('.csslintrc'))
        .pipe(csslint.formatter());
});

gulp.task('build:css', function() {
    return gulp.src('src/multilevelmenu.scss')
        .pipe(sass({
            importer: tildeImporter,
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest('docs/css/'))
        .pipe(rename('multilevelmenu.min.css'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('editorconfig', function() {
    return gulp.src('src/multilevelmenu.js')
        .pipe(lintspaces({editorconfig: './.editorconfig'}))
        .pipe(lintspaces.reporter());
});

gulp.task('eslint', function() {
    return gulp.src('src/multilevelmenu.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('copy:js',  gulp.series('editorconfig', 'eslint', function() {
    return gulp.src('src/multilevelmenu.js')
        .pipe(gulp.dest('docs/js/'));
}));

gulp.task('minify:js', gulp.series('copy:js', function() {
    return gulp.src('src/multilevelmenu.js')
        .pipe(uglify())
        .pipe(rename('multilevelmenu.min.js'))
        .pipe(gulp.dest('dist/'));
}));

gulp.task('build', gulp.parallel('build:css', 'minify:js'));

gulp.task('watch', function(done) {
    gulp.watch(['docs/*.html','src/**/*'], gulp.series('build'));
    done();
});

gulp.task('serve', gulp.parallel('build', 'watch', function(done) {
    connect.server({
        livereload: true
    });
    done();
}));

gulp.task('default', gulp.series('build'));

gulp.task('dev', gulp.series('serve'));
