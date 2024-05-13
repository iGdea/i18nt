const { describe, it, expect } = require('@jest/globals');
const { extract } = require('../');

describe('#extract', () => {
  it('#ts', () => {
    const result = extract({
      fileName: '/root/example.ts',
      fileContent: `
      i18n('i18n text');
      i18n('i18n text', 'subkey1');
      `,
    });

    expect(result).toMatchSnapshot();
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

    expect(result).toMatchSnapshot();
  });
});
