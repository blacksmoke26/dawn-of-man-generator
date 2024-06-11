/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-11
 */

import {useState} from 'react';

const useAttributes = <Attr = Record<string, any>>(values: Attr = {} as Attr) => {
  const [attributes, setAttributes] = useState<Attr>(values);

  const set = <T = any>(name: keyof typeof attributes, value: T): void => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const get = <T = typeof attributes[keyof typeof attributes]>(name: keyof typeof attributes) => {
    return attributes[name] as unknown as T;
  };

  return [attributes, set, get] as const;
};

export default useAttributes;
