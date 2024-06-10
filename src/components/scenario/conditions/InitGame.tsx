// noinspection HtmlUnknownAttribute

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

// icons
import {COLOR_DISABLED, COLOR_REDDISH, IconCondition} from '~/components/icons/app';
// elemental components

// utils
import {defaultsParams} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {ConditionInitGame as ConditionAttributes,} from '~/types/condition.types';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
  disabledCheckbox?: boolean;
}

interface Props extends Attributes {
  onChange?(template: string): void,
}

const CONDITION_NAME: string = 'InitGame';

const InitGame = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: false,
    disabledCheckbox: false,
    onChange: () => {
    },
  }, defaultsParams.initGame as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    // @ts-ignore
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const toTemplateText = (): string => {
    return !attributes.enabled
      ? ''
      : `<condition type="${CONDITION_NAME}"/>`;
  };

  // Reflect state changes
  React.useEffect(() => {
    typeof newProps.onChange === 'function' && newProps.onChange(toTemplateText());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    setAttribute('enabled', props.enabled);
    setAttribute('disabledCheckbox', props.disabledCheckbox);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const isDisabled = attributes.disabledCheckbox || !attributes.enabled;

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10">
          <IconCondition width="17" height="17"
                         color={!attributes.enabled ? COLOR_DISABLED : COLOR_REDDISH}/>
          {' '} <strong>Condition</strong>:
          InitGame</Col>
        <Col xs="2" className="text-right">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`condition-switch-${nanoid(5)}`}
            disabled={attributes.disabledCheckbox}
            label=""
            checked={attributes.enabled}
            onChange={e => setAttribute<boolean>('enabled', e.target.checked)}
          />
        </Col>
      </Row>
      <div className="pl-3 text-muted mb-3"><i>No parameters</i></div>
    </div>
  );
};

// Properties validation
InitGame.propTypes = {
  enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  onChange: PropTypes.func,
};

export default InitGame;
