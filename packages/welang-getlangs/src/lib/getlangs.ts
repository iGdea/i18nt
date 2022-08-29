/* global window document */

/**
 * welang 函数中，获取语言的方法
 */

import {
    getLangsFromCookie,
    genCookieRegExp,
} from './cookie-utils';

type GetLangsByKey = (key: string) => string;

export const fromProcessDomain: GetLangsByKey = function(key) {
    const dm = process.domain as any;
    const val = dm && dm[key];
    return val ? '' + val : '';
}

export const fromWebNavigator: GetLangsByKey = function(key) {
    const win = window as any;
    let lang = win[key];

    if (lang !== false) {
        const nav = window.navigator;
        const navlangs = nav && nav.languages;
        if (navlangs) {
            lang = '' + navlangs;
        } else {
            const navlang = nav && nav.language;
            if (navlang) lang = navlang;
        }

        if (lang) lang = win[key] = lang.toLowerCase().replace(/-/g, '_');
        else win[key] = false;
    }

    return lang || '';
}

const genFromWebCookie = function(cookieName: string) {
    const reg = genCookieRegExp(cookieName);

    const fromWeCookie: GetLangsByKey = (key) => {
        const win = window as any;
        let lang = win[key];

        if (!lang && lang !== false) {
            lang = win[key] = getLangsFromCookie(document.cookie, reg) || false;
        }

        return lang || '';
    }

    return fromWeCookie;
}


// 快速生成函数
export function genGetLangsForD2(
    key: string,

    {
        getlangs4browser,
        getlangs4node,
    }: {
        getlangs4browser: GetLangsByKey,
        getlangs4node: GetLangsByKey
    }
) {
    return (cache: any):string => {
        if (cache.global) {
            return cache.global[key] || '';
        } else if (cache.platform === 'node') {
            return getlangs4node(key);
        } else if (typeof window == 'object') {
            cache.global = window;
            return getlangs4browser(key);
        } else if (typeof process == 'object') {
            cache.platform = 'node';
            return getlangs4node(key);
        } else {
            cache.global = {};
            return '';
        }
    };
}



export const genGetLangs = {
    genFromWebCookie,
};
