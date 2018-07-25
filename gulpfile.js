var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var sass        = require('gulp-sass');
var rename      = require('gulp-rename');
var babel       = require('babelify');              //para usar la ultima sintaxis de js
var browserify  = require('browserify');          // package bunder une dependencias 
var source      = require('vinyl-source-stream');     // necesario para que gulp use browserify
var watchify    = require('watchify');          //para automatizar el gulp

gulp.task('assets',function(){
  gulp
  .src(['assets/*','assets/**/*'])
  .pipe(gulp.dest('public'));
})

gulp.task('styles', function() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      outputStyle: 'uncompressed' // if css compressed **file size**
    })
    .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('public'));
});


// funcion para pasar de js babel y generar app.js en public
function compile(watch){
  var bundle = watchify(browserify('./src/index.js'));
  function rebundle(){
    bundle
      .transform(babel, { presets: [ 'es2015' ], plugins: [ 'syntax-async-functions', 'transform-regenerator' ] })
      .bundle()
      .on('error',function(err){ console.log(err);this.emit('end')})
      .pipe(source('index.js'))
      .pipe(rename('app.js'))
      .pipe(gulp.dest('public'))
  }

  if(watch){
    bundle.on('update',function(){
      console.log('---> Building');
      rebundle();
    })
  }
  rebundle();
}

gulp.task('build',function(){
  return compile();
});

gulp.task('watch',function(){
  return compile(true);
});


gulp.task('default',['styles','assets','build']);