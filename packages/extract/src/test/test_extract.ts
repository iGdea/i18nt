import expect from 'expect.js';

import { extract } from '../';

describe('#extract', () => {
  it('#base', () => {
    const fileName = '/root/example.ts';
    const fileContent = `
    i18n('i18n text', 'subtype');
    i18n.jsEncode('jsEncode text', [i18n('sub i18n')]);

    i18n.t\`i18n.t msg\`
    i18n.t({ subkey: 'subtype' })\`i18n.t msg2\`
    `;

    const result = extract({
      fileName,
      fileContent,
    });
    expect(result).to.eql({
      list: [
        { text: 'i18n text', subkey: 'subtype' },
        { text: 'jsEncode text', subkey: undefined },
        { text: 'sub i18n', subkey: undefined },
        { text: 'i18n.t msg' },
        { text: 'i18n.t msg2', subkey: 'subtype' }
      ]
    });
  });
});
