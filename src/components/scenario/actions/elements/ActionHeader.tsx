// noinspection HtmlUnknownAnchorTarget

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {Button, Col, Row} from 'react-bootstrap';

// icons
import {
  COLOR_DISABLED,
  COLOR_GRAYED,
  COLOR_REDDISH,
  IconAction,
  IconClear,
  IconChevronSimpleUp,
  IconChevronSimpleDown,
} from '~/components/icons/app';

// types
import type {Required} from 'utility-types';

export interface Props {
  /** Goal title */
  caption: string;
  /** Whatever the elements/ui disabled or not */
  disabled?: boolean;
  /** Whatever the checkbox (toggle enable) is disabled or not */
  disabledCheckbox?: boolean;
  /** The expended icon state (up/down) */
  expanded?: boolean;
  /** Show remove icon button */
  removeIcon?: boolean;

  /**
   * An event fired when clicking on the remove icon button
   */
  onRemoveClick?(): void,

  /**
   * An event fired when clicked on the expand/collapse icon button
   */
  onExpandedClick?(state: boolean): void;
}

export const ActionHeader = (props: Props) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    disabledCheckbox: false,
    removeIcon: false,
    expanded: true,
    onRemoveClick: () => {
    },
    onExpandedClick: () => {
    },
  }, props);

  const isDisabled = newProps.disabledCheckbox || newProps.disabled;

  return (
    <Row className={cn('mb-1', {'text-muted': isDisabled}, 'checkbox-align')}>
      <Col xs="6">
        <a href="#toggle"
           className={cn({
             'text-muted cursor-default': isDisabled,
             'cursor-pointer text-white': !isDisabled,
           })}
           onClick={e => {
             e.preventDefault();
             !isDisabled && newProps.onExpandedClick(!newProps.expanded);
           }}>
          <IconAction width="17" height="17" color={isDisabled ? COLOR_DISABLED : COLOR_REDDISH}/>
          {' '} <strong>Action</strong>: {newProps.caption}
        </a>
      </Col>
      <Col xs="6" className="text-right">
        <div className="position-relative" style={{top: 3}}>
          <div className="d-inline-block">
            <Button
              variant="link" className="p-0" style={{top: '-0.2rem'}}
              disabled={newProps.disabledCheckbox}
              onClick={() => newProps?.onExpandedClick(!newProps.expanded)}>
              {!newProps.expanded
                ? <IconChevronSimpleUp width="16" height="16"/>
                : <IconChevronSimpleDown width="16" height="16"/>}
            </Button>
          </div>
          {newProps?.removeIcon && (
            <div className="d-inline-block">
              <Button
                variant="link" className="p-0 ml-1"
                disabled={newProps.disabledCheckbox}
                onClick={() => newProps?.onRemoveClick()}
                style={{
                  top: '-0.2rem',
                  color: isDisabled ? COLOR_GRAYED : COLOR_REDDISH,
                }}>
                <IconClear width="16" height="16"/>
              </Button>
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
};

ActionHeader.propTypes = {
  caption: PropTypes.string.isRequired,
  disabledCheckbox: PropTypes.bool,
  enabled: PropTypes.bool,
  onEnabled: PropTypes.func,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onExpandedClick: PropTypes.func,
};

export default ActionHeader;
