import { getlangs, GetLangs } from './lib/getlangs';
import {
    translate,

    TypeData,
    TranslateData,
    WELANGOptions,
    WELANGInstance
} from './lib/translate';

import { encoders, Encoders } from './lib/encoders';

type WELANGTaggedTemplateHandler = (strs: TemplateStringsArray, ...args: TypeData[]) => string;
interface WELANGTaggedTemplate {
    (strs: TemplateStringsArray, ...args: TypeData[]): string;
    (options: WELANGOptions): WELANGTaggedTemplateHandler;
}

export type I18NGeneratorOptions = {
    getlangs?: GetLangs,
    encoders?: Encoders,
};

export interface WELANGHandler {
    (msg: string, tpldata: TypeData[], options?:WELANGOptions): string;
    (msg: string, subkey: string): string;
    (msg: string, options: WELANGOptions): string;
    (msg: string): string;

    // 性能太差，单独出函数
    // (strs: TemplateStringsArray, ...args: TypeData[]): string;
    // (options: WELANGOptions): WELANGTaggedTemplate;
    t: WELANGTaggedTemplate,
};


const GlobalTempWELANGoptions: WELANGOptions = { subkey: undefined };

export function welang(translateData: TranslateData, options?: I18NGeneratorOptions): WELANGHandler {
    const myEncoders = options?.encoders
        ? { ...encoders, ...options.encoders }
        : encoders;

    const instance: WELANGInstance = {
        cache: {},
        translateData,

        getlangs: options?.getlangs || getlangs,
        encoders: myEncoders,
    };

    const welang = <WELANGHandler>function(msg: string, arg2: any, arg3: any): string {
        if (!msg) return msg;
        // const [arg2, arg3] = args;

        let tpldata: TypeData[] | undefined,
            options: WELANGOptions | undefined = arg3;

        if (arg2) {
            if (arg2.split) {
                GlobalTempWELANGoptions.subkey = arg2;
                options = GlobalTempWELANGoptions;
            } else if (Array.isArray(arg2)) {
                tpldata = arg2;
            } else {
                options = arg2;
            }
        }

        return translate(instance, '' + msg, tpldata, options);
    }

    welang.t = <WELANGTaggedTemplate>function(strs: any, ...args: TypeData[]) {
        if (strs.raw) {
            if (strs.length === 1) {
                return translate(instance, strs[0]);
            } else {
                return translate(instance, strs.join('%s'), args);
            }
        } else {
            const options: WELANGOptions = strs.split ? { subkey: strs } : strs;

            const func:WELANGTaggedTemplateHandler = (strs, ...args) => {
                if (strs.length === 1) {
                    return translate(instance, strs[0], undefined, options);
                } else {
                    return translate(instance, strs.join('%s'), args, options);
                }
            };
            return func;
        }
    }

    return welang;
}
