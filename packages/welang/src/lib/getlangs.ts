import { getlangs as Getlangs } from 'welang-getlangs';

export type GetLangs = (data: Object) => string;

const getlangs4browser = Getlangs.genFromWebCookie('__i18nc__');
const getlangs4node = Getlangs.fromProcessDomain;

export const getlangs: GetLangs = Getlangs.genGetLangsForD2('__i18nc__', { getlangs4browser, getlangs4node });
