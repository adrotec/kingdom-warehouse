var gulp = require('gulp');
var traceur = require('gulp-traceur');
var less = require('gulp-less');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var wrapper = require('gulp-wrapper');
var pipe = require('pipe/gulp');
var mergeStreams = require('event-stream').merge;
var path = require('path');

var src = 'src';
var dist = 'dist';

var jsFiles = [src + '/**/*.js'];
var testFiles = ['test/**/*.js'];
var lessFiles = [src + '/**/*.less'];

var sassFiles = [src + '/**/*.scss'];

var htmlFiles = [src + '/app/**/*.html'];

var otherFiles = [src + '/**/!(*.js|*.src|*.less|*.scss)',
                  '!' + src + '/{app,app/**}',
                  './config.global-shared.js', './config.global.js'
                 ];

var app = {
  jsFiles:     src + '/app/**/*.js',
  lessFiles:   src + '/app/**/*.less',
  sassFiles:   src + '/app/**/*.scss',
  htmlFiles:   src + '/app/**/*.html',
}

function gulpShared(){

  function getKingdomModuleId(file){
    var fileName = file.path.replace(file.base,'');
    if(process.platform.match(/^win/)){
     fileName = fileName.replace(/\\/g, '/');
    }
    fileName = fileName.replace(path.extname(file.path), '');
    var kgId = fileName.replace(/\//g, '-');
    return kgId;
  }

  function wrapIt(ext){
    if(ext == 'html'){
      return wrapper({
        header: function(file){
          return '<section class="kg-view" id="kg-' + getKingdomModuleId(file) + '">\n';
        },
        footer: '\n</section>'
      });
    }
    var regex = new RegExp(src + '(\/|\\\\)index\.' + ext + '$');
    return wrapper({
     header: function(file){
      if(file.path.match(regex)){
        return '';
      }
      return 'section#kg-' + getKingdomModuleId(file) +' {\n';
     },
     footer: function(file){
      if(file.path.match(regex)){
        return '';
      }
      return '\n}'
     }
    });
  };

  gulp.task('build_js', function () {
    return gulp.src(jsFiles)
      .pipe(traceur(pipe.traceur()))
      .pipe(gulp.dest(dist + '/'));
  });

  gulp.task('build_test', function () {
    return gulp.src(testFiles)
      .pipe(traceur(pipe.traceur({modules: 'inline', asyncFunctions: true})))
      .pipe(gulp.dest('dist_test/'));
  });

  gulp.task('build_html', function(){
    return gulp.src(htmlFiles)
      .pipe(wrapIt('html'))
      .pipe(gulp.dest(dist + '/app/'));

  });

  function build_less(){
    return gulp.src([src + '/index.less', app.lessFiles])
      .pipe(wrapIt('less'))
      .pipe(concat('less-style.less'))
      .pipe(less({paths: [ src + '' ]}))
  };

  function build_sass(){
    return gulp.src([src + '/index.scss', app.sassFiles])
      .pipe(wrapIt('scss'))
      .pipe(concat('sass-style.scss'))
      .pipe(sass())
  };

  gulp.task('build_css', function(){
    return mergeStreams(build_less(), build_sass())
            .pipe(concat('style.css'))
            .pipe(gulp.dest(dist + '/'))
  });

  gulp.task('build_deps', function(){
      gulp.src('./node_modules/di/src/**/*.js')
      .pipe(traceur(pipe.traceur()))
    .pipe(gulp.dest(dist + '/lib/di/dist/amd'));

      gulp.src('./node_modules/rtts-assert/src/**/*.js')
      .pipe(traceur(pipe.traceur()))
    .pipe(gulp.dest(dist + '/lib/rtts-assert/dist/amd'));

    gulp.src('./node_modules/requirejs/*')
    .pipe(gulp.dest(dist + '/lib/requirejs'));

    gulp.src('./node_modules/kingdom/*')
    .pipe(gulp.dest(dist + '/lib/kingdom'));

    gulp.src('./node_modules/traceur/bin/*')
    .pipe(gulp.dest(dist + '/lib/traceur/bin'));

  });

  gulp.task('copyAll', function(){
    gulp.src(otherFiles)
      .pipe(gulp.dest(dist + '/'));
    gulp.src('./bower_components/**/*')
      .pipe(gulp.dest(dist + '/lib'));
  });


  gulp.task('build', ['build_js', 'build_test', 'build_css', 'build_html', 'build_deps', 'copyAll']);

  gulp.task('livereload', function(){
      return gulp.src([src + '/index.html'])
      .pipe(connect.reload());
  })

  gulp.task('watch', function(){
    gulp.watch(jsFiles, ['build_js', 'livereload']);
    gulp.watch(testFiles, ['build_test']);
    gulp.watch(lessFiles, ['build_css', 'livereload']);
    gulp.watch(sassFiles, ['build_css', 'livereload']);
    gulp.watch(htmlFiles, ['build_html', 'livereload']);
    gulp.watch(otherFiles, ['copyAll', 'livereload']);
  });


  gulp.task('serve', function () {
    connect.server({
      root: dist,
      port: 8000,
      livereload: true
    });
  });



}

module.exports = gulpShared;
