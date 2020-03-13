export function isFunction(functionToCheck: any) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
