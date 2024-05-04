import expect from 'expect.js';

import { extract } from '../';

describe('#extract', () => {
  it('#ts', () => {
    const result = extract({
      fileName: '/root/example.ts',
      fileContent: `
      i18n('i18n text');
      i18n('i18n text', 'subkey1');
      `,
    });
    expect(result).to.eql({
      list: [
        { text: 'i18n text', subkey: undefined },
        { text: 'i18n text', subkey: 'subkey1' },
      ]
    });
  });


  it('#vue', () => {
    const result = extract({
      fileName: '/root/example.vue',
      fileContent: `
      <template>
        <div :xxx1="i18n('i18n attr')">
          {{i18n('i18n text')}}
        </div>
      </template>
      <script>
        i18n('i18n script');
        i18n('i18n script', 'subkey1');
      </script>
      `,
    });
    expect(result).to.eql({
      list: [
        { text: 'i18n text', subkey: undefined },
        { text: 'i18n attr', subkey: undefined },
        { text: 'i18n script', subkey: undefined },
        { text: 'i18n script', subkey: 'subkey1' },
      ]
    });
  });
});
