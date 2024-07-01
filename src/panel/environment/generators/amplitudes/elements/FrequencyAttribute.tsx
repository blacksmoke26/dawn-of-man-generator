/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-29
 * @version 2.4
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classname';
import {nanoid} from 'nanoid';
import {Col, Form, FormCheckProps, Row} from 'react-bootstrap';

// elemental components
import Slider from '~/components/ui/Slider';
import LinkButton from '~/components/ui/LinkButton';
import PopoverNumberInput from '~/components/ui/PopoverNumberInput';

// utils
import {randomFrequency} from '~/utils/random';
import {
  COLOR_DISABLED,
  COLOR_REDDISH,
  COLOR_WHITISH,
  IconRaiseDown,
  IconRaiseUp,
  IconShuffle,
} from '~/components/icons/app';

export interface Props {
  disabled?: boolean;
  disabledCheckbox?: boolean;
  checked?: boolean;
  checkboxProps?: FormCheckProps;
  value?: number;
  label?: string;

  onCheckboxChange?(state: boolean): void;

  onChange?(value: number): void;
}

/** FrequencyAttribute functional component */
const FrequencyAttribute = (props: Props = {}) => {
  const onChange = 'function' === typeof props?.onChange
    ? props.onChange
    : () => {
    };

  const isDisabled = props?.disabledCheckbox || props?.disabled;

  const numberInputProps = {
    min: 0,
    max: 1,
    decimals: 4,
    hideArrow: true,
    disabled: isDisabled,
    title: 'Edit/Change value',
    className: cn('mr-1', {'text-underline-dotted': !isDisabled}),
    style: {color: COLOR_REDDISH, top: 0},
  };

  return (
    <div className={(cn('mb-2', 'checkbox-align', {
      'text-muted-deep': isDisabled,
    }))}>
      <Row>
        <Col sm="6">
          <Form.Label className="text-size-sm mb-0" column={false}>
            <Form.Check
              disabled={props?.disabledCheckbox}
              readOnly={true}
              checked={props?.checked}
              className="text-size-xs"
              type="switch"
              id={`switch-${nanoid(5)}`}
              onChange={e => {
                'function' === typeof props?.onCheckboxChange
                && props?.onCheckboxChange(e.currentTarget.checked)
              }}
              label={props?.label || 'Frequency'}
              {...(props?.checkboxProps || {})}
            />
          </Form.Label>
        </Col>
        <Col sm="6" className="text-right">
          <PopoverNumberInput
            {...numberInputProps}
            value={props?.value as number}
            onSave={value => onChange(value as number)}/>
          <LinkButton
            disabled={isDisabled}
            className="m-0"
            title="Randmize"
            onClick={() => onChange(randomFrequency())}>
            <IconShuffle color={isDisabled ? COLOR_DISABLED : COLOR_WHITISH}/>
          </LinkButton>
          <LinkButton
            title="Set as Minimum"
            disabled={isDisabled}
            onClick={() => onChange(0)}>
            <IconRaiseDown color={isDisabled ? COLOR_DISABLED : COLOR_WHITISH}/>
          </LinkButton>
          <LinkButton
            title="Set as Maximum"
            disabled={isDisabled}
            onClick={() => onChange(1)}>
            <IconRaiseUp color={isDisabled ? COLOR_DISABLED : COLOR_WHITISH}/>
          </LinkButton>
        </Col>
      </Row>


      <Slider
        disabled={isDisabled}
        step={0.001}
        value={props?.value ?? 0}
        onChange={v => onChange(v as number)}/>
    </div>
  );
};

// Properties validation
FrequencyAttribute.propTypes = {
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  checkboxProps: PropTypes.object,
  value: PropTypes.number,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

export default FrequencyAttribute;

