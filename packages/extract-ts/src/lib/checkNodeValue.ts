import ts, { type Node } from 'typescript';

const EncodeHandlerNames = ['jsEncode', 'urlEncode', 'htmlEncode'];


/**
 * 判断 weLANG
 */
export function isI18N(node: Node, i18nHandlerName: string): boolean {
  return ts.isIdentifier(node)
    && node.escapedText === i18nHandlerName;
}

/**
 * weLANG.jsEncode
 */
export function isI18NEncode(node: Node, i18nHandlerName: string): boolean {
  return ts.isPropertyAccessExpression(node)
    && isI18N(node.expression, i18nHandlerName)

    // 判断部分：jsEncode
    && ts.isIdentifier(node.name)
    && EncodeHandlerNames.indexOf('' + node.name.escapedText) !== -1;
}


/**
 * 判断 weLANG.t 或 weLANG.jsEncode.t
 */
export function isI18N_t(node: Node, i18nHandlerName: string): boolean {
  return ts.isPropertyAccessExpression(node)
    // 判断部分：t
    && ts.isIdentifier(node.name)
    && node.name.escapedText === 't'

    // 判断部分：weLANG 或 weLANG.jsEncode
    && (isI18N(node.expression, i18nHandlerName)
    || isI18NEncode(node.expression, i18nHandlerName));
}
