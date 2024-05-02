import ts, {
  type Node,
  type Expression,
  type NodeArray,
} from 'typescript';

import {
  getStringLiteral,
  getSubKeyFromOptions,
  getTaggedTemplateMsgid,
} from './getValue';

import {
  isI18N,
  isI18NEncode,
  isI18N_t,
} from './checkNodeValue';

export type WordItem = {
  text: string,
  subkey?: string,
};


export function traverse(node: Node, wordList: WordItem[], i18nHandlerName: string) {
  // weLANG函数执行
  if (ts.isCallExpression(node)) {
    // 示例：weLANG('111')

    // 判断部分：weLANG
    if (isI18N(node.expression, i18nHandlerName)) {
      const wordItem = extractI18NCallArgs(node.arguments);
      if (wordItem) wordList.push(wordItem);
    }


    // 示例：weLANG.jsEncode('111')
    else if (isI18NEncode(node.expression, i18nHandlerName)) {
      const wordItem = extractI18NCallArgs(node.arguments);
      if (wordItem) wordList.push(wordItem);
    }
  }


  // 字符串模版
  else if (ts.isTaggedTemplateExpression(node)) {
    // 示例：weLANG.t`xxxx${username}`
    // 示例：weLANG.jsEncode.t`xxxx${username}`

    if (isI18N_t(node.tag, i18nHandlerName)) {
      const text = getTaggedTemplateMsgid(node.template);
      if (text) wordList.push({ text });
    }


    // 示例：weLANG.t({ subkey: '' })`xxxx${username}`
    // 示例：weLANG.t({ subkey: '' })`xxxx${username}`
    // 示例：weLANG.jsEncode.t({ subkey: '' })`xxxx${username}`
    else if (ts.isCallExpression(node.tag)
      && isI18N_t(node.tag.expression, i18nHandlerName)
    ) {
      const text = getTaggedTemplateMsgid(node.template);

      if (text) {
        const callArg0 = node.tag.arguments[0];
        const subkey = callArg0
          && ts.isObjectLiteralExpression(callArg0)
          && getSubKeyFromOptions(callArg0);

        wordList.push({
          text,
          subkey: subkey || undefined,
        });
      }
    }
  }


  // 递归遍历
  ts.forEachChild(node, (child) => {
    traverse(child, wordList, i18nHandlerName);
  });
}


function extractI18NCallArgs(callArgs: NodeArray<Expression>): WordItem | undefined {
  if (callArgs.length) {
    const text = getStringLiteral(callArgs[0]);
    if (!text) return;

    let subkey: string | undefined;
    if (callArgs[1]) {
      if (ts.isObjectLiteralExpression(callArgs[1])) {
        subkey = getSubKeyFromOptions(callArgs[1]);
      } else {
        subkey = getStringLiteral(callArgs[1]);
      }
    }

    if (!subkey && callArgs[2] && ts.isObjectLiteralExpression(callArgs[2])) {
      subkey = getSubKeyFromOptions(callArgs[2]);
    }

    return { text, subkey };
  }
}
