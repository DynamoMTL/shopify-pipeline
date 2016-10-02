//
//
// Gulpfile
//
//

//
// Requires
//
const gulp = require('gulp')
const sass = require('gulp-sass')
const clean = require('gulp-clean')
const rename = require('gulp-rename')
const webpack = require('webpack-stream')
const eslint = require('gulp-eslint')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const browserSync = require('browser-sync')
const yaml = require('yamljs')
const flatten = require('gulp-flatten')
const sequence = require('run-sequence')
const changed = require('gulp-changed')
const debug = require('gulp-debug')
const shell = require('gulp-shell')
const lazypipe = require('lazypipe')

//
// Config
//
const environment = (() => {
  if (process.argv.includes("--production")) { return "production" }
  if (process.argv.includes("--staging")) { return "staging" }
  return "development"
})()
const shopify = yaml.load('./config.yml')
const config = {
  paths: {
    config: "./source/config",
    sass: "./source/sass",
    js: "./source/js",
    fonts: "./source/fonts",
    images: "./source/images",
    templates: ["./source/layout/**/*", "./source/snippets/**/*", "./source/templates/**/*"],
    locales: "./source/locales",
    output: "./output"
  },
  url: `https://${shopify.development.store}/?key=${shopify.development.theme_preview_key}`
}

//
// Helpers
//
const upload = lazypipe()
  .pipe(
    shell,
    ['cd output && ../theme upload <%= changePath(file.path) %>'],
    {
      templateData: {
        changePath: (path) => {
          newPath = path.replace(process.cwd() + '/', '').replace('output/', '')
          return newPath
        }
      },
      quiet: true
    })

//
// Subtasks
//
gulp.task('clean', () => {
  return gulp
    .src(config.paths.output, {read: false})
    .pipe(clean({force: true}))
})

gulp.task('config', () => {
  gulp
    .src('./config.yml')
    .pipe(gulp.dest(config.paths.output))
  return gulp
    .src(`${config.paths.config}/**/*`, {base: "./source/"})
    .pipe(gulp.dest(config.paths.output))
})

gulp.task('templates', () => {
  let dest = config.paths.output
  return gulp
    .src(config.paths.templates, {base: "./source/"})
    .pipe(changed(dest))
    .pipe(gulp.dest(dest))
    .pipe(upload())
    .pipe(browserSync.stream())
})

gulp.task('locales', () => {
  // TODO: export the locales
})

gulp.task('images', () => {
  // TODO:
  // 1. we need to do some kind of compression here
  // 2. we need to filter out images that are not accepted by shopify
  let dest = `${config.paths.output}/assets`
  return gulp
    .src(`${config.paths.images}/**/*`)
    .pipe(flatten())
    .pipe(changed(dest))
    .pipe(gulp.dest(dest))
    .pipe(upload())
    .pipe(browserSync.stream())
})

gulp.task('fonts', () => {
  let dest = `${config.paths.output}/assets`
  return gulp
    .src(config.paths.fonts + '/**.*')
    .pipe(changed(dest))
    .pipe(gulp.dest(dest))
    .pipe(upload())
    .pipe(browserSync.stream())
})

gulp.task('sass', () => {
  let dest = `${config.paths.output}/assets`
  return gulp
    .src(config.paths.sass + "/theme.sass")
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('theme.css.liquid'))
    .pipe(changed(dest))
    .pipe(gulp.dest(dest))
    .pipe(upload())
    .pipe(browserSync.stream())
})

gulp.task('eslint', () => {
  // TODO: should move this into a eslint
  // config file and adopt a styleguide probably
  let options = {
    "parserOptions": {
      "ecmaVersion": 6,
      "sourceType": "module"
    },
    "env": {
      "browser": true,
      "node": true,
      "es6": true
    },
    "rules": {
      "strict": 0,
      "quotes": [
        2,
        "single"
      ]
    }
  }

  return gulp
    .src([config.paths.js + '/**/*.js', `!${config.paths.js}/vendors/**/*.*`])
    .pipe(eslint(options))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('js-vendors', () => {
  let dest = `${config.paths.output}/assets`
  return gulp
    .src(config.paths.js + '/vendors/**/*.js')
    .pipe(changed(dest))
    .pipe(gulp.dest(dest))
});

gulp.task('js', ['eslint', 'js-vendors'], () => {
  return gulp
    .src(config.paths.js + '/theme.js')
    .pipe(webpack({
      output: {
        filename: "theme.js"
      },
      watch: false,
      resolve: {
        extensions: ['', '.js']
      },
      module: {
        loaders: [
          {
            test: /\.js?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
              presets: ['es2015']
            }
          }
        ],
        stats: {
          colors: true
        }
      }
    }))
    .pipe(uglify())
    .pipe(gulp.dest(`${config.paths.output}/assets`))
    .pipe(upload())
    .pipe(browserSync.stream())
})

//
// Main tasks
//
gulp.task('build', (callback) => {
  let async = ['templates', 'locales', 'images', 'fonts', 'sass', 'js', 'config']
  sequence('clean', async, () => callback());
})

gulp.task('watch', ['build'], () => {
  gulp.watch([`${config.paths.sass}/**/*.sass`], ['sass'])
  gulp.watch([`${config.paths.js}/**/*.js`], ['js'])
  gulp.watch([`${config.paths.fonts}/**/*.*`], ['fonts'])
  gulp.watch([`${config.paths.images}/**/*.*`], ['images'])
  gulp.watch(config.paths.templates, ['templates'])
  gulp.watch('./config.yml', (file) => {
    console.warn("Config file changed. Need to restart the gulp process.")
    return process.exit()
  })
})

gulp.task('serve', ['build', 'watch'], () => {
  browserSync.init({
    proxy: config.url,
    browser: "google chrome",
    injectChanges: false
  })
})

gulp.task('deploy', ['build'], () => {
  let command = `cd output && ../theme replace --env=${environment}`
  return gulp
    .src(config.paths.output)
    .pipe(shell(command))
})

gulp.task('default', ['serve'])
