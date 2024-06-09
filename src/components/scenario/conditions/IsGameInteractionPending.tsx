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
import {capitalCase} from 'change-case';
import {Col, Form, Row} from 'react-bootstrap';

// icons
// elemental components
import Select, {Option} from '~/components/ui/Select';

// utils
import {defaultsParams, INTERACTIONS} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {ConditionIsGameInteractionPending as ConditionAttributes, InteractionType,} from '~/types/condition.types';
import {COLOR_DISABLED, COLOR_REDDISH, IconCondition} from '~/components/icons/app';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
}

interface Props extends Attributes {
  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'IsGameInteractionPending';

const IsGameInteractionPending = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: false,
    onChange: () => {
    },
  }, defaultsParams.isGameInteractionPending as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    value: newProps.value as InteractionType,
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const toTemplateText = (): string => {
    return !attributes.enabled || !String(attributes?.value ?? '').trim()
      ? ''
      : (
        `<condition type="${CONDITION_NAME}" value="${attributes?.value}"/>`
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
      props?.value && setAttribute('value', props.value);
    }
  }, [props, attributes.enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !attributes.enabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10">
          <IconCondition width="17" height="17"
                         color={!attributes.enabled ? COLOR_DISABLED : COLOR_REDDISH}/>
          {' '} <strong>Condition</strong>: IsGameInteractionPending
        </Col>
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
            <div className="position-relative pl-3" style={{top: 7}}>Value</div>
        </Col>
        <Col xs="5">
          <Select
            isSearchable={false}
            isDisabled={!attributes.enabled}
            menuPortalTarget={document.body}
            options={INTERACTIONS.map(value => ({label: capitalCase(value), value}))}
            placeholder="Choose..."
            onChange={(option: Option | any, {action}): void => {
              if (action === 'select-option' && option) {
                setAttribute('value', option.value);
              }
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

// Properties validation
IsGameInteractionPending.propTypes = {
  enabled: PropTypes.bool,
  value: PropTypes.oneOf(INTERACTIONS),
  onChange: PropTypes.func,
};

export default IsGameInteractionPending;
