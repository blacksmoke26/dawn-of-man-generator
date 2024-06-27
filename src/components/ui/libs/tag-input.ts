/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-27
 * @version 2.3.0
 */

import React from 'react';

// types
import type {Required} from 'utility-types';
import type {Props} from '../TagNumberInput';

export interface Option {
  readonly label: string;
  readonly value: string;
}

export interface HandleKeyDownArgs {
  event: KeyboardEvent;
  newProps: Required<Props>;
  setValue: React.Dispatch<React.SetStateAction<readonly Option[]>>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputValue: string;
}

export interface NormalizeNumberArgs {
  step: number;
  min: number;
  max: number;
  shouldAdd?: null | false | true;
}

const safeKeys: string[] = [
  'Control', 'Alt', 'ArrowUp', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'Shift',
  'Backspace', 'Delete', 'Tab', 'Enter',
];

/**
 * Checks whether the `eventKey` is allowed as numeric as well as safe keys
 * @param eventKey - The event key
 * @param enterKey - Additional key to check
 * @returns Whatever event key is allowed or not
 */
export const isNumericKey = (eventKey: string, enterKey: string): boolean => {
  // Allow numeric keys, backspace, delete, and decimal point and suppoerted enter key
  return (new RegExp(`[0-9]|\\.|${safeKeys.join('|')}|${enterKey}`)).test(eventKey);
};

/**
 * Normalizes the given value as numeric, also support empty values or . at the end of the string
 * @param value - The value to normalize
 * @param args - The arguments to pass to the
 * @returns The normalized numeric string
 */
export const normalizeNumber = (value: number | string, args: NormalizeNumberArgs): number | string => {
  const {step, min, max, shouldAdd = null} = args;
  const newVal = String(value).replace(/\.+/, '.');

  if (!String(newVal).trim() || String(newVal).endsWith('.')) {
    return newVal;
  }

  let num = finalNumber(+newVal, step, shouldAdd);

  if (min !== undefined) {
    num = num < min ? min : num;
  }

  if (max !== undefined) {
    return num > max ? max : num;
  }

  return num;
};

/**
 * An event handler the check the pressed keys and update values based on the pressed keys
 * @param args - The event arguments
 * @see TagNumberInput
 */
export const handleKeyDownHandler = (args: HandleKeyDownArgs) => {
  const {event, newProps, setValue, setInputValue, inputValue} = args;

  if (!isNumericKey(event.key, newProps.enterKey)) {
    setInputValue(current => {
      return !isNaN(parseFloat(current))
        ? current
        : '';
    });
    return event.preventDefault();
  }

  if (event.key === '.' && !newProps.step.toString().includes('.')) {
    setInputValue(current => current.replace('.', ''));
    return event.preventDefault();
  }

  if (event.key === 'ArrowUp') {
    setInputValue(current => '' + normalizeNumber(+current, {...newProps, shouldAdd: true}));
    return event.preventDefault();
  }

  if (event.key === 'ArrowDown') {
    setInputValue(current => '' + normalizeNumber(+current, {...newProps, shouldAdd: false}));
    return event.preventDefault();
  }

  switch (event.key) {
    case newProps.enterKey:
      setValue(prev => {
        const inpValue = parseFloat(inputValue).toString();
        return filterUniqueOptions([...prev, createOption(inpValue, inpValue)]);
      });
      setInputValue('');
      event.preventDefault();
  }
};


/**
 * Parses the input value as number and based on step increase or decrease numeric values
 * @param num - The number
 * @param step - Step increment/decrement
 * @param shouldAdd - Should increment/decrement the value, null for no increment/decrement
 * @return The normalized number
 * @see normalizeNumber
 */
export const finalNumber = (num: number, step: number, shouldAdd: boolean | null = true): number => {
  const hasFloat = step.toString().includes('.');

  const decimals = !hasFloat
    ? 0
    : +step.toString().replace(/^.+\./, '').length;

  const theNum = shouldAdd === null ? num : (shouldAdd ? num + step : num - step);
  return +theNum.toFixed(decimals);
};

/**
 * Create a react-select option
 * @param label - The Label
 * @param value - The value
 * @returns Option object
 */
export const createOption = (label: string, value: string): Option => ({label, value});

/**
 * Remove duplicate options from the array
 * @param options - The options list
 * @return Unique items list
 */
export const filterUniqueOptions = (options: readonly Option[]): readonly Option[] => {
  const list: Option[] = [];
  const lookup: string[] = [];

  for (const option of options) {
    if (!lookup.includes(option.value)) {
      list.push(option);
      lookup.push(option.value);
    }
  }

  return list;
};

/**
 * Convert the pla string array into react-select to options
 * @param values - array of strings
 * @return The options array
 * @see TagNumberInput
 * @see createOption
 */
export const valuesToOptions = (values: readonly (string | number)[]): readonly Option[] => {
  return values.map(value => createOption('' + value, '' + value));
};
