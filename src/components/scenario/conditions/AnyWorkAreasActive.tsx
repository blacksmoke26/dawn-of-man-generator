/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {Col, Row} from 'react-bootstrap';

// elemental components
import TextInput from '~/components/ui/TextInput';
import NumberInput from '~/components/ui/NumberInput';
import ConditionHeader from './../elements/ConditionHeader';

// hooks
import useAttributes from '~/hooks/use-attributes';

// utils
import * as random from '~/utils/random';
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';
import {defaultsParams, PERFORMERS_MAX, PERFORMERS_MIN} from '~/utils/condition';

// types
import type {ConditionAnyWorkAreasActive, ConditionAttributesProps, ConditionProps} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionAnyWorkAreasActive> {
}

const CONDITION_NAME: string = 'AnyWorkAreasActive';

const AnyWorkAreasActive = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const [attributes, setAttr, getAttr] = useAttributes<ConditionAttributesProps>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
  });

  const [values, setValue, getValue] = useAttributes<ConditionAnyWorkAreasActive>(
    merge(defaultsParams?.anyWorkAreasActive || {}, newProps?.initialValues || {}),
  );
  React.useEffect(() => {
    if (attributes.enabled) {
      setValue('workAreaId', props?.values?.workAreaId, true);
      setValue('maxWorkers', props?.values?.maxWorkers, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes.enabled, props?.values?.workAreaId, props?.values?.maxWorkers]);

  // Reflect values changes
  React.useEffect(() => {
    newProps?.onTemplate(toConditionTemplate('AnyWorkAreasActive', values, !attributes.enabled));
    newProps?.onValuesChange(filterEmpty(values));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes.enabled, values]);

  // Reflect state changes
  React.useEffect(() => {
    newProps.onChange(attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    setAttr('enabled', props?.enabled, true);
    setAttr('disabledCheckbox', props?.disabledCheckbox, true);
    setAttr('expanded', props?.expanded, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.enabled, props?.disabledCheckbox, props?.expanded]);

  const isDisabled = getAttr('disabledCheckbox') || !getAttr('enabled');

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <ConditionHeader
        caption={CONDITION_NAME} showCheckbox={newProps.showCheckbox}
        enabled={getAttr('enabled')}
        onEnabled={(isEnabled: boolean) => setAttr('enabled', isEnabled)}
        disabledCheckbox={getAttr('disabledCheckbox')}
        removeIcon={newProps.removeIcon}
        onRemoveClick={newProps.onRemoveClick}
        onExpandedClick={(state: boolean) => setAttr('expanded', state)}
        expanded={getAttr('expanded')}/>
      {getAttr('expanded') && (
        <>
          <Row className="mb-1 mt-2">
            <Col xs="2">
              <div className="position-relative pl-3" style={{top: 7}}>
                Work Area ID
              </div>
            </Col>
            <Col xs="6">
              <TextInput
                selectOnLoad={true}
                focusOnLoad={true}
                disabled={isDisabled}
                value={getValue('workAreaId', '')}
                placeholder="e.g., mountain_side"
                onChange={value => setValue('workAreaId', value)}/>
            </Col>
          </Row>
          <Row className="mb-1 mt-3">
            <Col sm="2">
              <div className="position-relative pl-3" style={{top: 7}}>
                Max Workers
              </div>
            </Col>
            <Col sm="4">
              <NumberInput
                maxLength={3}
                min={PERFORMERS_MIN}
                max={PERFORMERS_MAX}
                disabled={isDisabled}
                allowClear={true}
                placeholder="e.g. 26"
                value={getValue('maxWorkers', '')}
                onChange={value => setValue('maxWorkers', value)}
                shuffle={true}
                onShuffle={() => setValue('maxWorkers', random.randomWorkers())}
                allowRestore
                onRestore={() => setValue('maxWorkers', PERFORMERS_MAX)}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
AnyWorkAreasActive.propTypes = {
};

export default AnyWorkAreasActive;
