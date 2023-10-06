/**
 * @description Date의 요일을 반환하는 함수입니다. 월화수목금토일
 */
const getDayNameOfWeek = (date: Date) => {
  const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
  return DAY_NAMES[date.getDay()];
};
