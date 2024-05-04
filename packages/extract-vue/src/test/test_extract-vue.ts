import expect from 'expect.js';

import { extractVue } from '../';

describe('#extract', () => {
  it('#base', () => {
    const fileName = '/root/example.vue';
    const fileContent = `
    <template>
      <div
        :xx1="i18n('i18n arr1')"
        :xx2="i18n('i18n arr2', 'subkey1')"
        :xx3="i18n.t({ subkey: 'subkey2' })\`i18n.t arr3\`"
      >
        {{i18n('i18n text1')}}
        {{i18n('i18n text2', 'subkey1')}}
        {{i18n.t({ subkey: 'subkey2' })\`i18n.t text3\`}}
      </div>
    </template>
    <script>
      i18n('i18n script1');
      i18n('');
      i18n(\`\`);
      i18n('i18n script2', 'subkey1');
      i18n('i18n script3', { language: 'en', subkey: 'subkey2' });
      i18n.jsEncode('jsEncode script4', [i18n('sub i18n')]);
    </script>
    `;

    const result = extractVue({
      fileName,
      fileContent,
    });
    expect(result).to.eql({
      list: [
        { text: 'i18n text1', subkey: undefined },
        { text: 'i18n text2', subkey: 'subkey1' },
        { text: 'i18n.t text3', subkey: 'subkey2' },
        { text: 'i18n arr1', subkey: undefined },
        { text: 'i18n arr2', subkey: 'subkey1' },
        { text: 'i18n.t arr3', subkey: 'subkey2' },
        { text: 'i18n script1', subkey: undefined },
        { text: 'i18n script2', subkey: 'subkey1' },
        { text: 'i18n script3', subkey: 'subkey2' },
        { text: 'jsEncode script4', subkey: undefined },
        { text: 'sub i18n', subkey: undefined },
      ]
    });
  });
});
