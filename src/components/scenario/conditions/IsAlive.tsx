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
import {Button, Col, Form, Row} from 'react-bootstrap';

// icons
import {COLOR_DISABLED, COLOR_REDDISH, IconCondition} from '~/components/icons/app';

// elemental components
import Slider from '~/components/ui/Slider';

// utils
import * as random from '~/utils/random';
import {toWorkers} from '~/utils/units';
import {defaultsParams, PERFORMERS_MAX, PERFORMERS_MIN} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {ConditionIsAlive as ConditionAttributes} from '~/types/condition.types';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
}

interface Props extends Attributes {
  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'IsAlive';

const IsAlive = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: false,
    name: '',
    onChange: () => {
    },
  }, defaultsParams.isAlive as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    name: newProps.name as string,
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const toTemplateText = (): string => {
    return !attributes.enabled || !String(attributes?.name || '')?.trim()
      ? ''
      : (
        `<condition type="${CONDITION_NAME}" name="${attributes.name}"/>`
      );
  };

  // Reflect state changes
  React.useEffect(() => {
    typeof newProps.onChange === 'function' && newProps.onChange(toTemplateText(), attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    'enabled' in props && setAttribute('enabled', props.enabled);

    if (attributes.enabled) {
      props?.name && setAttribute('name', props.name);
    }
  }, [props, attributes.enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !attributes.enabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10">
          <IconCondition width="17" height="17"
                         color={!attributes.enabled ? COLOR_DISABLED : COLOR_REDDISH}/>
          {' '} <strong>Condition</strong>: IsAlive</Col>
        <Col xs="2" className="text-right">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`condition-switch-${nanoid(5)}`}
            label=""
            checked={attributes.enabled}
            onChange={e => setAttribute('enabled', e.target.checked)}
          />
        </Col>
      </Row>
      <Row className="mb-1 mt-2">
        <Col xs="2">
            <div className="position-relative pl-3" style={{top: 7}}>Name</div>
        </Col>
        <Col xs="6">
          <Form.Control
            type="text"
            size="sm"
            disabled={!attributes.enabled}
            className="pull-right"
            aria-disabled={!attributes.enabled}
            id={`condition-${nanoid(5)}`}
            placeholder="e.g., deer"
            value={attributes?.name || ''}
            onChange={e => setAttribute('name', e.target.value.replace(/['"]+/ig, ``))}
          />
        </Col>
      </Row>
    </div>
  );
};

// Properties validation
IsAlive.propTypes = {
  enabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

export default IsAlive;
