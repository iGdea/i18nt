import {
  extractTs,
  type ExtractOptions,
  type ExtractResult,
} from '@i18n.t/extract-ts';

import { extractVue } from '@i18n.t/extract-vue';

export function extract(options: ExtractOptions): ExtractResult {
  return options.fileName.endsWith('.vue') ? extractVue(options) : extractTs(options);
}
