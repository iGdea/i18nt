import expect from 'expect.js';

import { translateData } from '../benchmark/lib/translate_data';
import { createI18N } from '../';

const DefGetLangsOpts = {
  getLanguages: () => 'en',
};


describe('#createI18N', () => {
  it('#base', () => {
    const i18n = createI18N(translateData, DefGetLangsOpts);

    expect(i18n('上午好')).to.be('en:Good morning');
    expect(i18n('晚上好')).to.be('晚上好');
    expect(i18n('')).to.be('');
  });

  it('#languages', () => {
    let languages = 'hk,en';

    const i18n = createI18N(translateData, {
      getLanguages: () => languages,
    });

    expect(i18n('上午好')).to.be('hk:早安');
    expect(i18n('下午好')).to.be('en:Good afternoon');

    languages = 'en';
    expect(i18n('上午好')).to.be('en:Good morning');
  });

  describe('#tpldata', () => {
    it('#args: array', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', ['Bacra'])).to.be('en:Hello, Bacra');
      expect(i18n('你好，%s')).to.be('en:Hello, %s');
      expect(i18n('你好，%s', [])).to.be('en:Hello, ');
    });

    it('#args: options-array', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', { tpldata: ['Bacra'] })).to.be('en:Hello, Bacra');
      expect(i18n('你好，%s', { tpldata: [] })).to.be('en:Hello, ');
    });

    it('#args: options-map', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%{name}', { tpldata: { name: 'Bacra' } })).to.be('en:Hello, Bacra');
      expect(i18n('你好，%{name}', { tpldata: {} })).to.be('en:Hello, ');
    });

    it('#placeholder:num', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%{1} %{0}', ['woo', 'Bacra'])).to.be('你好，Bacra woo');
      expect(i18n('你好，%{1} %{0}', { tpldata: { 1: 'Bacra', 0: 'woo' }})).to.be('你好，Bacra woo');
    });

    it('#placeholder:not_exists', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%{username}', ['Bacra'])).to.be('你好，');
      expect(i18n('你好，%{username}', [])).to.be('你好，');
      expect(i18n('你好，%{username}', { tpldata: {} })).to.be('你好，');

      expect(i18n('你好，%{1}', [])).to.be('你好，');
      expect(i18n('你好，%{1}', { tpldata: {} })).to.be('你好，');
    });

    it('#val:num', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', [0])).to.be('en:Hello, 0');
      expect(i18n('你好，%s', [1])).to.be('en:Hello, 1');
    });
  });

  describe('#subkey', () => {
    it('#witch Common', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', ['Bacra'], { subkey: 'love' })).to.be('en:HI, Bacra');
      expect(i18n('你好，%s', 'love')).to.be('en:HI, %s');
      expect(i18n('你好，%s', 'love', { language: 'hk' })).to.be('hk:你好，%s');
    });

    it('#witchout Common', () => {
      const i18n = createI18N({
        languages: ['en'],
        subkeys: {
          'love': {
            '你好，%s': ['en:HI, love Bacra'],
          },
        },
      }, DefGetLangsOpts);

      expect(i18n('你好，%s', ['Bacra'], { subkey: 'love' })).to.be('en:HI, love Bacra');
    });
  });

  describe('#options', () => {
    it('#language', () => {
      const i18n = createI18N<'en' | 'cn'>(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', ['Bacra'], { language: 'cn' })).to.be('你好，Bacra');
      expect(i18n('你好，%s', ['Bacra'], { language: ['en', 'cn'] })).to.be('en:Hello, Bacra');
      // expect(i18n('你好，%s', ['Bacra'], { language: 'hk' })).to.be('en:Hello, Bacra');
    });

    it('#forceMatch', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', ['Bacra'], { forceMatch: true })).to.be('en:Hello, Bacra');
      expect(i18n('no exists key', { forceMatch: true })).to.be('');
    });

    it('#encode', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', ['Bacra woo'], { encode: 'url' })).to.be('en%3AHello%2C%20Bacra%20woo');
      expect(i18n('你好，%p', ['Bacra woo'], { encode: 'url' })).to.be('en%3AHello%2C%20Bacra woo');
      expect(i18n('你好，%s', [{
        text: 'Bacra woo',
        encode: false,
      }], { encode: 'url' })).to.be('en%3AHello%2C%20Bacra woo');

      expect(i18n('你好，%s', [{
        text: 'Bacra woo',
        encode: false,
      }], { encode: (str) => str.toLocaleLowerCase() })).to.be('en:hello, Bacra woo');
    });
  });

  describe('#TaggedTemplate', () => {
    it('#base', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      const username = 'Bacra woo';

      expect(i18n.t`上午好`).to.be('en:Good morning');
      expect(i18n.t`你好，${username}`).to.be('en:Hello, Bacra woo');
    });

    it('#options', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      const username = 'Bacra woo';
      const key = i18n.t({ encode: 'url' });

      expect(key`上午好`).to.be('en%3AGood%20morning');
      expect(key`你好，${username}`).to.be('en%3AHello%2C%20Bacra%20woo');
      expect(key`你好，${{ text: username, encode: false }}`).to.be('en%3AHello%2C%20Bacra woo');
    });

  });

  it('#encodeFunc', () => {
    const i18n = createI18N(translateData, DefGetLangsOpts);

    expect(i18n.urlEncode('你好，%s', ['Bacra woo'])).to.be('en%3AHello%2C%20Bacra%20woo');
    expect(i18n.urlEncode('你好，%p', ['Bacra woo'])).to.be('en%3AHello%2C%20Bacra woo');
    expect(i18n.urlEncode('你好，%s', [{
      text: 'Bacra woo',
      encode: false,
    }])).to.be('en%3AHello%2C%20Bacra woo');

    expect(i18n.urlEncode('你好，%s', ['<Bacra>'], { encode: 'html' })).to.be('en:Hello, &lt;Bacra&gt;');
  });
});
