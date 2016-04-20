import babel from 'gulp-babel';
import babelPluginAutoImporter from 'fbjs-scripts/babel-6/auto-importer';
import babelPluginModules from 'fbjs-scripts/babel-6/rewrite-modules';
import del from 'del';
import flatten from 'gulp-flatten';
import fs from 'fs-extra';
import gulp from 'gulp';
import gulpCheckDependencies from 'fbjs-scripts/gulp/check-dependencies';
import gulpModuleMap from 'fbjs-scripts/gulp/module-map';
import gulpStripProvidesModule from 'fbjs-scripts/gulp/strip-provides-module';
import runSequence from 'run-sequence';

const babelrc = fs.readJsonSync('./.babelrc');

const babelOpts = () => ({
  ...babelrc,
  plugins: [
    ...(babelrc.plugins || []),
    babelPluginAutoImporter,
    [
      babelPluginModules,
      {
        map: {
          ...fs.readJsonSync('./internal-module-map.json'),
        },
        prefix: '',
      },
    ],
  ],
});

const paths = {
  src: [
    '*src/**/*.js',
    '!src/**/__tests__/**/*.js',
    '!src/**/__mocks__/**/*.js',
  ],
  dest: 'lib',
};

const moduleMapOpts = {
  moduleMapFile: './module-map.json',
  prefix: 'mediatool/lib/',
};

const internalModuleMapOpts = {
  moduleMapFile: './internal-module-map.json',
  prefix: './',
};

gulp.task('clean', () => del(paths.dest));

gulp.task('lib', () => gulp
  .src(paths.src)
  .pipe(gulpModuleMap(moduleMapOpts))
  .pipe(gulpModuleMap(internalModuleMapOpts))
  .pipe(gulpStripProvidesModule())
  .pipe(babel(babelOpts()))
  .pipe(flatten())
  .pipe(gulp.dest(paths.dest))
);

gulp.task('check-dependencies', () => gulp
  .src('package.json')
  .pipe(gulpCheckDependencies())
);

gulp.task('watch', () => { gulp.watch(paths.src, ['modules']); });

gulp.task('build', cb => (
  runSequence('check-dependencies', 'clean', 'lib', cb)
));

gulp.task('default', ['build']);
