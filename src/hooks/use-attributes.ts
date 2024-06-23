/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-11
 */

import {useState} from 'react';

type Callback<V = any> = (value: V) => V;

const useAttributes = <Attr = Record<string, any>>(values: Attr = {} as Attr) => {
  const [attributes, setAttributes] = useState<Attr>(values);

  const set = <T = any>(
    name: keyof typeof attributes,
    value: T | ((val: T) => T),
    checkUndefined: boolean = false): void => {
    if (checkUndefined && value === undefined) return;

    if (typeof value === 'function') {
      setAttributes(current => {
        const newCurrent = {...current}
        const output = (value as Callback<T>)(newCurrent[name] as T);
        return {...newCurrent, [name]: output};
      });
    } else {
      setAttributes(current => {
        return ({...current, [name]: value as T});
      });
    }
  };

  const get = <T = typeof attributes[keyof typeof attributes]>(name: keyof typeof attributes, defaultValue: T | undefined = undefined): T => {
    const value = attributes[name];
    return value === undefined || value === null || value === '' ? defaultValue as T : attributes[name] as unknown as T;
  };

  const remove = (name: keyof typeof attributes): void => {
    setAttributes(current => {
      const _current = {...current};
      delete _current[name];
      return _current;
    });
  };

  const clear = (): void => {
    setAttributes({} as Attr);
  };

  const setAll = (values: Attr, checkUndefined: boolean = false): void => {
    if (checkUndefined && values === undefined) return;
    setAttributes(values);
  };

  return [attributes, set, get, remove, clear, setAll] as const;
};

export default useAttributes;
