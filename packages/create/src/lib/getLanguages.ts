import { getLanguages as Getlanguages } from '@i18n.t/getlanguages';

export type GetLanguages<Lang extends string> = () => Lang | undefined;

const getLanguages4browser = Getlanguages.genFromWebCookie('__i18nt__');
const getLanguages4node = Getlanguages.fromProcessDomain;

export const getLanguages: GetLanguages<any> = Getlanguages.genGetLanguagesForD2(
  '__i18nt__',
  {
    getLanguages4browser,
    getLanguages4node,
  });
