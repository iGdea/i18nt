/**
 * node解析语言包
 */

import {
  getLanguagesFromCookie,
  genCookieRegExp,
} from './cookieUtils';

import type { ClientRequest } from 'http';

type NodeReqParse = (req: ClientRequest) => string;

export const parseNodeAcceptLanguage: NodeReqParse = function (req) {
  // zh,en;q=0.9,zh-CN;q=0.8
  let header = req.getHeader('Accept-Language');
  if (header) {
    const lang = (header + '').split(',')
      .map(v => v.split(';')[0])
      .join(',');

    return lang.toLowerCase().replace(/-/g, '_');
  }

  return '';
}

function genParseNodeCookie(cookieName: string) {
  const reg = genCookieRegExp(cookieName);

  const func: NodeReqParse = (req) => {
    const cookie = req.getHeader('Cookie');
    return cookie && getLanguagesFromCookie('' + cookie, reg) || '';
  };

  return func;
}

export const genParser = {
  genParseNodeCookie,
};
