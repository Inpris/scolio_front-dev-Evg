export const extract = (obj: object = {}, path: string = ''): any =>
  !Boolean(path) && obj ||
  path.split('.')
    .reduce(
      (acc, val) => acc ? acc[val] : null, obj,
    );

export const isEquals = (actual: Object, expected: Object) => {
  const actualProps = Object.getOwnPropertyNames(actual);
  const expectedProps = Object.getOwnPropertyNames(expected);
  if (actualProps.length !== expectedProps.length) {
    return false;
  }

  for (const propName of actualProps) {
    if (actual[propName] !== expected[propName]) {
      return false;
    }
  }
  return true;
};
