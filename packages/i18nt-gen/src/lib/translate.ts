import type { GetLanguages } from './getlanguages';
import type { Encoders, Encoder } from './encoders';

const MSG_REP_REG = /%\{(.+?)\}|%s|%p/g;

type DBLanguages = string[];
type TranslateResult = string | undefined | null;
type TranslateSubData = {
  /**
   * 原始语言，对应的其他目标语言翻译词条映射字典
   */
  [word: string]: TranslateResult[],
};


/**
 * 翻译结果词条字典
 *
 * word的排列顺序 和 DBLanguages 语言列表排列顺序保持一致
 *
 * @example
 * ```json
 * {
 *  "languages": ['en', 'hk'],
 *  "common": {
 *    "中国": ["china", "中國"]
 *  },
 *  "subkey": {
 *    "subkey-tw": {
 *      "中国": [, "中華"]
 *    }
 *  }
 * }
 * ```
 */
export type TranslateData = {
  /**
   * 语言列表
   */
  languages: DBLanguages,

  /**
   * 保存通用的翻译词条
   */
  common: TranslateSubData,

  /**
   * 保存subkey的词条
   */
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

export interface I18NOptions {
  /**
   * 针对语言的特殊处理key
   */
  subkey?: string,

  /**
   * 指定翻译语言，可以有多个值。不自动从环境中获取
   */
  language?: string,

  /**
   * 非变量默认使用的编码方式
   */
  encode?: string | Encoder,

  /**
   * 强制匹配语言，如果没有命中，则直接返回空字符串，不返回默认语言
   */
  forceMatch?: boolean,
};


export interface I18NFullOptions extends I18NOptions {
  /**
   * 翻译使用的变量
   */
  tpldata?: FullTypeData,
};


export type I18NInstance = {
  cache: TranslateCache,
  translateData: TranslateData,
  getLanguages: GetLanguages,
  encoders: Encoders,
};


export function translate(
  { translateData, cache, getLanguages, encoders }: I18NInstance,

  msg: string,
  tpldata?: FullTypeData,
  options?: I18NOptions,
): string {
  let languages: string | undefined;
  let defEncode: Encoder | undefined;

  if (options) {
    if (options.language) languages = options.language;
    if (options.encode) {
      defEncode = typeof options.encode === 'function'
        ? options.encode
        : encoders[options.encode];
    }
  }

  if (!languages) languages = getLanguages(cache);

  let translateMsg: TranslateResult;
  // @ts-ignore
  if (languages && languages.split) {
    if (cache.language !== languages) {
      cache.languageIndexs = languages2index(translateData.languages || [], languages);
      cache.language = languages;
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
          // 如果是数组，则只支持数字index
          ? (msg ? tpldata[+msg] : tpldata[replaceIndex++])
          // 如果是obj，则只支持key
          : (msg ? tpldata[msg] : undefined);

        // 处理encode问题
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


function languages2index(dblanguages: DBLanguages, languages: string): number[] {
  const dblanguagesMap = {} as { [lang: string]: number };
  const langKeys = languages.split(',');
  const languageIndexs = [] as number[];

  for (let i = dblanguages.length; i--;) dblanguagesMap[dblanguages[i]] = i;

  for (let i = langKeys.length; i--;) {
    const langIndex = dblanguagesMap[langKeys[i]];
    if (langIndex || langIndex === 0) languageIndexs.push(langIndex);
  }

  return languageIndexs;
}
