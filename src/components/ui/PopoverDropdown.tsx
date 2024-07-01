/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-25
 * @version 2.3.0
 */

import React from 'react';
import cn from 'classname';
import {ListGroup} from 'react-bootstrap';

// elemental components
import PopoverButton, {CommonProps} from '~/components/ui/PopoverButton';

// icons
import {CheckIcon} from 'lucide-react';

export interface Option {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;

  readonly [p: string]: any;
}

export interface DropdownCommonProps {
  options: Option[];

  onSelect?(option: Option): void;

  value?: string;

  onHide?(): void;

  formatLabel?(option: Option, action: { selected: boolean }): React.ReactNode;
}

export interface DropdownProps extends DropdownCommonProps {
  hasHeading?: boolean;
  onHide(): void;
}

export interface PopoverDropdownProps extends DropdownCommonProps, CommonProps {
  heading?: React.ReactNode;
  placeholder?: string;

  /** Use a different component than `span` for display value container */
  as?: string;

  /** Display value element classname */
  className?: string;

  formatText?(label: string): React.ReactNode;
}

export const Dropdown = (props: DropdownProps) => {
  const hasActiveItem = props?.options?.findIndex(opt => opt.value === props?.value);

  return (
    <ListGroup className={cn(
      'p-0 m-0 ui-popover-dropdown border-0',
      {'has-heading': props?.hasHeading},
    )}>
      {props?.options.map(option => {
        const isSelected = props?.value === option.value;

        return (
          <ListGroup.Item
            active={isSelected}
            key={option.value}
            action href="#"
            disabled={option?.disabled}
            className={cn(
              'pt-1 pb-1',
              {'icon-padding': hasActiveItem !== -1},
              {'text-muted-deep': option?.disabled},
            )}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              'function' === typeof props?.onSelect && props.onSelect(option);
              props.onHide();
            }}>
            {isSelected && (
              <CheckIcon width="15" height="15" className="icon"/>
            )}
            {'function' === typeof props?.formatLabel
              ? props?.formatLabel(option, {selected: isSelected})
              : option.label}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

/** PopoverButton functional component */
const PopoverDropdown = (props: PopoverDropdownProps) => {
  const selected = props?.options?.find(opt => opt.value === props?.value) || null;

  const As = (props?.as ?? 'span') as unknown as React.FC<any>;

  const formatTextHandler = 'function' === typeof props?.formatText
    ? props?.formatText
    : ((value: string): React.ReactNode => value)

  return (
    <>
      <PopoverButton
        disabled={props?.disabled ?? false}
        isCovered={props?.isCovered ?? false}
        hideArrow={props?.hideArrow ?? false}
        popoverHeader={props?.heading}
        popoverHeaderProps={{
          as: 'h6',
          className: 'text-size-xxs pt-2 pl-2 pr-2',
        }}
        popoverBody={({hide}) => (
          <Dropdown
            hasHeading={!!props?.heading}
            onSelect={props?.onSelect}
            formatLabel={props?.formatLabel}
            value={props?.value}
            onHide={() => hide()}
            options={props?.options}/>
        )}
        popoverBodyProps={{className: 'p-0 m-0'}}>
        <As
          className={cn('position-relative', props?.className)}
          style={{minHeight: 18}}>
          {selected === null
            ? formatTextHandler(props?.placeholder ?? 'None')
            : formatTextHandler(selected?.label)}
        </As>
      </PopoverButton>
    </>
  );
};

export default PopoverDropdown;
