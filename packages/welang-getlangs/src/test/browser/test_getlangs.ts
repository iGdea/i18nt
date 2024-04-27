import expect from 'expect.js';
const getlans = require('../i18n_getlans');

describe('#base', function () {
  const win = window as any;

  let navlans = navigator.languages
    ? '' + navigator.languages
    : navigator.language + ',' + navigator.language.split(/-|_/)[0];

  navlans = navlans.toLowerCase().replace(/-/g, '_');

  beforeEach(function () {
    win.__i18nc__ = null;
    document.cookie = 'test_lan=zh,cht;';
    document.cookie = 'test_lan1=zh-tw,cht;';
  });

  it('#onlyWebCookie', function () {
    const cache: any = {};
    expect(getlans.onlyWebCookie(cache)).to.be('zh-tw,cht');
    expect(win.__i18nc__).to.be('zh-tw,cht');
    expect(getlans.onlyWebCookie(cache)).to.be('zh-tw,cht');
  });

  it('#webCookeAndProcssDomian', function () {
    const cache: any = {};
    expect(getlans.webCookeAndProcssDomian(cache)).to.be('zh-tw,cht');
    expect(cache.g).to.be(win);
    expect(win.__i18nc__).to.be('zh-tw,cht');
    expect(getlans.webCookeAndProcssDomian(cache)).to.be('zh-tw,cht');
  });

  it('#onlyWebNavigator', function () {
    const cache: any = {};
    expect(getlans.onlyWebNavigator(cache)).to.be(navlans);
    expect(win.__i18nc__).to.be(navlans);
    expect(getlans.onlyWebNavigator(cache)).to.be(navlans);
  });

  it('#webNavigatorAndProcessDomain', function () {
    const cache: any = {};
    expect(getlans.webNavigatorAndProcessDomain(cache)).to.be(navlans);
    expect(cache.g).to.be(win);
    expect(win.__i18nc__).to.be(navlans);
    expect(getlans.webNavigatorAndProcessDomain(cache)).to.be(navlans);
  });
});
