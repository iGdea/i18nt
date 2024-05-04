@i18n.t/extract
===============

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![NPM License][license-image]][npm-url]

解析 js/ts 文件，将使用 `i18n` 包裹的翻译词条输出


## Install
```
npm install @i18n.t/extract --save
```

## Usage

```javascript
const { extract } = require('@i18n.t/extract');
const { list } = extract({ fileName, fileContent, i18nHandlerName });

// extract word list
```


[npm-image]: https://img.shields.io/npm/v/@i18n.t/extract.svg
[downloads-image]: https://img.shields.io/npm/dm/@i18n.t/extract.svg
[npm-url]: https://www.npmjs.org/package/@i18n.t/extract
[license-image]: https://img.shields.io/npm/l/@i18n.t/extract.svg
