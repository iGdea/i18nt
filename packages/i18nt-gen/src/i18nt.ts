import { getLanguages, type GetLanguages } from './lib/getLanguages';
import {
  translate,

  type TypeDataItem,
  type FullTypeData,
  type TranslateData,
  type I18NOptions,
  type I18NFullOptions,
  type I18NInstance
} from './lib/translate';

import { encoders, type Encoders } from './lib/encoders';

type I18NTaggedTemplateHandler = (strs: TemplateStringsArray, ...args: TypeDataItem[]) => string;
interface I18NTaggedTemplate<Lang extends string> {
  (strs: TemplateStringsArray, ...args: TypeDataItem[]): string;
  (options: I18NOptions<Lang>): I18NTaggedTemplateHandler;
}

export type I18NGeneratorOptions = {
  getLanguages?: GetLanguages,
  encoders?: Encoders,
};

export interface I18NHandler<Lang extends string> {
  (msg: string, tpldata: TypeDataItem[], options?: I18NOptions<Lang>): string;
  (msg: string, subkey: string, options?: Omit<I18NFullOptions<Lang>, 'subkey'>): string;
  (msg: string, options: I18NFullOptions<Lang>): string;
  (msg: string): string;

  // 性能太差，单独出函数
  // (strs: TemplateStringsArray, ...args: TypeDataItem[]): string;
  // (options: I18NOptions): I18NTaggedTemplate;
  t: I18NTaggedTemplate<Lang>,
};


export function i18nt<Lang extends string>(translateData: TranslateData, options?: I18NGeneratorOptions): I18NHandler<Lang> {
  const myEncoders = options?.encoders
    ? { ...encoders, ...options.encoders }
    : encoders;

  const instance: I18NInstance = {
    cache: {
      language: '',
      languageIndexs: [],
    },
    translateData,

    getLanguages: options?.getLanguages || getLanguages,
    encoders: myEncoders,
  };

  const i18nt = <I18NHandler<Lang>>function (msg: string, arg2: any, arg3: any): string {
    if (!msg) return msg;
    // const [arg2, arg3] = args;

    let tpldata: FullTypeData | undefined,
      options: I18NOptions<Lang> | undefined = arg3;

    if (arg2) {
      if (arg2.split) {
        options = arg3
          ? { ...arg3, subkey: arg2 }
          : { subkey: arg2 };
      } else if (Array.isArray(arg2)) {
        tpldata = arg2;
      } else {
        options = arg2;
        tpldata = arg2.tpldata;
      }
    }

    return translate(instance, '' + msg, tpldata, options);
  }

  i18nt.t = <I18NTaggedTemplate<Lang>>function (strs: any, ...args: TypeDataItem[]) {
    if (strs.raw) {
      if (strs.length === 1) {
        return translate(instance, strs[0]);
      } else {
        return translate(instance, strs.join('%s'), args);
      }
    } else {
      const options: I18NOptions<Lang> = strs.split ? { subkey: strs } : strs;

      const func: I18NTaggedTemplateHandler = (strs, ...args) => {
        if (strs.length === 1) {
          return translate(instance, strs[0], undefined, options);
        } else {
          return translate(instance, strs.join('%s'), args, options);
        }
      };
      return func;
    }
  }

  return i18nt;
}


// test
// const i18n = i18nt<'en' | 'ja' | 'hk'>({ languages: [], common: {} });
// i18n('sssss', 'substype', {
//   // subkey: '1111',
//   encode: 'jsEncode',
//   // language: 'en'
//   language: ['en', 'ja'],
// });
