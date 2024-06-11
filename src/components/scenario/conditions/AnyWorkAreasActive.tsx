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

// elemental components
import Slider from '~/components/ui/Slider';
import ConditionHeader from './../elements/ConditionHeader';

// utils
import * as random from '~/utils/random';
import {toWorkers} from '~/utils/units';
import {defaultsParams, PERFORMERS_MAX, PERFORMERS_MIN} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {ConditionAnyWorkAreasActive as ConditionAttributes} from '~/types/condition.types';

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

const CONDITION_NAME: string = 'AnyWorkAreasActive';

const AnyWorkAreasActive = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: true,
    disabledCheckbox: false,
    removeIcon: false,
    expanded: true,
    onChange: () => {
    },
    onRemoveClick: () => {
    },
  }, defaultsParams.anyWorkAreasActive as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean,
    workAreaId: newProps.workAreaId as string,
    maxWorkers: toWorkers(newProps.maxWorkers as number),
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const toTemplateText = (): string => {
    return !attributes.enabled || !String(attributes?.workAreaId || '')?.trim()
      ? ''
      : (
        `<condition type="${CONDITION_NAME}"`
        + ` work_area_id="${attributes?.workAreaId}"`
        + ` max_workers="${attributes.maxWorkers}"/>`
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
      props?.workAreaId && setAttribute('workAreaId', props.workAreaId);
      props?.maxWorkers && setAttribute('maxWorkers', toWorkers(props.maxWorkers));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const isDisabled = props.disabledCheckbox || !attributes.enabled;

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
              <div className="position-relative pl-3" style={{top: 7}}>
                Work Area ID
              </div>
            </Col>
            <Col xs="6">
              <Form.Control
                type="text"
                size="sm"
                disabled={isDisabled}
                className="pull-right"
                aria-disabled={isDisabled}
                id={`condition-${nanoid(5)}`}
                placeholder="e.g., mountain_side"
                value={attributes?.workAreaId || ''}
                onChange={e => setAttribute('workAreaId', e.target.value.replace(/['"]+/ig, ``))}
              />
            </Col>
          </Row>
          <Row className="mb-1 mt-3">
            <Col xs="2">
              <div className="position-relative pl-3" style={{top: 7}}>
                Max Workers
              </div>
            </Col>
            <Col xs="6">
          <span className="text-size-xs font-family-code">
										Value: <code className={cn({'text-muted': isDisabled})}>{attributes.maxWorkers}</code>
									</span>
              <Button disabled={isDisabled}
                      className="button-reset-sm" variant="link"
                      onClick={() => setAttribute('maxWorkers', random.randomWorkers())}>
                Random
              </Button>
              <Slider
                min={PERFORMERS_MIN}
                max={PERFORMERS_MAX}
                step={1} disabled={isDisabled}
                value={Number(attributes.maxWorkers)}
                onChange={value => setAttribute('maxWorkers', Number(value))}/>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
AnyWorkAreasActive.propTypes = {
  enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  workAreaId: PropTypes.string,
  maxWorkers: PropTypes.number,
};

export default AnyWorkAreasActive;
