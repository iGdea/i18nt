import * as Benchmark from 'benchmark';
import newI18N from './lib/new_i18nt_handler';

const oldI18N = require('./lib/old_i18nt_handler');

const suite = new Benchmark.Suite();

suite
  .add('#old', () => oldI18N('下午好', 'love'))
  .add('#new', () => newI18N('下午好', 'love'))
  .add('#old2', () => oldI18N('下午好', 'love'))
  .add('#new2', () => newI18N('下午好', 'love'))

  // @ts-ignore
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    // @ts-ignore
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
