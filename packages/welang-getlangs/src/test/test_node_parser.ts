const expect = require('expect.js');

import type { ClientRequest } from 'http';
import { parseNodeAcceptLanguage, genParser } from '../lib/node-parser';

describe('#nodeParser', () => {
    const req = <ClientRequest>{
        getHeader(type: string) {
            type = type.toLowerCase();
            if (type === 'accept-language') {
                return 'zh,en;q=0.9,zh-CN;q=0.8';
            } else if (type === 'cookie') {
                return 'xxx1=111; __i18nc__1=zh1; __i18nc__2=zh,zh_hk,en; __i18nc__0=zh0; xxx2=222';
            }
        }
    };

    it('#parseNodeAcceptLanguage', () => {
        expect(parseNodeAcceptLanguage(req)).to.be('zh,en,zh_cn');
    });

    it('#parseNodeCookie', () => {
        expect(genParser.genParseNodeCookie('__i18nc__')(req)).to.be('zh,zh_hk,en');
    });
});
