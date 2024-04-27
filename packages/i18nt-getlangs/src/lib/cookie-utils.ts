
export function genCookieRegExp(cookieName: string) {
  return new RegExp(`(?:^|;) *${cookieName}(\\d*?)=([^;]+)`, 'g');
}

export function getLangsFromCookie(cookie: string, reg: RegExp): string | undefined {
  const cookieLans: string[] = [];
  const splitArr = cookie.split(reg);

  // 从1开始，避免结束的部分又重新计算
  for (let i = 1, len = splitArr.length; i < len; i += 3) {
    cookieLans[+splitArr[i] || 0] = splitArr[i + 1];
  }

  const lang = cookieLans.length && cookieLans[cookieLans.length - 1];
  if (lang) return decodeURIComponent(lang);
}
