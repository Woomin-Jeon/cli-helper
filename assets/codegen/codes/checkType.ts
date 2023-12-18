export const checkType = (value: any) => {
  const type = Object.prototype.toString.call(value);

  switch (type) {
    case '[object String]':
      return 'string';
    case '[object Number]':
      return 'number';
    case '[object Array]':
      return 'array';
    case '[object Object]':
      return 'object';
    case '[object Null]':
      return 'null';
    case '[object Undefined]':
      return 'undefined';
    default:
      return null;
  }
};
