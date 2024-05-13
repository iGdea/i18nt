const { describe, it, expect } = require('@jest/globals');
const { parseNodeAcceptLanguage, genParser } = require('../dist/lib/nodeParser');

describe('#nodeParser', () => {
  const req = {
    getHeader(type) {
      type = type.toLowerCase();
      if (type === 'accept-language') {
        return 'zh,en;q=0.9,zh-CN;q=0.8';
      } else if (type === 'cookie') {
        return 'xxx1=111; __i18nt__1=zh1; __i18nt__2=zh,zh_hk,en; __i18nt__0=zh0; xxx2=222';
      }
    }
  };

  it('#parseNodeAcceptLanguage', () => {
    expect(parseNodeAcceptLanguage(req)).toBe('zh,en,zh_cn');
  });

  it('#parseNodeCookie', () => {
    expect(genParser.genParseNodeCookie('__i18nt__')(req)).toBe('zh,zh_hk,en');
  });
});
