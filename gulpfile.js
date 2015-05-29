var gulp = require("gulp");
var jshint = require("gulp-jshint");

var src = {
    js : "./client/js/**/*.{js,html}",
    sass : "./client/sass/*"
};

// client js
var browserify = require("gulp-browserify"),
    uglify = require("gulp-uglify");

gulp.task("js", function() {
    gulp.src("./client/js/app.js")
    .pipe(jshint())
    .pipe(browserify({
        // debug : true,
        transform: ["node-underscorify"],
    }))
    .pipe(uglify())
    .pipe(gulp.dest("public/js"));
});

// css
var minifyCSS = require("gulp-minify-css"),
    compass = require("gulp-compass");

gulp.task("css", function(){
    gulp.src(src.sass)
    .pipe(compass({
        css : "public/css",
        sass: "client/sass"
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest("public/css"));
});

// watch
gulp.task("watch", function(){
    gulp.watch(src.js, ["js"]);
    gulp.watch(src.sass, ["css"]);
});

// lint
gulp.task("lint", function(){
    gulp.src(["./*.js", "./routes/*.js", "./client/js/*.js"])
    .pipe(jshint());
});

// nodemon
var nodemon = require("gulp-nodemon");

gulp.task("nodemon", function() {
    nodemon({
        script : "app.js",
        ext : "js jade",
        env : {"NODE_ENV": "development"},
        ignore: ["client", "public"],
    })
    .on("restart", ["lint"])
    .on("start", ["lint", "js", "css", "watch"]);
});

gulp.task("default", ["nodemon"]);
gulp.task("compile", ["css", "js"]);
