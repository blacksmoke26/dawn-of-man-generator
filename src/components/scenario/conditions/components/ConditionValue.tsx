/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-03
 * @version 2.5.0
 */

import React from 'react';
import randomInt from 'random-int';
import {Col} from 'react-bootstrap';
import {capitalCase, snakeCase} from 'change-case';
import uniqueRandomArray from 'unique-random-array';

// element components
import TextInput from '~/components/ui/TextInput';
import NumberInput from '~/components/ui/NumberInput';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';

// utils
import {getItemsByType, getMinMaxByType, transformValue, ValueType, valueTypes} from '../utils/condition-value';

export interface Props {
  type: ValueType;
  value?: string | number;
  disabled?: boolean;

  onChange?(value: string | number): void;
}

export interface SnakeTextInputProps {
  value?: string;
  disabled?: boolean;

  onChange(value: string): void;
}

export interface IntegerInputProps {
  value?: number;
  disabled?: boolean;
  min?: number;
  max?: number;

  onChange(value: number): void;

  onShuffle?(): void;
}

export interface SelectInputProps {
  value?: string;
  disabled?: boolean;
  items: string[];

  onChange?(value: string): void;
}

const SnakeTextInput = (props: SnakeTextInputProps) => {
  return (
    <TextInput
      selectOnLoad={true}
      focusOnLoad={true}
      disabled={props?.disabled}
      value={snakeCase(props?.value || '')}
      placeholder="e.g., name"
      onChange={props?.onChange}/>
  );
};

const IntegerInput = (props: IntegerInputProps) => {
  return (
    <NumberInput
      allowFocus
      maxLength={3}
      min={props?.min}
      max={props?.max}
      disabled={props?.disabled}
      value={props?.value || 0}
      onChange={props.onChange}
      shuffle
      onShuffle={() => {
        props?.onChange(randomInt(props?.min, props?.max));
      }}
    />
  );
};

const SelectInput = (props: SelectInputProps) => {
  const onChangeHandler = (value: string) => {
    'function' === typeof props.onChange && props.onChange(value);
  };

  return (
    <AttributeSelect
      options={props?.items.map(value => ({label: capitalCase(value), value}))}
      value={props?.value || null}
      selectProps={{isSearchable: false}}
      allowShuffle
      onShuffle={() => {
        onChangeHandler(uniqueRandomArray(props?.items) as unknown as string);
      }}
      disabled={props?.disabled}

      onSelect={({value}) => onChangeHandler(value)}/>
  );
};

const ConditionValue = (props: Props) => {
  const valueType = valueTypes?.[props.type];
  const value = transformValue(props.type, valueType as string, props?.value);
  const onChangeHandler = props?.onChange || (() => {
  });

  React.useEffect(() => {
    'function' === typeof props?.onChange && props?.onChange(
      transformValue(props.type, valueType as string, props?.value),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.type, props?.value]);

  switch (valueType) {
    case 'snake':
      return (
        <Col sm="4">
          <SnakeTextInput
            value={value}
            disabled={props?.disabled}
            onChange={onChangeHandler}/>
        </Col>
      );

    case 'int':
      return (
        <Col sm="4">
          <IntegerInput
          {...getMinMaxByType(props.type)}
          value={value}
          disabled={props?.disabled}
          onChange={onChangeHandler}/>
        </Col>
      );

    case 'list':
      return (
        <SelectInput
          value={value}
          items={getItemsByType(props.type)}
          disabled={props?.disabled}
          onChange={onChangeHandler}/>
      );

    default:
      return <></>;
  }
};

export default ConditionValue;
