var gulp         = require('gulp'),
	browserSync  = require('browser-sync').create(),
	jade         = require('gulp-pug'),
	stylus 		 = require('gulp-stylus'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS     = require('gulp-clean-css'),
	rename       = require('gulp-rename'),
	notify 	     = require("gulp-notify"),
	uglify       = require('gulp-uglify'),
	concat  	 = require('gulp-concat'),
	cache        = require('gulp-cache'),
	imagemin     = require('gulp-imagemin');

gulp.task('serve', ['stylus', 'jade', 'js', 'imgmin'], function() {

    browserSync.init({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});

	gulp.watch("src/styl/**/*.styl", ['stylus']);
	gulp.watch("src/img/**/*", ['imgmin']);
	gulp.watch("src/js/**/*.js", ['js']);
    gulp.watch("src/*.pug", ['jade']);
    gulp.watch("dist/*.html").on('change', browserSync.reload);
});


gulp.task('stylus', function () {
  return gulp.src('src/styl/master.styl')
    .pipe(stylus().on("error", notify.onError()))
    .pipe(autoprefixer(['last 14 versions']))
    .pipe(cleanCSS()) 
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('jade', function () {
    gulp.src('src/*.pug')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('master-js', function() {
	return gulp.src([
		'src/js/master.js',
		])
	.pipe(concat('master.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'));
});

gulp.task('js', ['master-js'], function() {
	return gulp.src([
		'src/libs/jquery/dist/jquery.min.js',
		'src/js/master.min.js',
		])
	.pipe(concat('master.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.stream());
});

gulp.task('imgmin', function() {
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('clearcache', function () { return cache.clearAll(); });
gulp.task('default', ['serve']);