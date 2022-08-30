WELANG
======

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![NPM License][license-image]][npm-url]

生成翻译函数
# Install
```
npm install welang --save
```

# Usage

```javascript
const { welang } = require('welang');
const weLANG = welang(translateData);

weLANG('中文');   // chinese
weLANG('中文', 'short');   // zh

weLANG('我是%s', ['Bacra']);    // I‘m Bacra
weLANG('我是%s', ['Bacra'], { langs: 'hk' });    // 我是Bacra

const username = 'Bacra';
weLANG.t`我是${username}`  // I‘m Bacra
weLANG.t({ langs: 'hk' })`我是${username}`  // 我是Bacra

```

[npm-image]: https://img.shields.io/npm/v/welang.svg
[downloads-image]: https://img.shields.io/npm/dm/welang.svg
[npm-url]: https://www.npmjs.org/package/welang
[license-image]: https://img.shields.io/npm/l/welang.svg
