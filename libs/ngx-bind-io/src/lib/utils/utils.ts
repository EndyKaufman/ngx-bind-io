export function isFunction(functionToCheck: any) {
  const result = functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  return result;
}
