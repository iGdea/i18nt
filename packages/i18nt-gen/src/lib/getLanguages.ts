import { getLanguages as Getlanguages } from 'i18nt-getlanguages';

export type GetLanguages = () => string | undefined;

const getLanguages4browser = Getlanguages.genFromWebCookie('__i18nt__');
const getLanguages4node = Getlanguages.fromProcessDomain;

export const getLanguages: GetLanguages = Getlanguages.genGetLanguagesForD2(
  '__i18nt__',
  {
    getLanguages4browser,
    getLanguages4node,
  });
