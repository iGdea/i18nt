import {
  translate,

  type TypeDataItem,
  type FullTypeData,
  type I18NOptions,
  type I18NFullOptions,
  type I18NInstance
} from './translate';


type I18NTaggedTemplateHandler = (strs: TemplateStringsArray, ...args: TypeDataItem[]) => string;
interface I18NTaggedTemplate<Lang extends string> {
  (strs: TemplateStringsArray, ...args: TypeDataItem[]): string;
  (options: I18NOptions<Lang>): I18NTaggedTemplateHandler;
}

export interface I18NHandlerEncode<Lang extends string> {
  (msg: string, tpldata: TypeDataItem[], options?: I18NOptions<Lang>): string;
  (msg: string, subkey: string, options?: Omit<I18NFullOptions<Lang>, 'subkey'>): string;
  (msg: string, options: I18NFullOptions<Lang>): string;
  (msg: string): string;

  // 性能太差，单独出函数
  // (strs: TemplateStringsArray, ...args: TypeDataItem[]): string;
  // (options: I18NOptions): I18NTaggedTemplate;
  t: I18NTaggedTemplate<Lang>,
};


export function createI18NByInstance<Lang extends string>(instance: I18NInstance, defEncodeKey?: string): I18NHandlerEncode<Lang> {
  const i18nt = <I18NHandlerEncode<Lang>>function (msg: string, arg2: any, arg3: any): string {
    if (!msg) return msg;
    // const [arg2, arg3] = args;

    let tpldata: FullTypeData | undefined,
      options: I18NOptions<Lang> | undefined = arg3;

    if (arg2) {
      if (arg2.split) {
        options = arg3
          ? { ...arg3, subkey: arg2 }
          : { subkey: arg2 };
      } else if (Array.isArray(arg2)) {
        tpldata = arg2;
      } else {
        options = arg2;
        tpldata = arg2.tpldata;
      }
    }

    return translate(instance, '' + msg, options || {}, tpldata, defEncodeKey);
  }

  i18nt.t = <I18NTaggedTemplate<Lang>>function (strs: any, ...args: TypeDataItem[]) {
    if (strs.raw) {
      if (strs.length === 1) {
        return translate(instance, strs[0], {}, undefined, defEncodeKey);
      } else {
        return translate(instance, strs.join('%s'), {}, args, defEncodeKey);
      }
    } else {
      const options: I18NOptions<Lang> = strs;

      const func: I18NTaggedTemplateHandler = (strs, ...args) => {
        if (strs.length === 1) {
          return translate(instance, strs[0], options, undefined, defEncodeKey);
        } else {
          return translate(instance, strs.join('%s'), options, args, defEncodeKey);
        }
      };
      return func;
    }
  }

  return i18nt;
}
