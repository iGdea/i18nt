const { describe, it, expect } = require('@jest/globals');
const Domain = require('domain');
const { fromProcessDomain } = require('../dist/lib/getLanguages');

describe('#getLanguages', () => {
  it('#fromProcessDomain', () => {
    const dm = Domain.create();

    dm.run(() => {
      dm.__i18nt__ = 'zh-tw,cht';

      expect(fromProcessDomain('__i18nt__')).toBe('zh-tw,cht');
      expect(fromProcessDomain('__i18nt__')).toBe('zh-tw,cht');
    });
  });
});
