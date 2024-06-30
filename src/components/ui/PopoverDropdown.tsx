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
import PopoverButton from '~/components/ui/PopoverButton';

// icons
import {CheckIcon} from 'lucide-react';

export interface Option {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
}

export interface DropdownProps {
  options: Option[];

  onSelect?(option: Option): void;

  value?: string;

  onHide(): void;

  formatLabel?(option: Option, action: { selected: boolean }): React.ReactNode;
}

export interface PopoverDropdownProps {
  value?: string;
  options: Option[];

  onSelect?(option: Option): void;

  formatLabel?(option: Option, action: { selected: boolean }): React.ReactNode;

  hideArrow?: boolean;
  disabled?: boolean;
  heading?: React.ReactNode;
  placeholder?: string;
  isCovered?: boolean;
}

export const Dropdown = (props: DropdownProps) => {
  const hasActiveItem = props?.options?.findIndex(opt => opt.value === props?.value);

  return (
    <ListGroup className="p-0 m-0 ui-popover-dropdown">
      {props?.options.map(option => {
        const isSelected = props?.value === option.value;

        return (
          <ListGroup.Item
            active={isSelected}
            key={option.value}
            action href="#"
            className={cn('pt-1 pb-1', {'icon-padding': hasActiveItem !== -1})}
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

  return (
    <>
      <PopoverButton
        disabled={props?.disabled}
        isCovered={props?.isCovered}
        hideArrow={props?.hideArrow}
        popoverHeader={props?.heading}
        popoverBody={({hide}) => (
          <Dropdown
            onSelect={props?.onSelect}
            formatLabel={props?.formatLabel}
            value={props?.value}
            onHide={() => hide()}
            options={props?.options}/>
        )}
        popoverBodyProps={{className: 'p-0 m-0'}}
      >
        <span
          className="position-relative"
          style={{minHeight: 18}}>
          {selected === null
            ? (props?.placeholder ?? 'None')
            : selected?.label}
        </span>
      </PopoverButton>
    </>
  );
};

export default PopoverDropdown;
