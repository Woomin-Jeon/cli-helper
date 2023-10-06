/**
 * @description Date의 year, month, date, hour, minute, second를 반환하는 함수입니다. 년월일시분초
 */
const getDateFormat = (date: Date) => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  date: date.getDate(),
  hour: date.getHours(),
  minute: date.getMinutes(),
  second: date.getSeconds(),
});
