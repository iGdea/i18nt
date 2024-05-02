import ts, {
  type Node,
  type ObjectLiteralExpression,
} from 'typescript';


export function getSubKeyFromOptions(node: ObjectLiteralExpression): string | undefined {
  let subkey: string | undefined;

  node.properties.some(subNode => {
    if (ts.isPropertyAssignment(subNode)
      && ts.isIdentifier(subNode.name)
      && subNode.name.text === 'subkey'
    ) {
      subkey = getStringLiteral(subNode.initializer);
      return true;
    }

    return false;
  });

  return subkey;
}

export function getStringLiteral(node: Node): string | undefined {
  if (ts.isStringLiteral(node)) {
    // 普通字符串
    return node.text;
  } else if (ts.isNoSubstitutionTemplateLiteral(node)) {
    // 没有变量的模版字符串
    return node.text;
  }
}


export function getTaggedTemplateMsgid(node: Node): string | undefined {
  if (ts.isNoSubstitutionTemplateLiteral(node)) {
    // 没有变量的模版字符串
    return node.text;
  } else if (ts.isTemplateExpression(node)) {
    // 带有变量的模版字符串
    const result: string[] = [node.head.text];
    node.templateSpans.forEach((subNode, index) => {
      result.push(`%{${index}}${subNode.literal.text}`);
    });

    return result.join('');
  }
}
