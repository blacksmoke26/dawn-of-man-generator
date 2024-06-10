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
import {COLOR_DISABLED, COLOR_REDDISH, IconCondition} from '~/components/icons/app';

// elemental components
import Select, {Option} from '~/components/ui/Select';

// utils
import {toString} from '~/helpers/string';
import {defaultsParams, GAME_MODES, START_MODES} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {
  StartMode,
  ConditionNewGame as ConditionAttributes,
} from '~/types/condition.types';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
  disabledCheckbox?: boolean;
}

interface Props extends Attributes {
  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'NewGame';

const NewGame = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: false,
    disabledCheckbox: false,
    onChange: () => {
    },
  }, defaultsParams.newGame as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    startMode: toString<StartMode>(newProps.startMode),
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const toTemplateText = (): string => {
    return !attributes.enabled || !String(attributes?.startMode ?? '').trim()
      ? ''
      : (
        `<condition type="${CONDITION_NAME}" start_mode="${attributes?.startMode}"/>`
      );
  };

  // Reflect state changes
  React.useEffect(() => {
    typeof newProps.onChange === 'function' && newProps.onChange(toTemplateText(), attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    setAttribute('enabled', props.enabled);
    setAttribute('disabledCheckbox', props.disabledCheckbox);

    if (attributes.enabled) {
      props?.startMode && setAttribute('startMode', props.startMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const isDisabled = attributes.disabledCheckbox || !attributes.enabled;

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10">
          <IconCondition width="17" height="17" color={isDisabled ? COLOR_DISABLED : COLOR_REDDISH}/>
          {' '} <strong>Condition</strong>: NewGame
        </Col>
        <Col xs="2" className="text-right">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`condition-switch-${nanoid(5)}`}
            disabled={attributes.disabledCheckbox}
            label=""
            checked={attributes.enabled}
            onChange={e => setAttribute('enabled', e.target.checked)}
          />
        </Col>
      </Row>
      <Row className="mb-1 mt-2">
        <Col xs="2">
            <div className="position-relative pl-3" style={{top: 7}}>Start Mode</div>
        </Col>
        <Col xs="5">
          <Select
            isSearchable={false}
            isDisabled={isDisabled}
            menuPortalTarget={document.body}
            defaultValue={newProps?.startMode ? {
              label: capitalCase(newProps.startMode as string),
              value: newProps.startMode
            } : null}
            options={GAME_MODES.map(value => ({label: capitalCase(value), value}))}
            placeholder="Choose..."
            onChange={(option: Option | any, {action}): void => {
              if (action === 'select-option' && option) {
                setAttribute('startMode', option.value);
              }
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

// Properties validation
NewGame.propTypes = {
  enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  startMode: PropTypes.oneOf(START_MODES),
  onChange: PropTypes.func,
};

export default NewGame;
