import expect from 'expect.js';

import translateData from '../benchmark/lib/translate_data';
import {
  welang,
  initWelang,
  EncoderType,
} from '../';


describe('#welang', () => {
  it('#base', () => {
    const weLANG = welang(translateData, {
      getlangs: () => 'en',
    });

    expect(weLANG('上午好')).to.be('en:Good morning');
    expect(weLANG('晚上好')).to.be('晚上好');
  });

  it('#langs', () => {
    let langs = 'hk,en';

    const weLANG = welang(translateData, {
      getlangs: () => langs,
    });

    expect(weLANG('上午好')).to.be('hk:早安');
    expect(weLANG('下午好')).to.be('en:Good afternoon');

    langs = 'en';
    expect(weLANG('上午好')).to.be('en:Good morning');
  });

  it('#vars', () => {
    const weLANG = welang(translateData, {
      getlangs: () => 'en',
    });

    expect(weLANG('你好，%s', ['Bacra'])).to.be('en:Hello, Bacra');
    expect(weLANG('你好，%s')).to.be('en:Hello, %s');
    expect(weLANG('你好，%s', [])).to.be('en:Hello, ');
  });

  it('#subkey', () => {
    const weLANG = welang(translateData, {
      getlangs: () => 'en',
    });

    expect(weLANG('你好，%s', ['Bacra'], { subkey: 'love' })).to.be('en:HI, Bacra');
    expect(weLANG('你好，%s', 'love')).to.be('en:HI, %s');
  });

  describe('#TaggedTemplate', () => {
    it('#base', () => {
      const weLANG = welang(translateData, {
        getlangs: () => 'en',
      });

      const username = 'Bacra';

      expect(weLANG.t`上午好`).to.be('en:Good morning');
      expect(weLANG.t`你好，${username}`).to.be('en:Hello, Bacra');
    });

    it('#options', () => {
      const weLANG = welang(translateData, {
        getlangs: () => 'en',
      });

      const username = 'Bacra';
      const key = weLANG.t({ encode: EncoderType.urlEncode });

      expect(key`你好，${username}`).to.be('en%3AHello%2C%20Bacra');
    });

  });

  it('#noInit', () => {
    const weLANG0 = initWelang({
      getlangs: () => 'en',
    });

    const weLANG = weLANG0(translateData, {
      getlangs: () => 'hk',
    });


    expect(weLANG('上午好')).to.be('hk:早安');
  });

  describe('#options', () => {
    it('#langs', () => { });
  });
});
