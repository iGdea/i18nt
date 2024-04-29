import { encoders } from './lib/encoders';
import type { TranslateData } from './lib/translate';

import {
  i18nt,

  type I18NGeneratorOptions,
  type I18NHandler,
} from './i18nt';


export function initI18N<Lang extends string>(options: I18NGeneratorOptions): typeof i18nt<Lang> {
  let defaultOptions: I18NGeneratorOptions = mergeOptions({}, options);

  return function (translateData: TranslateData, options?: I18NGeneratorOptions): I18NHandler<Lang> {
    return i18nt(translateData, options ? mergeOptions(defaultOptions, options) : defaultOptions);
  };
}


function mergeOptions(
  opt1: I18NGeneratorOptions,
  opt2: I18NGeneratorOptions,
): I18NGeneratorOptions {
  return {
    ...opt1,
    ...opt2,

    encoders: {
      ...encoders,
      ...opt1.encoders,
      ...opt2.encoders,
    },
  };
}
