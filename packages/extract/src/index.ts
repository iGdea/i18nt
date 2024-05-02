import ts from 'typescript';
import { traverse, type WordItem } from './lib/traverse';

export function extract({
  fileName,
  fileContent,
  i18nHandlerName = 'i18n',
}: {
  fileName: string,
  fileContent: string,
  i18nHandlerName?: string,
}) {
  // 创建SourceFile对象
  const sourceFile = ts.createSourceFile(
    fileName,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  const list: WordItem[] = [];
  traverse(sourceFile, list, i18nHandlerName);

  return {
    list,
  };
}
