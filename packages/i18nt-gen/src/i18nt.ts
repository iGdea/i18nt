import { i18ntByInstance, type I18NHandlerEncode } from './lib/i18ntByInstance';
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

  const handler = <I18NHandler<Lang>>i18ntByInstance(instance);

  handler.jsEncode = i18ntByInstance(instance, 'js');
  handler.htmlEncode = i18ntByInstance(instance, 'html');
  handler.urlEncode = i18ntByInstance(instance, 'url');

  return handler;
}


// test
// const i18n = i18nt<'en' | 'ja' | 'hk'>({ languages: [], common: {} });
// i18n('sssss', 'substype', {
//   // subkey: '1111',
//   encode: 'jsEncode',
//   // language: 'en'
//   language: ['en', 'ja'],
// });
// i18n.urlEncode('xxxxx', { language: 'hk' });
