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
import {Col, Form, Row} from 'react-bootstrap';

// redux
import {useAppSelector} from '~redux/hooks';

// parsers
import {toCustomSettlementNameAllowedTemplate} from '~/utils/parser/templates-general';

/** CustomSettlementNameAllowed `props` type */
interface Props {
  enabled?: boolean,
  value?: boolean,

  onChange(template: string, value: boolean): void,
}

/** CustomSettlementNameAllowed functional component */
const CustomSettlementNameAllowed = (props: Props) => {
  props = merge({
    value: true,
    enabled: false,
    onChange: () => {
    },
  }, props);

  const [value, setValue] = React.useState<boolean>(props.value as boolean);
  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

  const customSettlementNameAllowedAttribute = useAppSelector(({scenario}) => scenario?.values?.customSettlementNameAllowed);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = customSettlementNameAllowedAttribute ?? null;

    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
      setValue(extValue);
    }
  }, [customSettlementNameAllowedAttribute]);

  // Reflect attributes changes
  React.useEffect(() => {
    setEnabled(props.enabled as boolean);
  }, [props.enabled]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(
      toCustomSettlementNameAllowedTemplate(value, enabled), value
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !enabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10">
          Custom Settlement Name <code className={cn('text-size-xs', {'text-muted': !enabled})}>
          {value ? '<True>' : '<False>'}
        </code>
          <div className="text-size-xxs text-muted mt-1">
            Determines if naming the settlement is an option on game start - unknown default name, where to set the name
          </div>
        </Col>
        <Col xs="2" className="text-right">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`custom_settlement_name_allowed-switch-${nanoid(5)}`}
            label=""
            checked={enabled}
            onChange={e => setEnabled(e.target.checked)}
          />
        </Col>
      </Row>
      <Form.Check
        type="switch"
        className="pull-right"
        disabled={!enabled}
        id={`custom_settlement_name_allowed-${nanoid(5)}`}
        label="Allow Custom Settlement Name?"
        checked={value}
        onChange={e => setValue(e.target.checked)}
      />
    </div>
  );
};

// Properties validation
CustomSettlementNameAllowed.propTypes = {
  value: PropTypes.bool,
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default CustomSettlementNameAllowed;
