// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Col, Form, Row} from 'react-bootstrap';

// elemental components
import TextInput from '~/components/ui/TextInput';

// redux
import {useAppSelector} from '~redux/hooks';

/** GroupID `props` type */
interface Props {
  enabled?: boolean,
  value?: string,

  onChange?(template: string, value: string): void,
}

/** GroupID functional component */
const GroupID = (props: Props) => {
  props = merge({
    value: 'bygone_tales',
    enabled: false,
    onChange: () => {
    },
  }, props);

  const [value, setValue] = React.useState<string>(props.value as string);
  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

  const groupIdAttribute = useAppSelector(({scenario}) => scenario.values?.groupId);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = groupIdAttribute ?? null;

    if (!extValue) {
      setEnabled(!!extValue);
    } else {
      setValue(extValue as string);
    }
  }, [groupIdAttribute]);

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
      : `<group_id value="${value}"/>`;
  };

  return (
    <div className={cn('mb-2', {'text-muted': !enabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10">
          Group ID
          <div className="text-size-xxs text-muted mt-1">
            Defines the group for the scenario, you can group several related scenarios and they will appear next to
            each other in the game UI.
          </div>
        </Col>
        <Col xs="2" className="text-right">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`group_id-switch-${nanoid(5)}`}
            label=""
            checked={enabled}
            onChange={e => setEnabled(e.target.checked)}
          />
        </Col>
      </Row>
      <TextInput
        caseType="SNAKE_CASE"
        disabled={!enabled}
        value={value}
        placeholder="e.g., by_gone_tales"
        onChange={theValue => setValue(theValue as string)}/>
    </div>
  );
};

// Properties validation
GroupID.propTypes = {
  value: PropTypes.string,
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default GroupID;
