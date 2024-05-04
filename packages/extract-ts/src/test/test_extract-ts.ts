import expect from 'expect.js';

import { extractTs } from '../';

describe('#extractTs', () => {
  it('#base', () => {
    const fileName = '/root/example.ts';
    const fileContent = `
    i18n('i18n text');
    i18n('i18n text');
    i18n('');
    i18n(\`\`);
    i18n('i18n text', 'subtype1');
    i18n('i18n text', 'subtype1');
    i18n('i18n text', { language: 'en', subkey: 'subtype2' });
    i18n(\`i18n text\`, [], { language: 'en', subkey: \`subtype3\` });
    i18n.jsEncode('jsEncode text', [i18n('sub i18n')]);

    i18n.t\`i18n.t msg1\`
    i18n.t\`i18n.t msg2 \${username}@\${corpname}\`
    i18n.t({ subkey: 'subtype4' })\`i18n.t msg3\`
    `;

    const result = extractTs({
      fileName,
      fileContent,
    });
    expect(result).to.eql({
      list: [
        { text: 'i18n text', subkey: undefined },
        { text: 'i18n text', subkey: 'subtype1' },
        { text: 'i18n text', subkey: 'subtype2' },
        { text: 'i18n text', subkey: 'subtype3' },
        { text: 'jsEncode text', subkey: undefined },
        { text: 'sub i18n', subkey: undefined },
        { text: 'i18n.t msg1' },
        { text: 'i18n.t msg2 %{0}@%{1}' },
        { text: 'i18n.t msg3', subkey: 'subtype4' }
      ]
    });
  });
});
