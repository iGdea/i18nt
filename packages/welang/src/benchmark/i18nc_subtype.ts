import * as Benchmark from 'benchmark';
import newWeLANG from './lib/new_welang_handler';

const oldWeLANG = require('./lib/old_welang_handler');

const suite = new Benchmark.Suite();

suite
    .add('#old', () => oldWeLANG('下午好', 'love'))
    .add('#new', () => newWeLANG('下午好', 'love'))
    .add('#old2', () => oldWeLANG('下午好', 'love'))
    .add('#new2', () => newWeLANG('下午好', 'love'))

    // @ts-ignore
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        // @ts-ignore
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run();
