import {
  extractTs,
  type ExtractOptions,
  type ExtractResult,
} from '@i18n.t/extract-ts';

import { extractVue } from '@i18n.t/extract-vue';
import { extname } from 'path';

export function extract(options: ExtractOptions): ExtractResult {
  const extName = options.fileName && extname(options.fileName);
  return extName === '.vue' ? extractVue(options) : extractTs(options);
}
