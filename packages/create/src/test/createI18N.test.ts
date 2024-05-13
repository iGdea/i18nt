import { describe, it, expect } from '@jest/globals';

import { translateData } from '../benchmark/lib/translate_data';
import { createI18N } from '../';

const DefGetLangsOpts: {
  getLanguages: () => 'en' | 'hk',
} = {
  getLanguages: () => 'en',
};


describe('#createI18N', () => {
  it('#base', () => {
    const i18n = createI18N(translateData, DefGetLangsOpts);

    expect(i18n('上午好')).toBe('en:Good morning');
    expect(i18n('晚上好')).toBe('晚上好');
    expect(i18n('')).toBe('');
  });

  it('#languages', () => {
    let languages = 'hk,en';

    const i18n = createI18N(translateData, {
      getLanguages: () => languages,
    });

    expect(i18n('上午好')).toBe('hk:早安');
    expect(i18n('下午好')).toBe('en:Good afternoon');

    languages = 'en';
    expect(i18n('上午好')).toBe('en:Good morning');
  });

  describe('#tpldata', () => {
    it('#args: array', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', ['Bacra'])).toBe('en:Hello, Bacra');
      expect(i18n('你好，%s')).toBe('en:Hello, %s');
      expect(i18n('你好，%s', [])).toBe('en:Hello, ');
    });

    it('#args: options-array', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', { tpldata: ['Bacra'] })).toBe('en:Hello, Bacra');
      expect(i18n('你好，%s', { tpldata: [] })).toBe('en:Hello, ');
    });

    it('#args: options-map', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%{name}', { tpldata: { name: 'Bacra' } })).toBe('en:Hello, Bacra');
      expect(i18n('你好，%{name}', { tpldata: {} })).toBe('en:Hello, ');
    });

    it('#placeholder:num', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%{1} %{0}', ['woo', 'Bacra'])).toBe('你好，Bacra woo');
      expect(i18n('你好，%{1} %{0}', { tpldata: { 1: 'Bacra', 0: 'woo' }})).toBe('你好，Bacra woo');
    });

    it('#placeholder:not_exists', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%{username}', ['Bacra'])).toBe('你好，');
      expect(i18n('你好，%{username}', [])).toBe('你好，');
      expect(i18n('你好，%{username}', { tpldata: {} })).toBe('你好，');

      expect(i18n('你好，%{1}', [])).toBe('你好，');
      expect(i18n('你好，%{1}', { tpldata: {} })).toBe('你好，');
    });

    it('#val:num', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', [0])).toBe('en:Hello, 0');
      expect(i18n('你好，%s', [1])).toBe('en:Hello, 1');
    });
  });

  describe('#subkey', () => {
    it('#witch Common', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', ['Bacra'], { subkey: 'love' })).toBe('en:Hi, Bacra');
      expect(i18n('你好，%s', 'love')).toBe('en:Hi, %s');
      expect(i18n('你好，%s', 'love', { language: 'hk' })).toBe('hk:你好，%s');
    });

    it('#witchout Common', () => {
      const i18n = createI18N({
        languages: ['en'],
        subkeys: {
          'love': {
            '你好，%s': ['en:Hi, love Bacra'],
          },
        },
      }, DefGetLangsOpts);

      expect(i18n('你好，%s', ['Bacra'], { subkey: 'love' })).toBe('en:Hi, love Bacra');
    });
  });

  describe('#options', () => {
    it('#language', () => {
      const i18n = createI18N<'en' | 'cn' | 'hk'>(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', ['Bacra'], { language: 'cn' })).toBe('你好，Bacra');
      expect(i18n('你好，%s', ['Bacra'], { language: ['en', 'cn'] })).toBe('en:Hello, Bacra');

      // 翻译语言优先级
      expect(i18n('上午好', { language: ['hk', 'en'] })).toBe('hk:早安');
      expect(i18n('上午好', { language: ['en', 'hk'] })).toBe('en:Good morning');
      expect(i18n('上午好', { language: ['cn', 'en', 'hk'] })).toBe('en:Good morning');

      // 语言不在配置的列表里面，ts预期报错
      // @ts-expect-error
      expect(i18n('你好，%s', ['Bacra'], { language: 'ja' })).toBe('你好，Bacra');
    });

    it('#forceMatch', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', ['Bacra'], { forceMatch: true })).toBe('en:Hello, Bacra');
      expect(i18n('no exists key', { forceMatch: true })).toBe('');
    });

    it('#encode', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      expect(i18n('你好，%s', ['Bacra woo'], { encode: 'url' })).toBe('en%3AHello%2C%20Bacra%20woo');
      expect(i18n('你好，%p', ['Bacra woo'], { encode: 'url' })).toBe('en%3AHello%2C%20Bacra woo');
      expect(i18n('你好，%s', [{
        text: 'Bacra woo',
        encode: false,
      }], { encode: 'url' })).toBe('en%3AHello%2C%20Bacra woo');

      expect(i18n('你好，%s', [{
        text: 'Bacra woo',
        encode: false,
      }], { encode: (str) => str.toLocaleLowerCase() })).toBe('en:hello, Bacra woo');
    });
  });

  describe('#TaggedTemplate', () => {
    it('#base', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      const username = 'Bacra woo';

      expect(i18n.t`上午好`).toBe('en:Good morning');
      expect(i18n.t`你好，${username}`).toBe('en:Hello, Bacra woo');
      expect(i18n.t`数字比较正确，${11} > ${10}`).toBe(`en:check num succ, 10 < 11`);
    });

    it('#options', () => {
      const i18n = createI18N(translateData, DefGetLangsOpts);

      const username = 'Bacra woo';
      const key = i18n.t({ encode: 'url' });

      expect(key`上午好`).toBe('en%3AGood%20morning');
      expect(key`你好，${username}`).toBe('en%3AHello%2C%20Bacra%20woo');
      expect(key`你好，${{ text: username, encode: false }}`).toBe('en%3AHello%2C%20Bacra woo');
    });

  });

  it('#encodeFunc', () => {
    const i18n = createI18N(translateData, DefGetLangsOpts);

    expect(i18n.urlEncode('你好，%s', ['Bacra woo'])).toBe('en%3AHello%2C%20Bacra%20woo');
    expect(i18n.urlEncode('你好，%p', ['Bacra woo'])).toBe('en%3AHello%2C%20Bacra woo');
    expect(i18n.urlEncode('你好，%s', [{
      text: 'Bacra woo',
      encode: false,
    }])).toBe('en%3AHello%2C%20Bacra woo');

    expect(i18n.urlEncode('你好，%s', ['<Bacra>'], { encode: 'html' })).toBe('en:Hello, &lt;Bacra&gt;');
  });
});
