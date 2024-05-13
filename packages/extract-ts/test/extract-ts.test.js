const { describe, it, expect } = require('@jest/globals');
const { extractTs } = require('../');

describe('#extractTs', () => {
  it('#base', () => {
    const fileName = '/root/example.ts';
    const fileContent = `
    i18n('i18n text');
    i18n('i18n text');
    i18n('');
    i18n(\`\`);
    i18n('i18n text', 'subkey1');
    i18n('i18n text', 'subkey1');
    i18n('i18n text', { language: 'en', subkey: 'subkey2' });
    i18n(\`i18n text\`, [], { language: 'en', subkey: \`subkey3\` });
    i18n.jsEncode('jsEncode text', [i18n('sub i18n')]);

    i18n.t\`i18n.t msg1\`
    i18n.t\`i18n.t msg2 \${username}@\${corpname}\`
    i18n.t({ subkey: 'subkey4' })\`i18n.t msg3\`
    `;

    const result = extractTs({
      fileName,
      fileContent,
    });
    expect(result).toMatchSnapshot();
  });
});
