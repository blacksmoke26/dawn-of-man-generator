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
import TextInput, {Props as TextInputProps} from '~/components/ui/TextInput';

// icons
import {CircleCheckBig} from 'lucide-react';
import {COLOR_SUCCESS} from '~/components/icons/app';

type ExcludeNumberProps = 'value' | 'caseType'
  | 'disabled'
  | 'onChange' | 'inputProps';

export interface Props extends CommonProps {
  /** Input value */
  value?: string;

  /** Case type
   * @default 'DEFAULT' */
  caseType?: TextInputProps['caseType'];

  /** Input properties pass to NumberInput component
   * @default 3 */
  inputProps?: Omit<TextInputProps, ExcludeNumberProps>;

  /** Input placeholder text */
  placeholder?: string;

  /** The heading text */
  heading?: React.ReactNode;

  /** Use a different component than `span` for display value container */
  as?: string;

  /** Display value element title */
  title?: string;

  /** Display value element classname */
  className?: string;

  /** Display value element styles */
  style?: React.CSSProperties;

  /** A callback fire when input has been changed */
  onChange?(value: string): void;

  /** A callback fire when check button is clicked */
  onSave?(value: string): void;

  /** Formats a display value
   *
   * @example
   * formatValue (value: string) { return `${value}$`; }
   * */
  formatValue?(value: string): React.ReactNode;
}

export type {Props as PopoverTextInputProps};

/** PopoverButton functional component */
const PopoverTextInput = (props: Props) => {
  const [value, setValue] = React.useState<string | undefined>(props?.value);
  const [parentValue, setParentValue] = React.useState<string | undefined>(props?.value);

  React.useEffect(() => {
    if (props?.value !== undefined) {
      setParentValue(props?.value);
      setValue(props?.value);
    }
  }, [props?.value]);

  const formattedValue = parentValue === undefined
    ? props?.placeholder
    : ('function' === typeof props?.formatValue
        ? props?.formatValue(parentValue as string)
        : parentValue
    );

  const As = (props?.as ?? 'span') as unknown as React.FC<any>;

  const onSaveHandler = (hide: Function) => {
    props?.onSave?.(value as string);
    hide();
  };

  return (
    <PopoverButton
      disabled={props?.disabled}
      isCovered={props?.isCovered}
      hideArrow={props?.hideArrow}
      placement={props?.placement}
      popoverHeader={props?.heading}
      popoverHeaderProps={{
        as: 'h6',
        className: 'text-size-xxs pt-2 pl-2 pr-2',
      }}
      popoverBody={({hide}) => (
        <div
          className="pt-1 pb-2 pl-2 pr-2 w-auto d-flex align-items-start"
          style={{minWidth: 250, maxWidth: 250, overflow: 'hidden'}}>
          <div className="d-inline-block pt-1" style={{width: '87.6%'}}>
            <TextInput
              {...props?.inputProps}
              inputProps={{
                className: 'radius-right-0',
                onKeyPress: e => e.key === 'Enter' && onSaveHandler(hide),
              }}
              focusOnLoad
              selectOnLoad
              caseType={props?.caseType}
              value={value || ''}
              onChange={(changedValue: string) => {
                setValue(changedValue);
                props?.onChange?.(changedValue);
              }}/>
          </div>
          <LinkButton
            size="sm" variant="secondary"
            className="radius-left-0 position-relative mt-2"
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
        title={props?.title}
        className={cn('position-relative', obPath.get(props, 'className', ''))}
        style={{minHeight: 18, ...(props?.style || {})}}>
        {formattedValue === undefined ? (props?.placeholder || 0) : formattedValue}
      </As>
    </PopoverButton>
  );
};

// Properties validation
PopoverTextInput.propTypes = {
  value: PropTypes.string,
  disabled: PropTypes.bool,
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

export default PopoverTextInput;
