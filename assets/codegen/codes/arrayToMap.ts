/**
 * @description 배열을 Mapper 객체로 만드는 함수
 */
const arrayToMap = <T extends Record<string, any>>(arr: T[], key: keyof T) => arr.reduce<Record<string, T>>((map, data) => ({ ...map, [data[key]]: data }), {});
