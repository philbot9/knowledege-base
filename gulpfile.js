const fs = require('fs')
const path = require('path')

const { src, dest, series } = require('gulp')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const uglifycss = require('gulp-uglifycss')

function buildJs() {
  return src(['views/*.js', 'views/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(
      uglify().on('error', function (e) {
        console.log(e)
      })
    )
    .pipe(dest('public/js/'))
}

function buildCss() {
  return src(['views/*.css', 'views/**/*.css'])
    .pipe(concat({ path: 'style.css', stat: { mode: 0666 } }))
    .pipe(uglifycss({ uglyComments: true }))
    .pipe(dest('public/css/'))
}

exports.default = series(buildJs, buildCss)
