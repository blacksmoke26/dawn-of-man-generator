/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-30
 * @version 2.5
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classname';
import obPath from 'object-path';

// elemental components
import LinkButton from '~/components/ui/LinkButton';
import PopoverButton, {CommonProps} from '~/components/ui/PopoverButton';
import NumberInput, {Props as NumberInputProps} from '~/components/ui/NumberInput';

// icons
import {CircleCheckBig} from 'lucide-react';
import {COLOR_SUCCESS} from '~/components/icons/app';

type ExcludeNumberProps = 'min' | 'max' | 'decimals'
  | 'disabled' | 'value' | 'placeholder'
  | 'onChange' | 'inputProps';

export interface Props extends CommonProps {
  /** Input value */
  value?: number;

  /** Number of decimals
   * @default 0 */
  decimals?: number;

  /** Minimum number limit
   * @default 0 */
  min?: number;

  /** Maximum number limit
   * @default 100 */
  max?: number;

  /** Input properties pass to NumberInput component
   * @default 3 */
  inputProps?: Omit<NumberInputProps, ExcludeNumberProps>;

  /** Input placeholder text */
  placeholder?: string;

  /** The heading text */
  heading?: React.ReactNode;

  /** Use a different component than `span` for display value container */
  as?: string;

  /** Display value element classname */
  className?: string;

  /** A callback fire when input has been changed */
  onChange?(value: number): void;

  /** A callback fire when check button is clicked */
  onSave?(value: number): void;

  /** Formats a display value
   *
   * @example
   * formatValue (value: number) { return `${value}$`; }
   * */
  formatValue?(value: number): React.ReactNode;
}

export type {Props as PopoverNumberInputProps};

/** PopoverButton functional component */
const PopoverNumberInput = (props: Props) => {
  const [value, setValue] = React.useState<number | undefined>(props?.value);
  const [parentValue, setParentValue] = React.useState<number | undefined>(props?.value);

  React.useEffect(() => {
    if (props?.value !== undefined) {
      setParentValue(props?.value);
      setValue(props?.value);
    }
  }, [props?.value]);

  const formattedValue = parentValue === undefined
    ? props?.placeholder
    : ('function' === typeof props?.formatValue
        ? props?.formatValue(parentValue as number)
        : parentValue
    );

  const As = (props?.as ?? 'span') as unknown as React.FC<any>;

  const onSaveHandler = (hide: Function) => {
    'function' === typeof props?.onSave && props.onSave(value as number);
    hide();
  };

  return (
    <PopoverButton
      disabled={props?.disabled}
      isCovered={props?.isCovered}
      hideArrow={props?.hideArrow}
      popoverHeader={props?.heading}
      popoverHeaderProps={{
        as: 'h6',
        className: 'text-size-xxs pt-2 pl-2 pr-2',
      }}
      popoverBody={({hide}) => (
        <div
          className="pt-1 pb-2 pl-2 pr-2 w-auto d-flex align-items-start"
          style={{minWidth: 250, maxWidth: 250, overflow: 'hidden'}}>
          <div className="d-inline-block" style={{width: '87.6%'}}>
            <NumberInput
              {...props?.inputProps}
              inputProps={{
                className: 'radius-right-0',
                onKeyPress: e => e.key === 'Enter' && onSaveHandler(hide),
              }}
              allowFocus
              decimals={props?.decimals}
              min={props?.min}
              max={props?.max}
              value={value || 0}
              onChange={changedValue => {
                setValue(+changedValue);
                'function' === typeof props?.onChange && props.onChange(+changedValue);
              }}/>
          </div>
          <LinkButton
            size="sm" variant="secondary"
            className="radius-left-0 position-relative mt-1"
            style={{marginLeft: '.5rem'}}
            onClick={() => onSaveHandler(hide)}>
            <CircleCheckBig
              width="19" className="position-relative"
              style={{top: -2}} color={COLOR_SUCCESS}/>
          </LinkButton>
        </div>
      )}
      popoverBodyProps={{className: 'p-0 m-0'}}>
      <As
        className={cn('position-relative', obPath.get(props, 'className', ''))}
        style={{minHeight: 18}}>
        {formattedValue === undefined ? (props?.placeholder || 0) : formattedValue}
      </As>
    </PopoverButton>
  );
};

// Properties validation
PopoverNumberInput.propTypes = {
  value: PropTypes.number,
  disabled: PropTypes.bool,
  decimals: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  inputProps: PropTypes.object,
  placeholder: PropTypes.number,
  hideArrow: PropTypes.bool,
  heading: PropTypes.node,
  isCovered: PropTypes.bool,
  as: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  formatValue: PropTypes.func,
};

export default PopoverNumberInput;
