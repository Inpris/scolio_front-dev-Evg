/**
 * [Temporary] Get the first day of week depend on locale (0-6 represent as Sunday-Saturday)
 * @param locale Locale code
 */
export function firstDayOfWeek(locale?: string): number {
  return locale && ['zh-cn', 'zh-tw', 'ru'].indexOf(locale.toLowerCase()) > -1 ? 1 : 0;
}

export const customParsersFromFormat = {
  ['DD.MM.YYYY']: date => new Date(date.replace(/(\d+).(\d+).(\d+)/, '$2/$1/$3')),
  ['MM.YYYY']: date => new Date(date.replace(/([0-9]+)\.([0-9]+)/, '/$1.01./$2')),
};

export const customFormatterFromFormat = {
  ['DD.MM.YYYY']: date => date.replace(/([\D]+)/g, '.').replace(/(\d{4})\d+/, '$1'),
  ['MM.YYYY']: date => date.replace(/([\D]+)/g, '.').replace(/(\d{4})\d+/, '$1'),
};
