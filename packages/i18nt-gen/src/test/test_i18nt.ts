import expect from 'expect.js';

import { translateData } from '../benchmark/lib/translate_data';
import {
  i18nt,
  initI18N,
} from '../';


describe('#i18nt', () => {
  it('#base', () => {
    const i18n = i18nt(translateData, {
      getLanguages: () => 'en',
    });

    expect(i18n('上午好')).to.be('en:Good morning');
    expect(i18n('晚上好')).to.be('晚上好');
  });

  it('#languages', () => {
    let languages = 'hk,en';

    const i18n = i18nt(translateData, {
      getLanguages: () => languages,
    });

    expect(i18n('上午好')).to.be('hk:早安');
    expect(i18n('下午好')).to.be('en:Good afternoon');

    languages = 'en';
    expect(i18n('上午好')).to.be('en:Good morning');
  });

  describe('#tpldata', () => {
    it('#args: array', () => {
      const i18n = i18nt(translateData, {
        getLanguages: () => 'en',
      });

      expect(i18n('你好，%s', ['Bacra'])).to.be('en:Hello, Bacra');
      expect(i18n('你好，%s')).to.be('en:Hello, %s');
      expect(i18n('你好，%s', [])).to.be('en:Hello, ');
    });

    it('#args: options-array', () => {
      const i18n = i18nt(translateData, {
        getLanguages: () => 'en',
      });

      expect(i18n('你好，%s', { tpldata: ['Bacra'] })).to.be('en:Hello, Bacra');
      expect(i18n('你好，%s', { tpldata: [] })).to.be('en:Hello, ');
    });

    it('#args: options-map', () => {
      const i18n = i18nt(translateData, {
        getLanguages: () => 'en',
      });

      expect(i18n('你好，%{name}', { tpldata: { name: 'Bacra' } })).to.be('en:Hello, Bacra');
      expect(i18n('你好，%{name}', { tpldata: {} })).to.be('en:Hello, ');
    });
  });

  it('#subkey', () => {
    const i18n = i18nt(translateData, {
      getLanguages: () => 'en',
    });

    expect(i18n('你好，%s', ['Bacra'], { subkey: 'love' })).to.be('en:HI, Bacra');
    expect(i18n('你好，%s', 'love')).to.be('en:HI, %s');
  });

  describe('#options', () => {
    it('#language', () => {
      const i18n = i18nt(translateData, {
        getLanguages: () => 'en',
      });

      expect(i18n('你好，%s', ['Bacra'], { language: 'cn' })).to.be('你好，Bacra');
      expect(i18n('你好，%s', ['Bacra'], { language: 'en,cn' })).to.be('en:Hello, Bacra');
    });

    it('#forceMatch', () => {
      const i18n = i18nt(translateData, {
        getLanguages: () => 'en',
      });

      expect(i18n('你好，%s', ['Bacra'], { forceMatch: true })).to.be('en:Hello, Bacra');
      expect(i18n('no exists key', { forceMatch: true })).to.be('');
    });

    it('#encode', () => {
      const i18n = i18nt(translateData, {
        getLanguages: () => 'en',
      });

      expect(i18n('你好，%s', ['Bacra'], { encode: 'urlEncode' })).to.be('en%3AHello%2C%20Bacra');
    });
  });

  describe('#TaggedTemplate', () => {
    it('#base', () => {
      const i18n = i18nt(translateData, {
        getLanguages: () => 'en',
      });

      const username = 'Bacra';

      expect(i18n.t`上午好`).to.be('en:Good morning');
      expect(i18n.t`你好，${username}`).to.be('en:Hello, Bacra');
    });

    it('#options', () => {
      const i18n = i18nt(translateData, {
        getLanguages: () => 'en',
      });

      const username = 'Bacra';
      const key = i18n.t({ encode: 'urlEncode' });

      expect(key`你好，${username}`).to.be('en%3AHello%2C%20Bacra');
    });

  });

  it('#noInit', () => {
    const i18nt0 = initI18N({
      getLanguages: () => 'en',
    });

    const i18n = i18nt0(translateData, {
      getLanguages: () => 'hk',
    });


    expect(i18n('上午好')).to.be('hk:早安');
  });
});
