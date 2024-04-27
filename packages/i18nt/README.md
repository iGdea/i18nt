i18nt
======

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![NPM License][license-image]][npm-url]

生成翻译函数
# Install
```
npm install i18nt --save
```

# Usage

```javascript
const { i18nt } = require('i18nt');
const i18n = i18nt(translateData);

i18n('中文');   // chinese
i18n('中文', 'short');   // zh

i18n('我是%s', ['Bacra']);    // I‘m Bacra
i18n('我是%s', ['Bacra'], { langs: 'hk' });    // 我是Bacra

const username = 'Bacra';
i18n.t`我是${username}`  // I‘m Bacra
i18n.t({ langs: 'hk' })`我是${username}`  // 我是Bacra

```

[npm-image]: https://img.shields.io/npm/v/i18nt.svg
[downloads-image]: https://img.shields.io/npm/dm/i18nt.svg
[npm-url]: https://www.npmjs.org/package/i18nt
[license-image]: https://img.shields.io/npm/l/i18nt.svg
