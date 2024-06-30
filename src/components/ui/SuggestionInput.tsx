/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-25
 * @version 2.3.0
 */

import React, {PropsWithChildren} from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Button, InputGroup} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';

// utils
import {CaseType, toTextCase} from '~/utils/strings';
import {
  COLOR_DISABLED, COLOR_REDDISH, IconEraser, IconRestore, IconShuffle,
} from '~/components/icons/app';

// hooks
import {useDebouncedCallback} from 'use-debounce';

// types
import type {Required} from 'utility-types';
import type {TypeaheadComponentProps, TypeaheadRef} from 'react-bootstrap-typeahead';

export interface Option {
  readonly [key: string]: string;

  readonly label: string;
  readonly value: string;
}

export interface Props {
  options?: Option[];
  allowShuffle?: boolean;
  caseType?: CaseType;
  allowClear?: boolean;
  allowRestore?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  focusOnLoad?: boolean;
  selectOnLoad?: boolean;
  typeheadProps?: Partial<TypeaheadComponentProps>;
  value?: string;
  defaultValue?: string;

  onChange?(value: string): void;

  onShuffle?(): void;

  onRestore?(): void;
}

const TypeheadInput = React.forwardRef<TypeaheadRef, TypeaheadComponentProps>((props: Partial<TypeaheadComponentProps> = {}, ref) => {
  return (
    <Typeahead
      newSelectionPrefix=""
      positionFixed={true}
      defaultOpen={false}
      emptyLabel=""
      labelKey="value"
      id={`suggestion_input-${nanoid(5)}`}
      options={[]} {...props} ref={ref}/>
  );
});

const PROPS_DEFAULT: Props = {
  options: [],
  allowClear: false,
  focusOnLoad: false,
  selectOnLoad: false,
  disabled: false,
  allowRestore: false,
  caseType: 'DEFAULT',
  allowShuffle: false,
  placeholder: '',
  value: '',
  defaultValue: '',
  typeheadProps: {},
  className: '',
  onChange() {
  },
  onShuffle() {
  },
  onRestore() {
  },
}

/** SuggestionInput functional component */
const SuggestionInput = (props: PropsWithChildren<Props> = {}) => {
  const inputRef = React.createRef<TypeaheadRef>();

  const newProps = merge<Required<Props>>(PROPS_DEFAULT, props || {});

  const debounced = useDebouncedCallback(
    // function
    newProps.onChange,
    // delay in ms
    20, {maxWait: 250},
  );

  React.useEffect(() => {
    newProps?.focusOnLoad && inputRef?.current?.focus();
    newProps?.selectOnLoad && inputRef?.current?.getInput()?.select();
  }, [inputRef, newProps?.focusOnLoad, newProps?.selectOnLoad]);

  const [openMenu, setOpenMenu] = React.useState<boolean>(false);

  const names: string[] = newProps.options?.map(option => option.value);

  React.useEffect(() => {
    if (props?.value) {
      setTimeout(() => {
        inputRef.current?.forceUpdate();
      }, 120);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.value]);

  const triggerOpenMenu = (value: string): void => {
    if (!value.trim()) {
      setOpenMenu(false);
      return;
    }

    const valueIncluded = Boolean(names.filter(v => v.toLowerCase().includes(value.toLowerCase())).length);
    setOpenMenu(valueIncluded);
  };

  return (
    <InputGroup>
      <TypeheadInput
        ref={inputRef}
        selected={[{label: newProps.value, value: newProps.value}]}
        open={openMenu}
        placeholder={newProps.placeholder}
        onInputChange={value => {
          triggerOpenMenu(value);
          debounced(toTextCase(value, newProps.caseType, 'CHANGE'));
        }}
        onKeyDown={(e) => {
          triggerOpenMenu(e.currentTarget.value);
          // @ts-ignore
          e.currentTarget.value = toTextCase(e.currentTarget.value, newProps.caseType, 'KEYUP');
        }}
        className={newProps.className}
        disabled={newProps.disabled}
        options={newProps.options}
        minLength={0}
        onChange={selected => {
          const option = selected?.[0] as Option;
          if (option?.value) {
            debounced(option.value);
            setOpenMenu(false);
          }
        }}
        {...newProps.typeheadProps}
      />
      {newProps.allowShuffle && (
        <Button
          disabled={newProps.disabled}
          title="Randomize value"
          className={cn('button-reset-sm ml-2', {'text-white': !newProps.disabled})}
          variant="link"
          onClick={() => {
            newProps.onShuffle();
            inputRef?.current?.focus();
          }}>
          <IconShuffle width="16" height="16"/>
        </Button>
      )}
      {newProps.allowRestore && (
        <Button
          disabled={newProps.disabled}
          title="Restore default"
          className={cn('button-reset-sm ml-2', {'text-white': !newProps.disabled})}
          variant="link"
          onClick={() => newProps.onRestore()}>
          <IconRestore width="19" height="19"/>
        </Button>
      )}
      {newProps.allowClear && (
        <Button
          disabled={newProps.disabled}
          title="Clear value"
          className="button-reset-sm ml-2"
          style={{color: newProps.disabled ? COLOR_DISABLED : COLOR_REDDISH}}
          variant="link"
          onClick={() => {
            inputRef.current?.clear();
            inputRef?.current?.focus();
            newProps.onChange('');
          }}>
          <IconEraser width="19" height="19"/>
        </Button>
      )}
      {props?.children}
    </InputGroup>
  );
};

export default SuggestionInput;
