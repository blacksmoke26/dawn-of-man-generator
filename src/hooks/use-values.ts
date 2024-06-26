/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-20
 * @version 2.3.0
 */

import {useState} from 'react';
import objPath, {Path} from 'object-path';

// types
import type {ValueType, UseValuesHook} from './use-values.types';

const useValues = <T extends object, RT = any>(initialValues: T): UseValuesHook<T, RT> => {
  const [values, setValues] = useState<T>(initialValues);

  return {
    data: values,
    get(name, defaultValue = undefined) {
      return objPath.get(values, name as Path, defaultValue);
    },
    getAll() {
      return values;
    },
    set(name, value, checkUndefined = false) {
      if (checkUndefined && value === undefined) return;

      if (this.hasKey(name as keyof T)) {
        // A property is given
        setValues(current => {
          const newValue = 'function' === typeof value
            ? (value as ValueType)(current[name as keyof T])
            : value;

          return ({...current, [name as keyof T]: newValue});
        });

        return;
      }

      // A path is given
      setValues(current => {
        const newCurrent = {...current};
        const newValue = 'function' === typeof value
          ? (value as ValueType)(objPath.get(current, name as Path))
          : value;

        objPath.set(newCurrent, name as Path, newValue);
        return newCurrent;
      });
    },
    setAll(newValues: T) {
      setValues(newValues);
    },
    overwrite(name, value, checkUndefined = false) {
      if (checkUndefined && value === undefined) return;
      this.empty(name as Path);
      this.set(name as Path, value);
    },
    empty(name) {
      setValues(prevState => {
        const newState = {...prevState};
        objPath.empty(newState, name as Path);
        return newState;
      });
    },
    is(name, compare) {
      if (!Array.isArray(compare)) {
        return this.get(name as Path) === compare;
      }

      // noinspection LoopStatementThatDoesntLoopJS
      for (const comp of compare) {
        return this.get(name as Path) === comp as unknown;
      }

      return false;
    },
    hasKey(key) {
      return key in values;
    },
    hasPath(path) {
      return objPath.has(values, path);
    },
    clear() {
      setValues({} as T);
    },
    remove(name) {
      setValues(prevState => {
        const newState = {...prevState};
        objPath.del(newState, name as Path);
        return newState;
      });
    },
  };
};

export default useValues;
