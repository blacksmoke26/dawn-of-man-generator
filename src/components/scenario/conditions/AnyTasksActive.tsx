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
import {toString} from '~/helpers/string';
import {toPerformers} from '~/utils/units';
import {defaultsParams, PERFORMERS_MAX, PERFORMERS_MIN} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import {ConditionAnyTasksActive as ConditionAttributes} from '~/types/condition.types';

interface Attributes extends ConditionAttributes {
  enabled?: boolean;
  disabledCheckbox?: boolean;
}

interface Props extends Attributes {
  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'AnyTasksActive';

const AnyTasksActive = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    disabledCheckbox: true,
    enabled: false,
    onChange: () => {
    },
  }, defaultsParams.anyTasksActive as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    taskType: toString(newProps.taskType),
    minPerformers: toPerformers(newProps.minPerformers as number),
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const toTemplateText = (): string => {
    return !attributes.enabled || !String(attributes?.taskType || '')?.trim()
      ? ''
      : (
        `<condition type="${CONDITION_NAME}"`
        + ` task_type="${attributes?.taskType}"`
        + ` min_performers="${attributes.minPerformers}"/>`
      );
  };

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    setAttribute('enabled', props.enabled);
    setAttribute('disabledCheckbox', props.disabledCheckbox);

    if (props.enabled) {
      props?.taskType && setAttribute('taskType', toString(props.taskType));
      props?.minPerformers && setAttribute('minPerformers', toPerformers(props.minPerformers));
    }
  }, [props]);

  const isDisabled = props.disabledCheckbox || !attributes.enabled;

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10">
          <IconCondition width="17" height="17"
                         color={isDisabled ? COLOR_DISABLED : COLOR_REDDISH}/>
          {' '} <strong>Condition</strong>: AnyTasksActive
        </Col>
        <Col xs="2" className="text-right">
          <Form.Check
            className="pull-right"
            type="switch"
            disabled={attributes.disabledCheckbox}
            id={`condition-switch-${nanoid(5)}`}
            label=""
            checked={attributes.enabled}
            onChange={e => setAttribute('enabled', e.target.checked)}
          />
        </Col>
      </Row>
      <Row className="mb-1 mt-2">
        <Col xs="2">
          <div className="position-relative pl-3" style={{top: 7}}>
            Task Type
          </div>
        </Col>
        <Col xs="6">
          <Form.Control
            type="text"
            size="sm"
            disabled={isDisabled}
            className="pull-right"
            aria-disabled={!isDisabled}
            id={`condition-${nanoid(5)}`}
            placeholder="e.g., protein_hoarding"
            value={attributes?.taskType || ''}
            onChange={e => setAttribute('taskType', e.target.value.replace(/['"]+/ig, ``))}
          />
        </Col>
      </Row>
      <Row className="mb-1 mt-2">
        <Col xs="2">
          <div className="position-relative pl-3" style={{top: 7}}>
            Min Performers
          </div>
        </Col>
        <Col xs="6">
          <span className="text-size-xs font-family-code">
            Value:
            {' '}
            <code className={cn({'text-muted': isDisabled})}>
              {attributes.minPerformers}
            </code>
          </span>
          <Button disabled={isDisabled}
                  style={{top: -1}}
                  className="button-reset-sm" variant="link"
                  onClick={() => setAttribute('minPerformers', random.randomPerformers())}>
            Random
          </Button>
          <Slider
            min={PERFORMERS_MIN}
            max={PERFORMERS_MAX}
            step={1} disabled={isDisabled}
            value={Number(attributes.minPerformers)}
            onChange={value => setAttribute('minPerformers', Number(value))}/>
        </Col>
      </Row>
    </div>
  );
};

// Properties validation
AnyTasksActive.propTypes = {
  enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  taskType: PropTypes.string,
  minPerformers: PropTypes.number,
  onChange: PropTypes.func,
};

export default AnyTasksActive;
