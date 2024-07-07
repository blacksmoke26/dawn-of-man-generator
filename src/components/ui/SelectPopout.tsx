/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-07
 * @version 2.5.0
 */

import React from 'react';
import cn from 'classname';
import Select from 'react-select';

// elemental components
import LinkButton from './LinkButton';

// icons
import {ChevronDown} from 'lucide-react';
import {COLOR_DISABLED, COLOR_GRAYED} from '~/components/icons/app';

// utils
import {COMMON_THEME_COLORS} from './libs/select';

// types
import type {JSX} from 'react/jsx-runtime';
import type {Json} from '~/types/json.types';
import type {Option, Options} from './Select';
import type {ActionMeta, FormatOptionLabelMeta, Props as SelectProps} from 'react-select';
import {Property} from 'csstype';

// public types
export type {Option, Options};

export interface SelectPopoutProps {
  /** Dropdown list options */
  options: Options;

  /** Placeholder value if value is not selected */
  placeholder?: React.ReactNode;

  /** Whatever the component is disabled or not */
  disabled?: boolean;

  /** Hide the arrow icon right after display value */
  hideArrow?: boolean;

  /** Display value element classname */
  className?: string;

  dropdownWidth?: Property.Width<number>;

  /** Display value element classname */
  style?: React.CSSProperties;

  /** Only selectable, won't update the value */
  readOnly?: boolean;

  /** React select options */
  selectProps?: SelectProps;

  /** Formats the display text */
  formatText?(option: Option): React.ReactNode;

  /** A callback triggers when option is selected */
  onSelect?(option: Option, action: ActionMeta<Option>): void;

  /** Formats the dropdown option label */
  formatOptionLabel?(data: unknown, formatOptionLabelMeta: FormatOptionLabelMeta<unknown>): React.ReactNode;
}

/** SelectPopout functional component */
export const SelectPopout = (props: SelectPopoutProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<Option | null>();

  const formatTextHandler = 'function' === typeof props?.formatText
    ? props?.formatText
    : (option: Option) => <>{option.label}</>;

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      target={
        <LinkButton
          disabled={props?.disabled}
          style={props?.style ?? {}}
          className={cn(
            'm-0 p-0',
            {'text-muted-deep': props?.disabled},
            props?.className ?? '',
          )}
          onClick={() => setIsOpen((prev) => !prev)}>
          {value ? formatTextHandler(value) : (props?.placeholder ?? 'None')}
          {!props?.hideArrow && (
            <ChevronDown
              color={props?.disabled ? COLOR_DISABLED : COLOR_GRAYED}
              className="position-absolute d-inline"
              style={{marginLeft: 2, top: -1}} width="14"/>
          )}
        </LinkButton>
      }>
      <Select
        autoFocus
        backspaceRemovesValue={false}
        components={{
          IndicatorSeparator: null,
          Control: () => null,
        }}
        formatOptionLabel={props?.formatOptionLabel}
        controlShouldRenderValue={false}
        hideSelectedOptions={true}
        isClearable={false}
        noOptionsMessage={() => <></>}
        menuIsOpen
        isSearchable={false}
        theme={theme}
        styles={styles({width: props?.dropdownWidth})}
        options={props?.options as Options}
        tabSelectsValue={false}
        value={value}
        {...props?.selectProps}
        onChange={(newValue, action) => {
          !props?.readOnly && setValue(newValue as Option);
          setIsOpen(false);
          'function' === typeof props?.onSelect
          && props?.onSelect(newValue as Option, action as ActionMeta<Option>);
        }}
      />
    </Dropdown>
  );
};

const Menu = (props: JSX.IntrinsicElements['div']) => (
  <div style={{marginTop: -7, position: 'absolute', zIndex: 2}} {...props}/>
);

const Blanket = (props: JSX.IntrinsicElements['div']) => (
  <div style={{position: 'fixed', bottom: 0, left: 0, top: 0, right: 0, zIndex: 1}} {...props}/>
);
const Dropdown = ({children, isOpen, target, onClose}: {
  children?: React.ReactNode;
  readonly isOpen: boolean;
  readonly target: React.ReactNode;
  readonly onClose: () => void;
}) => (
  <div style={{position: 'relative'}}>
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose}/> : null}
  </div>
);

export const theme = (theme: any) => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    ...COMMON_THEME_COLORS,
    primary: 'rgba(53, 63, 83, 0.60)',
    primary25: 'rgba(53, 63, 83, 0.60)',
    primary50: '#353f535c',
  },
});

export const styles = ({width = 150}: {width?: Property.Width<number>}) => {
  return {
    container: (current: Json) => ({
      ...current,
      minWidth: 150,
      width,
      maxWidth: 300,
    }),
    menu: (current: Json) => ({
      ...current,
      paddingTop: 6,
      paddingBottom: 6,
      borderRadius: 2,
      backgroundColor: '#44506b',
    }),
    groupHeading: (current: Json) => ({
      ...current,
      fontSize: '.66rem',
      color: '#e4e4e4',
      textTransform: 'none',
    }),
    control: (current: Json) => ({
      ...current,
      backgroundColor: '#44506b',
    }),
    option: (styles: any, {isDisabled, isSelected}: { isDisabled: boolean, isSelected: boolean }) => ({
      ...styles,
      paddingTop: 5,
      paddingBottom: 5,
      fontSize: '.75rem',
      color: isDisabled
        ? '#788bb1'
        : (isSelected ? '#353f535c' : '#e4e4e4'),
      singleValue: (styles: any) => ({...styles, color: '#ffb74d'}),
    }),
  } as SelectProps['styles']
};

export default SelectPopout;
