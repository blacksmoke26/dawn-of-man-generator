/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-01
 * @version 2.5.0
 */

import React from 'react';
import cn from 'classname';
import {nanoid} from 'nanoid';
import {Col, Form, Row} from 'react-bootstrap';

// elemental components
import LinkButton from '~/components/ui/LinkButton';
import PopoverNumberInput, {PopoverNumberInputProps} from '~/components/ui/PopoverNumberInput';

// utils
import {
  COLOR_DANGER,
  COLOR_DISABLED,
  COLOR_ORANGE,
  COLOR_REDDISH,
  COLOR_WHITISH,
  IconEraser,
  IconListChecks,
  IconRaiseDown,
  IconRaiseUp,
  IconRestore,
  IconShuffle,
} from '~/components/icons/app';

interface Props {
  disabledCheckbox?: boolean;
  checked?: boolean;
  disabled?: boolean;
  value?: any;
  heading?: React.ReactNode;
  description?: React.ReactNode;

  allowNumberInput?: boolean;
  numberInputProps?: Omit<PopoverNumberInputProps, 'onChange' | 'onSave'>;

  allowShuffle?: boolean;
  allowClear?: boolean;
  allowMin?: boolean;
  allowMax?: boolean;
  allowAll?: boolean;
  allowRestore?: boolean;

  onChange?(value: unknown): void;

  onCheckboxChange?(state: boolean): void;

  onShuffle?(): void;

  onClear?(): void;

  onMin?(): void;

  onMax?(): void;

  onAll?(): void;

  onRestore?(): void;
}

export type {Props as PanelToolbarProps};

export const invokeHandler = <T extends object = Props>(props: T, func: keyof T, value: unknown | unknown[] = undefined) => {
  if (func in props && 'function' === typeof props[func]) {
    const args = value !== undefined ? [].concat(value as any) as any : [];
    (props[func] as Function)(...args);
  }
};

const PanelToolbar = (props: React.PropsWithChildren<Props>) => {
  const isDisabled = props?.disabledCheckbox || props?.disabled;

  const iconTop = !props?.allowNumberInput ? 1 : 0;

  return (
    <div>
      <Row className={cn({'d-flex text-muted-deep': isDisabled})}>
        <Col sm="6" className="checkbox-align" style={{paddingTop: 3}}>
          <Form.Label className="text-size-sm mb-0" column={false}>
            <Form.Check
              disabled={props?.disabledCheckbox}
              checked={props?.checked}
              className="text-size-xs"
              type="switch"
              id={`switch-${nanoid(5)}`}
              onChange={e => {
                invokeHandler(props, 'onCheckboxChange', e.currentTarget.checked);
              }}
              label={props?.heading || 'Panel'}
            />
          </Form.Label>

        </Col>
        <Col sm="6" className="text-right pr-2">
          {!props?.allowNumberInput && (
            <span
              style={{top: 2, color: COLOR_REDDISH, marginRight: 1}}
              className="text-size-xs position-relative cursor-default d-inline-block">
            {props?.value ?? 0}
          </span>
          )}
          {props?.allowNumberInput && (
            <PopoverNumberInput
              className={cn('text-size-xs position-relative d-inline-block', {'text-underline-dotted': !props?.disabled})}
              hideArrow
              disabled={isDisabled}
              title="Edit/Change value"
              style={{top: 0, color: COLOR_REDDISH}}
              value={props?.value ?? 0}
              onSave={changedValue => invokeHandler(props, 'onChange', changedValue)}
              {...props?.numberInputProps}
            />
          )}
          {props?.allowShuffle && (
            <LinkButton
              title="Randomize"
              className="m-0 ml-1" style={{top: iconTop}}
              disabled={isDisabled}
              onClick={() => invokeHandler(props, 'onShuffle')}>
              <IconShuffle color={isDisabled ? COLOR_DISABLED : COLOR_WHITISH}/>
            </LinkButton>
          )}
          {props?.allowMin && (
            <LinkButton
              className="ml-1" style={{top: iconTop}}
              disabled={isDisabled}
              title="Set as minimum"
              onClick={() => invokeHandler(props, 'onMin')}>
              <IconRaiseDown color={isDisabled ? COLOR_DISABLED : COLOR_WHITISH}/>
            </LinkButton>
          )}
          {props?.allowMax && (
            <LinkButton
              className="ml-1" style={{top: iconTop}}
              disabled={isDisabled}
              title="Set as maximum"
              onClick={() => invokeHandler(props, 'onMax')}>
              <IconRaiseUp color={isDisabled ? COLOR_DISABLED : COLOR_WHITISH}/>
            </LinkButton>
          )}
          {props?.allowAll && (
            <LinkButton
              className="ml-1" style={{top: iconTop}}
              title="Choose all"
              disabled={isDisabled}
              onClick={() => invokeHandler(props, 'onAll')}>
              <IconListChecks color={isDisabled ? COLOR_DISABLED : COLOR_WHITISH}/>
            </LinkButton>
          )}
          {props?.allowRestore && (
            <LinkButton
              className="ml-1" style={{top: iconTop}}
              disabled={isDisabled}
              title="Restore default"
              onClick={() => invokeHandler(props, 'onRestore')}>
              <IconRestore color={isDisabled ? COLOR_DISABLED : COLOR_ORANGE}/>
            </LinkButton>
          )}
          {props?.allowClear && (
            <LinkButton
              className="ml-1" style={{top: iconTop}}
              title="Clear"
              disabled={isDisabled}
              onClick={() => invokeHandler(props, 'onClear')}>
              <IconEraser color={isDisabled ? COLOR_DISABLED : COLOR_DANGER}/>
            </LinkButton>
          )}
        </Col>
      </Row>

      {props?.description && (
        <div className="text-size-xxs text-muted mt-0 mb-1 position-relative"
        style={{top: -2}}>
          {props?.description}
        </div>
      )}
    </div>
  );
};

export default PanelToolbar;
