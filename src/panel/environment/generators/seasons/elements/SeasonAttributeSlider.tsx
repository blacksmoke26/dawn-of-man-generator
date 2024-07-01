/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-01
 * @version 2.5.0
 */

import React from 'react';
import cn from 'classname';
import {Col, Form, Row} from 'react-bootstrap';

// elemental components
import LinkButton from '~/components/ui/LinkButton';
import PopoverNumberInput, {PopoverNumberInputProps} from '~/components/ui/PopoverNumberInput';

// icons
import {
  COLOR_DISABLED,
  COLOR_ORANGE,
  COLOR_REDDISH,
  COLOR_WHITISH,
  IconRaiseDown,
  IconRaiseUp,
  IconRestore,
  IconShuffle,
} from '~/components/icons/app';

// utils
import {invokeHandler} from '~/components/environment/PanelToolbar';

export interface SeasonAttributeSliderProps {
  disabled?: boolean;
  value?: number;
  caption?: React.ReactNode;

  title?: React.ReactNode;

  allowNumberInput?: boolean;
  numberInputProps?: Omit<PopoverNumberInputProps, 'onChange' | 'onSave'>;

  allowShuffle?: boolean;
  allowMin?: boolean;
  allowMax?: boolean;
  allowRestore?: boolean;

  displayValue?(value: unknown): React.ReactNode;

  onShuffle?(): void;

  onRestore?(): void;

  onChange?(value: number): void;
}

/** SeasonAttributeSlider functional component */
const SeasonAttributeSlider = (props: React.PropsWithChildren<SeasonAttributeSliderProps>) => {
  const isDisabled = props?.disabled;

  return (
    <Form.Group as={Row} className={cn('mb-1', {'text-muted-deep': isDisabled})}>
      <Form.Label column={true} sm="2">
        <span
          style={{top: 2}}
          className="d-inline-block position-relative">
          {props?.caption || 'Title'}
        </span>
      </Form.Label>
      <Col sm="10">
        <div>
          {props?.title && (
            <div
              className={cn('float-left text-size-xxs position-relative font-italic font-weight-light')}
              style={{top: 10, color: isDisabled ? 'rgba(255, 255, 255, .1)' : 'rgba(255, 255, 255, .7)'}}>
              {props?.title}
            </div>
          )}
          <div className="float-right text-right">
            <span className="position-relative" style={{color: COLOR_REDDISH, top: 1}}>
            {'function' === typeof props?.displayValue ? props?.displayValue(props?.value) : (
              props?.allowNumberInput ? (
                <PopoverNumberInput
                  className={cn('text-size-xs position-relative d-inline-block', {'text-underline-dotted': !props?.disabled})}
                  hideArrow
                  disabled={isDisabled}
                  title="Edit/Change value"
                  style={{top: -2, color: COLOR_REDDISH}}
                  value={props?.value ?? 0}
                  min={0}
                  max={1}
                  decimals={2}
                  onSave={changedValue => invokeHandler(props, 'onChange', changedValue)}
                  {...props?.numberInputProps}
                />
              ) : (
                <span
                  className="position-relative d-inline-block"
                  style={{marginBottom: 3, marginRight: 1}}>
                  {props?.value}
                </span>
              )
            )}
          </span>

            {props?.allowShuffle && (
              <LinkButton
                title="Randomize"
                className="m-0 ml-1"
                disabled={isDisabled}
                onClick={() => invokeHandler(props, 'onShuffle')}>
                <IconShuffle color={isDisabled ? COLOR_DISABLED : COLOR_WHITISH}/>
              </LinkButton>
            )}

            {props?.allowMin && (
              <LinkButton
                className="ml-1"
                disabled={isDisabled}
                title="Set as minimum"
                onClick={() => invokeHandler(props, 'onChange', 0)}>
                <IconRaiseDown color={isDisabled ? COLOR_DISABLED : COLOR_WHITISH}/>
              </LinkButton>
            )}
            {props?.allowMax && (
              <LinkButton
                className="ml-1"
                disabled={isDisabled}
                title="Set as maximum"
                onClick={() => invokeHandler(props, 'onChange', 1)}>
                <IconRaiseUp color={isDisabled ? COLOR_DISABLED : COLOR_WHITISH}/>
              </LinkButton>
            )}

            {props?.allowRestore && (
              <LinkButton
                className="ml-1"
                disabled={isDisabled}
                title="Restore default"
                onClick={() => invokeHandler(props, 'onRestore')}>
                <IconRestore color={isDisabled ? COLOR_DISABLED : COLOR_ORANGE}/>
              </LinkButton>
            )}
          </div>
          <div className="clearfix"></div>
        </div>
        {props?.children}
      </Col>
    </Form.Group>
  );
};

export default SeasonAttributeSlider;
