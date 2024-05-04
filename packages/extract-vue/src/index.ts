import {
  parse,
  type SimpleExpressionNode,
  type TextNode,
  type TemplateChildNode,
} from '@vue/compiler-dom';

import {
  extract,
  uniq,
  type ExtractOptions,
  type ExtractResult,
} from '@i18n.t/extract';


export function extractVue({
  fileName,
  fileContent,
  i18nHandlerName,
}: ExtractOptions): ExtractResult {
  const result: ExtractResult = { list: [] };
  const parsed = parse(fileContent, {});

  traverseAST(parsed, (node) => {
    if (node.type === 4) {
      extractItem(node);
    } else if (node.type === 1 && node.tag === 'script') {
      node.children.forEach((node) => {
        if (node.type === 2) extractItem(node);
      });
    }
  });

  function extractItem(node: SimpleExpressionNode | TextNode) {
    if (typeof node.content === 'string') {
      const { list } = extract({
        fileName,
        fileContent: node.content,
        i18nHandlerName,
      });

      if (list.length) result.list.push(...list);
    }
  }

  result.list = uniq(result.list);

  return result;
};


// 递归函数，用于遍历 AST 并找到所有满足条件的节点
function traverseAST(node: any, callback: (node: SimpleExpressionNode | TemplateChildNode) => void) {
  // 应用回调函数
  callback(node);

  // 遍历子节点
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      traverseAST(child, callback);
    }
  }

  // 检查其他可能包含嵌套 AST 的属性
  if (node.props) {
    for (const prop of node.props) {
      if (prop.exp) {
        traverseAST(prop.exp, callback);
      }
    }
  }

  if (node.directives) {
    for (const directive of node.directives) {
      if (directive.exp) {
        traverseAST(directive.exp, callback);
      }
    }
  }

  if (node.key?.type) {
    traverseAST(node.key, callback);
  }

  if (node.argument?.type) {
    traverseAST(node.argument, callback);
  }

  if (node.content?.type) {
    traverseAST(node.content, callback);
  }
}
