import * as Benchmark from 'benchmark';
import newi18nt from './lib/new_i18nt_handler';

const oldi18nt = require('./lib/old_i18nt_handler');

const suite = new Benchmark.Suite();

suite
  .add('#old', () => oldi18nt('你好,%s', ['Bacra']))
  .add('#new', () => newi18nt('你好,%s', ['Bacra']))
  .add('#old2', () => oldi18nt('你好,%s', ['Bacra']))
  .add('#new2', () => newi18nt('你好,%s', ['Bacra']))

  // @ts-ignore
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    // @ts-ignore
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
