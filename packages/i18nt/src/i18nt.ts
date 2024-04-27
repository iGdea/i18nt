import { getlangs, GetLangs } from './lib/getlangs';
import {
  translate,

  TypeData,
  TranslateData,
  I18NOptions,
  I18NInstance
} from './lib/translate';

import { encoders, Encoders } from './lib/encoders';

type I18NTaggedTemplateHandler = (strs: TemplateStringsArray, ...args: TypeData[]) => string;
interface I18NTaggedTemplate {
  (strs: TemplateStringsArray, ...args: TypeData[]): string;
  (options: I18NOptions): I18NTaggedTemplateHandler;
}

export type I18NGeneratorOptions = {
  getlangs?: GetLangs,
  encoders?: Encoders,
};

export interface i18ntHandler {
  (msg: string, tpldata: TypeData[], options?: I18NOptions): string;
  (msg: string, subkey: string): string;
  (msg: string, options: I18NOptions): string;
  (msg: string): string;

  // 性能太差，单独出函数
  // (strs: TemplateStringsArray, ...args: TypeData[]): string;
  // (options: I18NOptions): I18NTaggedTemplate;
  t: I18NTaggedTemplate,
};


export function i18nt(translateData: TranslateData, options?: I18NGeneratorOptions): i18ntHandler {
  const myEncoders = options?.encoders
    ? { ...encoders, ...options.encoders }
    : encoders;

  const instance: I18NInstance = {
    cache: {},
    translateData,

    getlangs: options?.getlangs || getlangs,
    encoders: myEncoders,
  };

  const i18nt = <i18ntHandler>function (msg: string, arg2: any, arg3: any): string {
    if (!msg) return msg;
    // const [arg2, arg3] = args;

    let tpldata: TypeData[] | undefined,
      options: I18NOptions | undefined = arg3;

    if (arg2) {
      if (arg2.split) {
        options = { subkey: arg2 };
      } else if (Array.isArray(arg2)) {
        tpldata = arg2;
      } else {
        options = arg2;
      }
    }

    return translate(instance, '' + msg, tpldata, options);
  }

  i18nt.t = <I18NTaggedTemplate>function (strs: any, ...args: TypeData[]) {
    if (strs.raw) {
      if (strs.length === 1) {
        return translate(instance, strs[0]);
      } else {
        return translate(instance, strs.join('%s'), args);
      }
    } else {
      const options: I18NOptions = strs.split ? { subkey: strs } : strs;

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
// const i18n = i18nt({});
// i18n('sssss', 'substype');