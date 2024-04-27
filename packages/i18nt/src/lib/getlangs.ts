import { getlangs as Getlangs } from 'i18nt-getlangs';

export type GetLangs = (data: Object) => string;

const getlangs4browser = Getlangs.genFromWebCookie('__i18nt__');
const getlangs4node = Getlangs.fromProcessDomain;

export const getlangs: GetLangs = Getlangs.genGetLangsForD2('__i18nt__', { getlangs4browser, getlangs4node });
