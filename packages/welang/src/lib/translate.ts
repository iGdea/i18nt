import type { GetLangs } from './getlangs';
import {
    Encoders,
    EncoderType,
    Encoder,
} from './encoders';

const MSG_REP_REG = /%\{(\d+)\}|%s|%p|%\{.+?\}/g;

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


export type WELANGOptions = {
    subkey?: string,
    langs?: string,
    encode?: EncoderType,
    forceMatch?: boolean,
};

export type TranslateCache = {
    language?: string,
    languageIndexs?: number[],
};

type BaseTypeData = string | undefined;
type TypeDataWithOptions = {
    text: BaseTypeData,
    encode: boolean,
};

export type TypeData = BaseTypeData | TypeDataWithOptions;

export type WELANGInstance = {
    cache: TranslateCache,
    translateData: TranslateData,
    getlangs: GetLangs,
    encoders: Encoders,
};


export function translate(
    { translateData, cache, getlangs, encoders }: WELANGInstance,

    msg: string,
    tpldata?: TypeData[],
    options?: WELANGOptions,
):string {
    let langs: string | undefined;
    let defEncode: Encoder | undefined;

    if (options) {
        if (options.langs) langs = options.langs;
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

        const languageIndexs:number[] = cache.languageIndexs || [];
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
    return msg.split(MSG_REP_REG)
        .map((msg, index) => {
            let encode = defEncode;

            if (index % 2) {
                let tplVal = msg ? tpldata[+msg] : tpldata[replaceIndex++];

                const tplValEncode = tplVal && (tplVal as TypeDataWithOptions).encode;
                if (tplValEncode === true || tplValEncode === false) {
                    tplVal = (tplVal as TypeDataWithOptions).text;
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
