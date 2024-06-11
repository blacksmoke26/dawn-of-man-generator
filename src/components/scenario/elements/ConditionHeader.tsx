/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Button, Col, Form, Row} from 'react-bootstrap';

// icons
import {
  COLOR_DISABLED,
  COLOR_REDDISH,
  IconChevronDown,
  IconChevronUp,
  IconCondition,
  IconSquareMinus
} from '~/components/icons/app';

// types
import type {$Keys, Required} from 'utility-types';

export interface Props {
  /** Condition title */
  caption: string;
  /** Whatever the elements/ui disabled or not */
  enabled?: boolean;
  /** Whatever the checkbox (toggle enable) is disabled or not */
  disabledCheckbox?: boolean;
  /** The expended icon state (up/down) */
  expanded?: boolean;
  /** Show remove icon button */
  removeIcon?: boolean;

  /**
   * An event fired when the enabled checkbox is checked or unchecked
   * @param isEnabled The enabled checkbox state
   */
  onEnabled?(isEnabled: boolean): void,

  /**
   * An event fired when clicking on the remove icon button
   */
  onRemoveClick?(): void,

  /**
   * An event fired when clicked on the expand/collapse icon button
   * @param isExpanded The expanded state
   */
  onExpandedClick?(isExpanded: boolean): void;
}

export type Attributes = Required<Omit<Props, 'onRemoveClick' | 'onEnabled' | 'onExpandedClick' | 'caption'>>;

export const ConditionHeader = (props: Props) => {
  const newProps = merge<Props>({
    enabled: true,
    disabledCheckbox: false,
    removeIcon: false,
    expanded: true,
    onEnabled: () => {
    },
    onRemoveClick: () => {
    },
    onExpandedClick: () => {
    },
  }, props);

  const [attributes, setAttributes] = React.useState<Required<Attributes>>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean,
    removeIcon: newProps.expanded as boolean,
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  // Reflect prop changes
  React.useEffect(() => {
    setAttribute('enabled', props.enabled);
    setAttribute('disabledCheckbox', props.disabledCheckbox);
    setAttribute('removeIcon', props.removeIcon);
    setAttribute('expanded', props.expanded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const isDisabled = props.disabledCheckbox || !attributes.enabled;

  return (
    <Row className={cn('mb-1', {'text-muted': isDisabled}, 'checkbox-align')}>
      <Col xs="6">
        <IconCondition width="17" height="17" color={isDisabled ? COLOR_DISABLED : COLOR_REDDISH}/>
        {' '} <strong>Condition</strong>: {props.caption}
      </Col>
      <Col xs="6" className="text-right">
        <div className="d-inline-block">
          <Button variant="link" className="p-0" style={{top: '-0.2rem'}}
                  disabled={attributes.disabledCheckbox}
                  onClick={() => {
                    const currentState = !attributes.expanded;
                    setAttribute('expanded', currentState);
                    'function' === typeof props?.onExpandedClick && props?.onExpandedClick(currentState);
                  }}>
            {!attributes.expanded
              ? <IconChevronUp width="16" height="16"/>
              : <IconChevronDown width="16" height="16"/>}
          </Button>
        </div>
        <div className="d-inline-block">
          <Form.Check
            type="switch"
            disabled={attributes.disabledCheckbox}
            id={`condition-switch-${nanoid(5)}`}
            label=""
            className="ml-1 pl-3"
            checked={attributes.enabled}
            onChange={e => {
              'function' === typeof props?.onEnabled && props?.onEnabled(e.target.checked);
              setAttribute('enabled', e.target.checked);
            }}
          />
        </div>
        {newProps?.removeIcon && (
          <div className="d-inline-block">
            <Button variant="link" className="p-0 ml-1"
                    disabled={attributes.disabledCheckbox}
                    onClick={() => {
                      'function' === typeof props?.onRemoveClick && props?.onRemoveClick();
                    }}
                    style={{
                      top: '-0.2rem',
                      color: isDisabled ? 'rgba(255, 255, 255, .4)' : COLOR_REDDISH
                    }}>
              <IconSquareMinus width="16" height="16"/>
            </Button>
          </div>
        )}
      </Col>
    </Row>
  );
};

ConditionHeader.propTypes = {
  caption: PropTypes.string.isRequired,
  disabledCheckbox: PropTypes.bool,
  enabled: PropTypes.bool,
  onEnabled: PropTypes.func,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onExpandedClick: PropTypes.func,
};

export default ConditionHeader;
