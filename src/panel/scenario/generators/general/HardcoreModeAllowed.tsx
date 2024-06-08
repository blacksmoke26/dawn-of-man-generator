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

/** HardcoreModeAllowed `props` type */
interface Props {
  enabled?: boolean,
  value?: boolean,

  onChange(template: string, value: boolean): void,
}

/** HardcoreModeAllowed functional component */
const HardcoreModeAllowed = (props: Props) => {
  props = merge({
    value: true,
    enabled: true,
    onChange: () => {
    },
  }, props);

  const [value, setValue] = React.useState<boolean>(props.value as boolean);
  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

  const scenario = useAppSelector(({scenario}) => (scenario));

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = scenario?.hardcoreModeAllowed ?? null;

    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
      setValue(extValue);
    }
  }, [scenario]);

  // Reflect attributes changes
  React.useEffect(() => {
    setEnabled(props.enabled as boolean);
  }, [props.enabled]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, enabled]);

  const toTemplateText = (): string => {
    return !enabled
      ? ''
      : `<hardcore_mode_allowed value="${value ? 'true' : 'false'}"/>`;
  };

  return (
    <div className={cn('mb-2', {'text-muted': !enabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10">
          Hardcore Mode <code className={cn('text-size-xs', {'text-muted': !enabled})}>
          {value ? '<True>' : '<False>'}
        </code>
          <div className="text-size-xxs text-muted mt-1">
            Player whether this scenario can be played in hardcore mode or not.
          </div>
        </Col>
        <Col xs="2" className="text-right">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`hardcore_mode_allowed-switch-${nanoid(5)}`}
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
        id={`hardcore_mode_allowed-${nanoid(5)}`}
        label="Allow Hardcore Mode?"
        checked={value}
        onChange={e => setValue(e.target.checked)}
      />
    </div>
  );
};

// Properties validation
HardcoreModeAllowed.propTypes = {
  value: PropTypes.bool,
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default HardcoreModeAllowed;
