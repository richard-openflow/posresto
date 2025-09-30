import moment from 'moment-timezone';
import mmnt from 'moment';

const convertToTimezone = (t, posTz = 'Etc/Gmt') => {
  return new Date(
    new Date(
      moment(t)
        .clone()
        // .tz(`Etc/Gmt${(ff > 0 ? "-" : "+")}${ff}`)
        .tz(posTz.replace(/[+\-]/g, match => (match === '+' ? '-' : '+')))
        .format('YYYY/MM/DD HH:mm:ss'),
    ).toUTCString(),
  );
};
const convertTo = (date = new Date()) => {
  try {
    return moment(
      moment().clone().tz(tzLocal).format('YYYY/MM/DD HH:mm:ss'),
      'YYYY/MM/DD HH:mm:ss',
    );
  } catch (error) {
    return mmnt(date).add(new Date().getTimezoneOffset(), 'minute');
  }
};
const getTimeZone = second => {
  try {
    return Intl.DateTimeFormat()?.resolvedOptions()?.timeZone;
  } catch (error) {
    const tt = new Date().getTimezoneOffset() / 60;
    if (tt !== 0) return 'ETC/GMT' + tt;
    return 'ETC/GMT';
  }
};
const convertToTimeZoneManual = (STime, tz, inv = false) => {
  try {
    let timezone = tz.toUpperCase();
    if (inv)
      timezone = tz?.toUpperCase()?.replace(/[+\-]/g, a => (a === '+' ? '-' : '+'));
    if (timezone === 'ETC/GMT') return STime;
    const a = timezone.slice(7);
    if (a[0] === '+') return STime + 60 * 60 * 1000 * parseInt(a[1]);
    else if (a[0] === '-') return STime - 60 * 60 * 1000 * parseInt(a[1]);
    else return STime;
  } catch (error) {
    return STime;
  }
};

export { convertToTimezone, convertToTimeZoneManual };
