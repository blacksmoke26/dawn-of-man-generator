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

// elemental components
import NumberInput from '~/components/ui/NumberInput';
import ConditionHeader from './../elements/ConditionHeader';

// utils
import * as random from '~/utils/random';
import {toString} from '~/helpers/string';
import {toPerformers} from '~/utils/units';
import {toAnyTasksActiveTemplate} from '~/utils/parser/templates';
import {defaultsParams, PERFORMERS_MAX, PERFORMERS_MIN} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {ConditionAnyTasksActive as ConditionAttributes} from '~/types/condition.types';

interface Attributes extends ConditionAttributes {
  enabled?: boolean;
  disabledCheckbox?: boolean;
  expanded?: boolean;
}

interface Props extends Attributes {
  removeIcon?: boolean;
  showCheckbox?: boolean,

  onRemoveClick?(): void,

  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'AnyTasksActive';

const AnyTasksActive = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: true,
    disabledCheckbox: false,
    removeIcon: false,
    showCheckbox: true,
    expanded: true,
    onChange: () => {
    },
    onRemoveClick: () => {
    },
  }, defaultsParams.anyTasksActive as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean,
    taskType: toString(newProps.taskType),
    minPerformers: toPerformers(newProps.minPerformers as number),
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  // Reflect state changes
  React.useEffect(() => {
    const args: [string, Attributes] = !attributes.enabled
      ? ['', {} as Attributes]
      : [toAnyTasksActiveTemplate(attributes), attributes];

    typeof newProps.onChange === 'function' && newProps.onChange.apply(null, args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    props?.enabled !== undefined && setAttribute('enabled', props.enabled);
    props?.disabledCheckbox !== undefined && setAttribute('disabledCheckbox', props.disabledCheckbox);
    props?.expanded !== undefined && setAttribute('expanded', props.expanded);

    if (props?.enabled) {
      props?.taskType !== undefined && setAttribute('taskType', toString(props.taskType));
      props?.minPerformers !== undefined && setAttribute('minPerformers', toPerformers(props.minPerformers));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const isDisabled = props.disabledCheckbox || !attributes.enabled;

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <ConditionHeader
        caption={CONDITION_NAME} showCheckbox={newProps.showCheckbox}
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
                onChange={e => {
                  setAttribute('taskType', e.target.value.replace(/['"]+/ig, ``));
                }}
              />
            </Col>
          </Row>
          <Row className="mb-1 mt-2">
            <Col sm="2">
              <div className="position-relative pl-3" style={{top: 7}}>
                Min Performers
              </div>
            </Col>
            <Col sm="4">
              <NumberInput
                maxLength={3}
                min={PERFORMERS_MIN}
                max={PERFORMERS_MAX}
                disabled={isDisabled}
                allowClear={true}
                placeholder="e.g. 0"
                value={attributes?.minPerformers}
                onChange={value => setAttribute('minPerformers', value)}
                shuffle={true}
                onShuffle={() => setAttribute('minPerformers', random.randomPerformers())}/>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
AnyTasksActive.propTypes = {
  enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  taskType: PropTypes.string,
  minPerformers: PropTypes.number,
  onChange: PropTypes.func,
};

export default AnyTasksActive;
