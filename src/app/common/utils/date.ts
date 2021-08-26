import * as moment from 'moment';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export class DateUtils {
  static age(date: string | Date) {
    const birthDate = new Date(date.toString());
    const now = new Date();
    const birthDateInNowYear = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    return now.getFullYear() - birthDate.getFullYear() - (birthDateInNowYear > now ? 1 : 0);
  }

  static parse(date: string | Date, time: string = '00:00') {
    const [hours, minutes] = time.split(':');
    const result = new Date(moment(date).format());
    result.setHours(+hours, +minutes, 0, 0);
    return result;
  }

  static equals(date1: Date, date2: Date) {
    return date1.getTime() === date2.getTime();
  }

  static between(check: Date, start: Date, end: Date) {
    const result = (check.getTime() >= start.getTime() && check.getTime() <= end.getTime());
    return result;
  }

  static getMondayDate(date: string | Date) {
    const copy = new Date(moment(date).format());
    const day = copy.getDay();
    const normalizedDay = (day === 0 ? 7 : day);
    copy.setHours(0, 0, 0, 0);
    return new Date(copy.getTime() - ((normalizedDay - 1) * DAY));
  }

  static nowDate() {
    const result = new Date();
    result.setHours(0, 0, 0, 0);
    return result;
  }

  static addMinutes(date: string | Date, minutesCount: number) {
    const copy = new Date(moment(date).format());
    return new Date(copy.getTime() + (minutesCount * MINUTE));
  }

  static addDays(date: string | Date, dayCount: number) {
    const copy = new Date(moment(date).format());
    return new Date(copy.getTime() + (dayCount * DAY));
  }

  static addWeeks(date: string | Date, weekCount: number) {
    const copy = new Date(moment(date).format());
    return new Date(copy.getTime() + (weekCount * WEEK));
  }

  static toISODateString(date: string | Date) {
    const copy = new Date(moment(date).format());
    const normalized = new Date(copy.getTime() - copy.getTimezoneOffset() * MINUTE);
    return normalized.toISOString().substr(0, 10);
  }

  static toISODateTimeString(date: string | Date) {
    const copy = new Date(moment(date).format());
    const normalized = new Date(copy.getTime() - copy.getTimezoneOffset() * MINUTE);
    return normalized.toISOString().substr(0, 19);
  }

  static toISODateTimeStringStartOf(date: string | Date, type: moment.unitOfTime.StartOf) {
    const copy = new Date(moment(date).startOf(type).format());
    const normalized = new Date(copy.getTime() - copy.getTimezoneOffset() * MINUTE);
    return normalized.toISOString().substr(0, 19);
  }

  static toISODateTimeStringEndOf(date: string | Date, type: moment.unitOfTime.StartOf) {
    const copy = new Date(moment(date).endOf(type).format());
    const normalized = new Date(copy.getTime() - copy.getTimezoneOffset() * MINUTE);
    return normalized.toISOString().substr(0, 19);
  }

  static normalizeDate(date) {
    const copy = new Date(moment(date).format());
    return copy;
    // return new Date(copy.getTime() + copy.getTimezoneOffset() * MINUTE);
  }

  static toDateMap(difference) {
    return {
      minutes: Math.floor(difference % DAY % HOUR / MINUTE),
      hours: Math.floor(difference % DAY / HOUR),
      days: Math.floor(difference / DAY),
    };
  }

  static getDuration(from, to) {
    const { days, hours, minutes } = DateUtils.toDateMap(to - from);
    return (Boolean(days) ? days + 'д ' : '') +
      ((hours + '').length > 1 ? hours : '0' + hours) + ':' +
      ((minutes + '').length > 1 ? minutes : '0' + minutes);
  }

  static normalizeSeconds(date: Date) {
    const copy = new Date(moment(date).format());
    copy.setSeconds(0, 0);
    return copy;
  }

  static getCurrentMonthFirstDay() {
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  }

  static getCurrentMonthLastDay() {
    return new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  }

  static toMoscowDateTime(date: string, diffHours: number = 0) {
    return moment(date).add(-diffHours, 'hours');
  }
}
