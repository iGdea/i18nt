export const translateData = {
  languages: ['en', 'hk'],
  common: {
    '上午好': ['en:Good morning', 'hk:早安'],
    '下午好': ['en:Good afternoon'],
    '你好，%s': ['en:Hello, %s'],
    '你好，%{name}': ['en:Hello, %{name}'],
  },
  subkeys: {
    'love': {
      '下午好': [],
      '你好，%s': ['en:HI, %s', 'hk:你好，%s'],
    }
  },
};


export const oldstyle = {
  $: translateData.languages,
  '*': translateData.common,

  ...translateData.subkeys,
};
