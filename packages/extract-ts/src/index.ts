import ts from 'typescript';
import { traverse, type WordItem } from './lib/traverse';

export type ExtractOptions = {
  fileName: string,
  fileContent: string,
  i18nHandlerName?: string,
};

export type ExtractResult = {
  list: WordItem[]
};


export function extractTs({
  fileName,
  fileContent,
  i18nHandlerName = 'i18n',
}: ExtractOptions): ExtractResult {
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
    list: uniqWords(list),
  };
}


export function uniqWords(list: WordItem[]): WordItem[] {
  const existsMap: { [key: string]: true } = {};

  return list.filter(({ text, subkey }) => {
    const key = `${text}:::(${subkey === undefined ? '' : subkey})`;
    if (!existsMap[key]) {
      existsMap[key] = true;
      return true;
    }

    return false;
  });
}
