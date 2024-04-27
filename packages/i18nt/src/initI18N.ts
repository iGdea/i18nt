import { encoders } from './lib/encoders';
import type { TranslateData } from './lib/translate';

import {
  i18nt,

  I18NGeneratorOptions,
  i18ntHandler,
} from './i18nt';


export function initI18N(options: I18NGeneratorOptions) {
  let defaultOptions: I18NGeneratorOptions = mergeOptions({}, options);

  return function (translateData: TranslateData, options?: I18NGeneratorOptions): i18ntHandler {
    return i18nt(translateData, options ? mergeOptions(defaultOptions, options) : defaultOptions);
  };
}


function mergeOptions(opt1: I18NGeneratorOptions, opt2: I18NGeneratorOptions) {
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