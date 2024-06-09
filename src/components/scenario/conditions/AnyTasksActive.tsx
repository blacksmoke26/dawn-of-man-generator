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
import {IconCondition} from '~/components/icons/app';

// elemental components
import Slider from '~/components/ui/Slider';

// utils
import * as random from '~/utils/random';
import {defaultsParams, PERFORMERS_MAX, PERFORMERS_MIN} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import {ConditionAnyTasksActive as ConditionAttributes} from '~/types/condition.types';
import {toPerformers} from '~/utils/units';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
}

interface Props extends Attributes {
  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'AnyTasksActive';

const AnyTasksActive = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: false,
    onChange: () => {
    },
  }, defaultsParams.anyTasksActive as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    taskType: newProps.taskType as string,
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
    typeof newProps.onChange === 'function' && newProps.onChange(toTemplateText(), attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    'enabled' in props && setAttribute('enabled', props.enabled);

    if (attributes.enabled) {
      props?.taskType && setAttribute('taskType', props.taskType);
      props?.minPerformers && setAttribute('minPerformers', toPerformers(props.minPerformers));
    }
  }, [props, attributes.enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !attributes.enabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10"><IconCondition width="17" height="17" color="#ff8a65"/> <strong>Condition</strong>: AnyTasksActive</Col>
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
      <Row className="mb-1 mt-3">
        <Col xs="2">
            <span className="position-relative" style={{top: 7}}>
              Task Type
            </span>
        </Col>
        <Col xs="6">
          <Form.Control
            type="text"
            size="sm"
            disabled={!attributes.enabled}
            className="pull-right"
            aria-disabled={!attributes.enabled}
            id={`condition-${nanoid(5)}`}
            placeholder="e.g., protein_hoarding"
            value={attributes?.taskType || ''}
            onChange={e => setAttribute('taskType', e.target.value.replace(/['"]+/ig, ``))}
          />
        </Col>
      </Row>
      <Row className="mb-1 mt-3">
        <Col xs="2">
            <span className="position-relative" style={{top: 7}}>
              Min Performers
            </span>
        </Col>
        <Col xs="6">
          <span className="text-size-xs font-family-code">
										Value: <code className={cn({'text-muted': !attributes.enabled})}>{attributes.minPerformers}</code>
									</span>
          <Button disabled={!attributes.enabled}
                  className="button-reset-sm" variant="link"
                  onClick={() => setAttribute('minPerformers', random.randomPerformers())}>
            Random
          </Button>
          <Slider
            min={PERFORMERS_MIN}
            max={PERFORMERS_MAX}
            step={1} disabled={!attributes.enabled}
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
  taskType: PropTypes.string,
  minPerformers: PropTypes.number,
  onChange: PropTypes.func,
};

export default AnyTasksActive;
