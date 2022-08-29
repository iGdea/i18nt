const expect = require('expect.js');
const Domain = require('domain');

import { fromProcessDomain } from '../lib/getlangs';

describe('#getlangs', () => {
    it('#fromProcessDomain', () => {
        const dm = Domain.create();

        dm.run(() => {
            dm.__i18nc__ = 'zh-tw,cht';
            expect(fromProcessDomain('__i18nc__')).to.be('zh-tw,cht');
            expect(fromProcessDomain('__i18nc__')).to.be('zh-tw,cht');
        });
    });
});
