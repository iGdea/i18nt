@i18n.t/create
=========

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![NPM License][license-image]][npm-url]

生成翻译函数

## Install
```
npm install @i18n.t/create --save
```

## Usage

```javascript
const { createI18N } = require('@i18n.t/create');
const i18n = createI18N(translateData);

i18n('中文');   // chinese
i18n('中文', 'short');   // zh

i18n('我是%s', ['Bacra']);    // I‘m Bacra
i18n('我是%s', ['Bacra'], { language: 'hk' });    // 我是Bacra
i18n('我是%{1} %{0}', ['woo', 'Bacra']);          // 我是Bacra woo
i18n('我是%{username} %{firstname}', { tpldata: { username: 'Bacra' firstname: 'woo' } });  // 我是Bacra woo

const username = 'Bacra';
i18n.t`我是${username}`  // I‘m Bacra
i18n.t({ language: 'hk' })`我是${username}`  // 我是Bacra
i18n.t({ encode: 'urlEncode' })`我是${{ text: username, encode: false }}`  // %E6%88%91%E6%98%AFBacra
```


[npm-image]: https://img.shields.io/npm/v/i18nt.svg
[downloads-image]: https://img.shields.io/npm/dm/i18nt.svg
[npm-url]: https://www.npmjs.org/package/i18nt
[license-image]: https://img.shields.io/npm/l/i18nt.svg
