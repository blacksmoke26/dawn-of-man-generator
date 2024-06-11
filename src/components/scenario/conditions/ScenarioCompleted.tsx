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

// elemental components
import Select, {Option} from '~/components/ui/Select';
import ConditionHeader from './../elements/ConditionHeader';

// utils
import {toString} from '~/helpers/string';
import {defaultsParams, GAME_MODES} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {ConditionScenarioCompleted as ConditionAttributes, GameMode,} from '~/types/condition.types';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
  disabledCheckbox?: boolean;
  expanded?: boolean;
}

interface Props extends Attributes {
  removeIcon?: boolean;

  onRemoveClick?(): void,

  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'ScenarioCompleted';

const ScenarioCompleted = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: true,
    disabledCheckbox: false,
    removeIcon: false,
    expanded: true,
    onChange: () => {
    },
    onRemoveClick: () => {
    },
  }, defaultsParams.newGame as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean,
    id: toString<string>(newProps.id),
    gameMode: toString<GameMode>(newProps.gameMode),
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const toTemplateText = (): string => {
    return !attributes.enabled
    || !String(attributes?.id ?? '').trim()
    || !String(attributes?.gameMode ?? '').trim()
      ? ''
      : (
        `<condition type="${CONDITION_NAME}"`
        + ` id="${attributes?.id}"`
        + ` game_mode="${attributes?.gameMode}"/>`
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
    setAttribute('expanded', props.expanded);

    if (props.enabled) {
      props?.id && setAttribute('id', props.id?.toString());
      props?.gameMode && setAttribute('gameMode', props.gameMode?.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const isDisabled = attributes.disabledCheckbox || !attributes.enabled;

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <ConditionHeader caption={CONDITION_NAME}
                       enabled={attributes.enabled}
                       onEnabled={(isEnabled: boolean) => setAttribute('enabled', isEnabled)}
                       disabledCheckbox={attributes.disabledCheckbox}
                       removeIcon={newProps.removeIcon}
                       onRemoveClick={newProps.onRemoveClick}
                       onExpandedClick={(state: boolean) => setAttribute('expanded', state)}
                       expanded={attributes.expanded}/>
      {attributes?.expanded && (
        <>
          <Row className="mb-1 mt-2">
            <Col xs="2">
              <div className="position-relative pl-3" style={{top: 7}}>ID</div>
            </Col>
            <Col xs="6">
              <Form.Control
                type="text"
                size="sm"
                disabled={isDisabled}
                className="pull-right"
                aria-disabled={isDisabled}
                id={`condition-${nanoid(5)}`}
                placeholder="e.g., the_shepherds_herd"
                value={toString(attributes?.id)}
                onChange={e => setAttribute('id', e.target.value.replace(/['"]+/ig, ``))}
              />
            </Col>
          </Row>
          <Row className="mb-1 mt-2">
            <Col xs="2">
              <div className="position-relative pl-3" style={{top: 7}}>Game Mode</div>
            </Col>
            <Col xs="5">
              <Select
                isDisabled={isDisabled}
                isSearchable={false}
                defaultValue={newProps?.gameMode ? {
                  label: capitalCase(newProps.gameMode as string),
                  value: newProps.gameMode
                } : null}
                menuPortalTarget={document.body}
                options={GAME_MODES.map(value => ({label: capitalCase(value), value}))}
                placeholder="Choose..."
                onChange={(option: Option | any, {action}): void => {
                  if (action === 'select-option' && option) {
                    setAttribute('gameMode', option.value);
                  }
                }}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
ScenarioCompleted.propTypes = {
  enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  id: PropTypes.string,
  gameMode: PropTypes.oneOf(GAME_MODES),
};

export default ScenarioCompleted;
