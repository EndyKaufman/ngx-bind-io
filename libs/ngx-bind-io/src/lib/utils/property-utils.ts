type ValueByProp = Map<string, any>;

const values: WeakMap<Object, ValueByProp> = new WeakMap();

function valueMap(instance: any): ValueByProp {
  let _valueMap = values.get(instance);

  if (!_valueMap) {
    _valueMap = new Map<string, any>();
    values.set(instance, _valueMap);
  }

  return _valueMap;
}

export function redefineSimpleProperty(target: any, propertyKey: string, callback?: Function): void {
  Object.defineProperty(target, propertyKey, {
    configurable: true,
    enumerable: true,
    set(value) {
      valueMap(this).set(propertyKey, value);
      if (callback) {
        callback(value);
      }
    },
    get() {
      return valueMap(this).get(propertyKey);
    }
  });
}

export function redefineAccessorProperty(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
  callback?: Function
): void {
  Object.defineProperty(target, propertyKey, {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    set(value) {
      if (!descriptor.set) {
        throw new Error(`Property ${propertyKey} doesn't have a setter and cannot be written`);
      }
      descriptor.set.call(this, value);
      if (!descriptor.get) {
        callback(value);
      } else {
        callback(descriptor.get());
      }
    },
    get(): any {
      if (!descriptor.get) {
        throw new Error(`Property ${propertyKey} doesn't have a getter and cannot be read`);
      }
      return descriptor.get.call(this);
    }
  });
}

export function getPropDescriptor(target: object, propertyKey: string | number | symbol) {
  let originalDescriptor = Reflect.getOwnPropertyDescriptor(target, propertyKey);
  let setter = originalDescriptor && originalDescriptor.set;
  let getter = originalDescriptor && originalDescriptor.get;
  const value =
    originalDescriptor && Object.getOwnPropertyDescriptor(originalDescriptor, 'value')
      ? originalDescriptor.value
      : target[propertyKey];
  if (!setter || (target as { __lookupSetter__: Function }).__lookupSetter__(propertyKey)) {
    setter = (target as { __lookupSetter__: Function }).__lookupSetter__(propertyKey);
  }
  if (!getter || (target as { __lookupGetter__: Function }).__lookupGetter__(propertyKey)) {
    getter = (target as { __lookupGetter__: Function }).__lookupGetter__(propertyKey);
  }
  if (!originalDescriptor && setter && getter) {
    originalDescriptor = {
      configurable: true,
      enumerable: true,
      set: setter.bind(target),
      get: getter.bind(target)
    };
  }
  return {
    originalDescriptor: originalDescriptor,
    value,
    setter,
    getter
  };
}
