gulp = require 'gulp'
browserify = require 'gulp-browserify'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
watchify = require 'watchify'
source = require 'vinyl-source-stream'
watch = require 'gulp-watch'

plumber = require 'gulp-plumber'

entryFile = './src/maximum_length_rectangle.coffee'

gulp.task 'js', ->
  gulp.src(entryFile, { read: false })
    .pipe(plumber())
    .pipe(browserify({
        cache: {},
        packageCache: {},
        #fullPaths: true,
        transform: ['coffeeify']
        #transform: ['coffee-reactify'],
        extensions: ['.coffee', '.cjsx'],
    }))
    #.pipe(uglify())
    .pipe(rename('maximum_length_rectangle.js'))
    .pipe(gulp.dest('./lib/'))

gulp.task 'watch', ->
    gulp.watch './src/**/*.coffee', read:false, (event) ->
        #ext = path.extname event.path
        console.log event.path+" has changed"
        gulp.start 'js'
        console.log "converted stuff"
