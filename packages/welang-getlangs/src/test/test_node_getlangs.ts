import expect from 'expect.js';
import Domain from 'domain';

import { fromProcessDomain } from '../lib/getlangs';

describe('#getlangs', () => {
  it('#fromProcessDomain', () => {
    const dm = Domain.create();

    dm.run(() => {
      (dm as any).__i18nc__ = 'zh-tw,cht';

      expect(fromProcessDomain('__i18nc__')).to.be('zh-tw,cht');
      expect(fromProcessDomain('__i18nc__')).to.be('zh-tw,cht');
    });
  });
});
