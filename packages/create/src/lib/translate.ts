import type { GetLanguages } from './getLanguages';
import type { Encoders, Encoder } from './encoders';

const MSG_REP_REG = /(%\{(.+?)\}|%s|%p)/g;

type DBLanguages<Lang extends string> = Lang[];
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
export type TranslateData<Lang extends string> = {
  /**
   * 语言列表
   */
  languages: DBLanguages<Lang>,

  /**
   * 保存通用的翻译词条
   */
  common?: TranslateSubData,

  /**
   * 保存subkey的词条
   */
  subkeys?: {
    [subkey: string]: TranslateSubData
  },
};

type TranslateCache<Lang extends string> = {
  // TranslateData中的语言数组，对应的map
  // 注意：dblanguage2indexKey是数组引用的判断，所以TranslateData如果要修改值，必须直接赋值
  dblanguage2indexKey: Lang[],
  dblanguage2indexMap: { [key in Lang]?: number },

  // 每次传入的语言，对应的index列表
  language: string,
  languageIndexs: number[],
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

export interface I18NOptions<Lang extends string> {
  /**
   * 针对语言的特殊处理key
   */
  subkey?: string,

  /**
   * 指定翻译语言，可以有多个值。不自动从环境中获取
   */
  language?: Lang | Lang[],

  /**
   * 非变量默认使用的编码方式
   */
  encode?: string | Encoder,

  /**
   * 强制匹配语言，如果没有命中，则直接返回空字符串，不返回默认语言
   */
  forceMatch?: boolean,
};


export interface I18NFullOptions<Lang extends string> extends I18NOptions<Lang> {
  /**
   * 翻译使用的变量
   */
  tpldata?: FullTypeData,
};


export type I18NInstance<Lang extends string> = {
  cache: TranslateCache<Lang>,
  translateData: TranslateData<Lang>,
  getLanguages: GetLanguages,
  encoders: Encoders,
};


/**
 * 翻译并组装字符串模版
 */
export function translate<Lang extends string>(
  { translateData, cache, getLanguages, encoders }: I18NInstance<Lang>,

  msg: string,
  options: I18NOptions<Lang>,
  tpldata?: FullTypeData,
  defEncodeKey?: string,
): string {
  let languages: string | undefined;
  let langKeys: string[] | undefined;
  let defEncode: Encoder | undefined;

  {
    const langs = options.language;
    if (langs) {
      if (Array.isArray(langs)) {
        languages = langs.join(',');
        langKeys = langs;
      } else {
        languages = langs;
      }
    }

    const encode = options.encode;
    if (encode) {
      defEncode = typeof encode === 'function'
        ? encode
        : encoders[encode];
    } else if (defEncodeKey) {
      defEncode = encoders[defEncodeKey];
    }
  }

  if (!languages) languages = getLanguages();

  let translateMsg: TranslateResult;
  if (languages && languages.split) {
    if (cache.language !== languages) {
      if (!langKeys) langKeys = languages.split(',');

      // translateData中的语言，转成index Map
      let dblanguage2indexMap = cache.dblanguage2indexMap;
      if (cache.dblanguage2indexKey !== translateData.languages) {
        dblanguage2indexMap = {};
        const dblanguages = translateData.languages;
        if (dblanguages) {
          for (let i = dblanguages.length; i--;) dblanguage2indexMap[dblanguages[i]] = i;
        }
        cache.dblanguage2indexMap = dblanguage2indexMap;
        cache.dblanguage2indexKey = dblanguages;
      }

      // 将语言列表转换成翻译词典languages数组中的index列表
      const languageIndexs: number[] = [];
      for (let len = langKeys.length, i = 0; i < len; i++) {
        const langIndex = dblanguage2indexMap[langKeys[i] as Lang];
        if (langIndex || langIndex === 0) languageIndexs.push(langIndex);
      }
      cache.languageIndexs = languageIndexs;
      cache.language = languages;
    }

    const languageIndexs: number[] = cache.languageIndexs;
    const languageIndexsLength = languageIndexs.length;
    if (languageIndexs && languageIndexs.length) {
      const subkeyDB = options.subkey && translateData.subkeys?.[options.subkey]?.[msg];
      const commonDB = translateData.common?.[msg];
      if (commonDB) {
        if (!subkeyDB) {
          for (let i = 0; !translateMsg && i < languageIndexsLength; i++) {
            translateMsg = commonDB[languageIndexs[i]];
          }
        } else {
          for (let i = 0; !translateMsg && i < languageIndexsLength; i++) {
            const langIndex = languageIndexs[i];
            translateMsg = subkeyDB[langIndex] || commonDB[langIndex];
          }
        }
      } else if (subkeyDB) {
        for (let i = 0; !translateMsg && i < languageIndexsLength; i++) {
          translateMsg = subkeyDB[languageIndexs[i]];
        }
      }
    }
  }

  if (translateMsg) {
    msg = '' + translateMsg;
  } else if (options.forceMatch) {
    return '';
  }

  if (!tpldata || !msg.includes('%')) {
    return defEncode ? defEncode(msg) : msg;
  }

  return renderMsg(msg, tpldata, defEncode);
}


/**
 * 替换字符串中的占位符，输出字符串结果
 */
function renderMsg(msg: string, tpldata: FullTypeData, defEncode?: Encoder): string {
  // 使用split性能比replace更好
  let replaceIndex = 0;
  const isTplDataArr = Array.isArray(tpldata);
  const msgResult: (string | number)[] = [];

  const msgArr = msg.split(MSG_REP_REG);

  // 便利分割情况
  // 一次遍历3个节点
  for (let index = 0, len = msgArr.length; index < len; index += 3) {
    // 需要翻译的内容
    const i18nWord = msgArr[index];
    // 正则完全匹配的Key
    const placeholder = msgArr[index + 1];

    msgResult.push(defEncode ? defEncode(i18nWord) : i18nWord);

    if (placeholder === '%p') {
      // %p 占位符，不处理encode
      // 只处理数组情况下的替换
      if (isTplDataArr) msgResult.push(encodeTplData(undefined, tpldata[replaceIndex++]));
    } else if (placeholder === '%s') {
      // 只处理数组情况下的替换
      if (isTplDataArr) msgResult.push(encodeTplData(defEncode, tpldata[replaceIndex++]));
    } else {
      const placeholderKey = msgArr[index + 2];
      if (isTplDataArr) {
        const placeholderIndex = +placeholderKey;
        if (!isNaN(placeholderIndex)) {
          msgResult.push(encodeTplData(defEncode, tpldata[placeholderIndex]));
        }
      } else {
        // 这里存在示例的情况
        // 所以可能存在比较多无值的key
        const submsg = encodeTplData(defEncode, tpldata[placeholderKey]);
        if (submsg) msgResult.push(submsg);
      }
    }
  }

  return msgResult.join('');
}


/**
 * 展开单项tpldata数据，并根据编码函数，确认是否需要转义
 */
function encodeTplData(encode: Encoder | undefined, tplVal: TypeDataItem | undefined): string | number {
  let msg: string | number | undefined;
  let useEncoder: boolean = true;

  if (typeof tplVal === 'object' && tplVal) {
    msg = tplVal.text;
    useEncoder = tplVal.encode;
  } else {
    msg = tplVal;
  }

  if (msg === undefined) return '';
  if (msg === 0) return '0';

  if (typeof msg === 'string') {
    return useEncoder !== false && encode ? encode(msg) : msg;
  }

  return msg;
}
