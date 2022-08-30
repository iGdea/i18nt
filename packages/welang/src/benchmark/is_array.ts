import * as Benchmark from 'benchmark';

function callFunc(result:boolean) {}

const suite = new Benchmark.Suite();

suite
    .add('#Array.isArray', () => {
        const arr: any[] = [];
        callFunc(Array.isArray(arr))
    })
    .add('#splice', () => {
        const arr: any[] = [];
        callFunc(!!arr.splice);
    })
    // @ts-ignore
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        // @ts-ignore
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run();
