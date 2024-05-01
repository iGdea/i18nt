import * as Benchmark from 'benchmark';
import newI18N from './lib/new_i18n_handler';
import oldI18N from './lib/old_i18n_handler';

const suite = new Benchmark.Suite();

suite
  .add('#old', () => oldI18N('你好,%s', ['Bacra']))
  .add('#new', () => newI18N('你好,%s', ['Bacra']))
  .add('#old2', () => oldI18N('你好,%s', ['Bacra']))
  .add('#new2', () => newI18N('你好,%s', ['Bacra']))

  // @ts-ignore
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    // @ts-ignore
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
