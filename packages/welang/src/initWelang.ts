import { encoders } from './lib/encoders';
import type { TranslateData } from './lib/translate';

import {
  welang,

  I18NGeneratorOptions,
  WELANGHandler,
} from './welang';


export function initWelang(options: I18NGeneratorOptions) {
  let defaultOptions: I18NGeneratorOptions = mergeOptions({}, options);

  return function (translateData: TranslateData, options?: I18NGeneratorOptions): WELANGHandler {
    return welang(translateData, options ? mergeOptions(defaultOptions, options) : defaultOptions);
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
