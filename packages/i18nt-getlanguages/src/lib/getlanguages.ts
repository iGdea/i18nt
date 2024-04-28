/* global window document */

/**
 * i18nt 函数中，获取语言的方法
 */

import {
  getLanguagesFromCookie,
  genCookieRegExp,
} from './cookie-utils';

type GetLanguagesByKey = (key: string) => string;

export const fromProcessDomain: GetLanguagesByKey = function (key) {
  const dm = (process as any).domain;
  const val = dm && dm[key];
  return val ? '' + val : '';
}

export const fromWebNavigator: GetLanguagesByKey = function (key) {
  const win = window as any;
  let lang = win[key];

  if (lang !== false) {
    const nav = window.navigator;
    const navlanguages = nav && nav.languages;
    if (navlanguages) {
      lang = '' + navlanguages;
    } else {
      const navlang = nav && nav.language;
      if (navlang) lang = navlang;
    }

    if (lang) lang = win[key] = lang.toLowerCase().replace(/-/g, '_');
    else win[key] = false;
  }

  return lang || '';
}

export function genFromWebCookie(cookieName: string) {
  const reg = genCookieRegExp(cookieName);

  const fromWeCookie: GetLanguagesByKey = (key) => {
    const win = window as any;
    let lang = win[key];

    if (!lang && lang !== false) {
      lang = win[key] = getLanguagesFromCookie(document.cookie, reg) || false;
    }

    return lang || '';
  }

  return fromWeCookie;
}


// 快速生成函数
export function genGetLanguagesForD2(
  key: string,

  {
    getLanguages4browser,
    getLanguages4node,
  }: {
    getLanguages4browser: GetLanguagesByKey,
    getLanguages4node: GetLanguagesByKey
  }
) {
  return (cache: any): string => {
    if (cache.global) {
      return cache.global[key] || '';
    } else if (cache.platform === 'node') {
      return getLanguages4node(key);
    } else if (typeof window == 'object') {
      cache.global = window;
      return getLanguages4browser(key);
    } else if (typeof process == 'object') {
      cache.platform = 'node';
      return getLanguages4node(key);
    } else {
      cache.global = {};
      return '';
    }
  };
}
