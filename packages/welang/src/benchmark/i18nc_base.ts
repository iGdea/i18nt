import * as Benchmark from 'benchmark';
import newWeLANG from './lib/new_welang_handler';

const oldWeLANG = require('./lib/old_welang_handler');

const suite = new Benchmark.Suite();

suite
  .add('#old', () => oldWeLANG('上午好'))
  .add('#new', () => newWeLANG('上午好'))
  // .add('#new_tagged', () => newWeLANG.t`上午好`)
  // .add('#new subtype', () => newWeLANG('下午好', 'love'))
  // .add('#new vars', () => newWeLANG('你好,%s', ['Bacra']))

  .add('#old2', () => oldWeLANG('上午好'))
  .add('#new2', () => newWeLANG('上午好'))
  // .add('#new_tagged2', () => newWeLANG.t`上午好`)

  // @ts-ignore
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    // @ts-ignore
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
