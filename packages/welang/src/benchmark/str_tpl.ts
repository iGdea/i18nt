import * as Benchmark from 'benchmark';

const MSG_REP_REG = /%\{(\d+)\}|%s|%p|%\{.+?\}/g;

const suite = new Benchmark.Suite();

suite
    .add('#split', () => {
        let str = '1234%{1}456%{xxx}789%s10'.split(MSG_REP_REG)
            .map((str, index) => {
                if (index % 2) {
                    return str ? 'index_' + str : 'no_index';
                }

                return str;
            }).join('');

        str += 123;
    })
    .add('#replace', () => {
        let str = '1234%{1}456%{xxx}789%s10'.replace(MSG_REP_REG, (all, index) => {
            return index ? 'index_' + index : 'no_index';
        });

        str += 123;
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
