import { createI18NByInstance, type I18NHandlerEncode } from './lib/createI18NByInstance';
import { getLanguages, type GetLanguages } from './lib/getLanguages';
import { encoders, type Encoders } from './lib/encoders';

import type { TranslateData, I18NInstance } from './lib/translate';

export interface I18NHandler<Lang extends string> extends I18NHandlerEncode<Lang> {
  jsEncode: I18NHandlerEncode<Lang>;
  htmlEncode: I18NHandlerEncode<Lang>;
  urlEncode: I18NHandlerEncode<Lang>;
}

export type I18NGeneratorOptions = {
  getLanguages?: GetLanguages,
  encoders?: Encoders,
};


export function createI18N<Lang extends string>(translateData: TranslateData<Lang>, options?: I18NGeneratorOptions): I18NHandler<Lang> {
  const myEncoders = options?.encoders
    ? { ...encoders, ...options.encoders }
    : encoders;

  const instance: I18NInstance<Lang> = {
    cache: {
      language: '',
      languageIndexs: [],

      dblanguage2indexKey: [],
      dblanguage2indexMap: {},
    },
    translateData,

    getLanguages: options?.getLanguages || getLanguages,
    encoders: myEncoders,
  };

  const handler = <I18NHandler<Lang>>createI18NByInstance(instance);

  handler.jsEncode = createI18NByInstance(instance, 'js');
  handler.htmlEncode = createI18NByInstance(instance, 'html');
  handler.urlEncode = createI18NByInstance(instance, 'url');

  return handler;
}


// test
// const i18n = createI18N<'en' | 'ja' | 'hk'>({ languages: [], common: {} });
// i18n('sssss', 'substype', {
//   // subkey: '1111',
//   encode: 'jsEncode',
//   // language: 'en'
//   language: ['en', 'ja'],
// });
// i18n.urlEncode('xxxxx', { language: 'hk' });
