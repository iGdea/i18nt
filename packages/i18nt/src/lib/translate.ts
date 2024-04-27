import type { GetLangs } from './getlangs';
import {
  Encoders,
  EncoderType,
  Encoder,
} from './encoders';

const MSG_REP_REG = /%\{(.+?)\}|%s|%p/g;

type DBLangs = string[];
type TranslateResult = string | undefined | null;
type TranslateSubData = {
  [word: string]: TranslateResult[],
};

export type TranslateData = {
  // 语言列表
  langs?: DBLangs,

  // 对应翻译
  common?: TranslateSubData,
  subkeys?: {
    [subkey: string]: TranslateSubData
  },
};

type TranslateCache = {
  language?: string,
  languageIndexs?: number[],
};

type BaseTypeDataItem = string | number | undefined;
type TypeDataItemWithOptions = {
  text: BaseTypeDataItem,
  encode: boolean,
};

export type TypeDataItem = BaseTypeDataItem | TypeDataItemWithOptions;

export type FullTypeData = TypeDataItem[] | {
  [key: string]: TypeDataItem,
};

export type I18NOptions = {
  subkey?: string,
  language?: string,
  encode?: EncoderType,
  forceMatch?: boolean,
};

export type I18NFullOptions = {
  subkey?: string,
  language?: string,
  encode?: EncoderType,
  forceMatch?: boolean,
  tpldata?: FullTypeData,
};

export type I18NInstance = {
  cache: TranslateCache,
  translateData: TranslateData,
  getlangs: GetLangs,
  encoders: Encoders,
};


export function translate(
  { translateData, cache, getlangs, encoders }: I18NInstance,

  msg: string,
  tpldata?: FullTypeData,
  options?: I18NOptions,
): string {
  let langs: string | undefined;
  let defEncode: Encoder | undefined;

  if (options) {
    if (options.language) langs = options.language;
    if (options.encode) defEncode = encoders[options.encode];
  }

  if (!langs) langs = getlangs(cache);

  let translateMsg: TranslateResult;
  // @ts-ignore
  if (langs && langs.split) {
    if (cache.language !== langs) {
      cache.languageIndexs = langs2index(translateData.langs || [], langs);
      cache.language = langs;
    }

    const languageIndexs: number[] = cache.languageIndexs || [];
    const subkeyDB = options?.subkey && translateData.subkeys?.[options.subkey];
    const commonDB = translateData.common;
    if (commonDB) {
      if (!subkeyDB) {
        for (let i = languageIndexs.length; !translateMsg && i--;) {
          translateMsg = commonDB[msg]?.[languageIndexs[i]];
        }
      } else {
        for (let i = languageIndexs.length; !translateMsg && i--;) {
          const langIndex = languageIndexs[i];
          translateMsg = subkeyDB[msg]?.[langIndex]
            || commonDB[msg]?.[langIndex];
        }
      }
    } else if (subkeyDB) {
      for (let i = languageIndexs.length; !translateMsg && i--;) {
        translateMsg = subkeyDB[msg]?.[languageIndexs[i]];
      }
    }
  }

  if (translateMsg) {
    msg = '' + translateMsg;
  } else if (options?.forceMatch) {
    return '';
  }

  if (!tpldata || !msg.includes('%')) {
    return defEncode ? defEncode(msg) : msg;
  }

  // 使用split性能比replace更好
  let replaceIndex = 0;
  const isTplDataArr = Array.isArray(tpldata);

  return msg.split(MSG_REP_REG)
    .map((msg, index) => {
      let encode = defEncode;

      if (index % 2) {
        let tplVal = isTplDataArr
          ? (msg ? tpldata[+msg] : tpldata[replaceIndex++])
          : (msg ? tpldata[msg] : undefined);

        const tplValEncode = tplVal && (tplVal as TypeDataItemWithOptions).encode;
        if (tplValEncode === true || tplValEncode === false) {
          tplVal = (tplVal as TypeDataItemWithOptions).text;
          if (tplValEncode === false) encode = undefined;
        }

        msg = tplVal === undefined ? '' : tplVal as string;
      }

      if (!msg) return msg || '';
      return encode ? encode(msg) : msg;
    })
    .join('');
}


function langs2index(dblangs: DBLangs, langs: string): number[] {
  const dblangsMap = {} as { [lang: string]: number };
  const langKeys = langs.split(',');
  const languageIndexs = [] as number[];

  for (let i = dblangs.length; i--;) dblangsMap[dblangs[i]] = i;

  for (let i = langKeys.length; i--;) {
    const langIndex = dblangsMap[langKeys[i]];
    if (langIndex || langIndex === 0) languageIndexs.push(langIndex);
  }

  return languageIndexs;
}
