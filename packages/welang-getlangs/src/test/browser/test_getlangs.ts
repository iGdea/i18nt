/* global document navigator window */

'use strict';

const expect = require('expect.js');
const getlans = require('../i18n_getlans');

describe('#base', function() {
    let navlans = navigator.languages
        ? '' + navigator.languages
        : navigator.language + ',' + navigator.language.split(/-|_/)[0];

    navlans = navlans.toLowerCase().replace(/-/g, '_');

    beforeEach(function() {
        window.__i18nc__ = null;
        document.cookie = 'test_lan=zh,cht;';
        document.cookie = 'test_lan1=zh-tw,cht;';
    });

    it('#onlyWebCookie', function() {
        const cache = {};
        expect(getlans.onlyWebCookie(cache)).to.be('zh-tw,cht');
        expect(window.__i18nc__).to.be('zh-tw,cht');
        expect(getlans.onlyWebCookie(cache)).to.be('zh-tw,cht');
    });

    it('#webCookeAndProcssDomian', function() {
        const cache = {};
        expect(getlans.webCookeAndProcssDomian(cache)).to.be('zh-tw,cht');
        expect(cache.g).to.be(window);
        expect(window.__i18nc__).to.be('zh-tw,cht');
        expect(getlans.webCookeAndProcssDomian(cache)).to.be('zh-tw,cht');
    });

    it('#onlyWebNavigator', function() {
        const cache = {};
        expect(getlans.onlyWebNavigator(cache)).to.be(navlans);
        expect(window.__i18nc__).to.be(navlans);
        expect(getlans.onlyWebNavigator(cache)).to.be(navlans);
    });

    it('#webNavigatorAndProcessDomain', function() {
        const cache = {};
        expect(getlans.webNavigatorAndProcessDomain(cache)).to.be(navlans);
        expect(cache.g).to.be(window);
        expect(window.__i18nc__).to.be(navlans);
        expect(getlans.webNavigatorAndProcessDomain(cache)).to.be(navlans);
    });
});
