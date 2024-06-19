// noinspection HtmlUnknownAttribute

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
import NumberInput from '~/components/ui/NumberInput';
import Select, {Option} from '~/components/ui/Select';
import ConditionHeader from './../elements/ConditionHeader';

// hooks
import useAttributes from '~/hooks/use-attributes';

// utils
import * as random from '~/utils/random';
import {capitalCase} from 'change-case';
import {ENTITIES_OPTIONS} from '~/utils/entities';
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';
import {defaultsParams, DISTANCE_MAX, DISTANCE_MIN} from '~/utils/condition';

// types
import type {ConditionAttributesProps, ConditionEntityNearMarker, ConditionProps} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionEntityNearMarker> {
}

const CONDITION_NAME: string = 'EntityNearMarker';

const EntityNearMarker = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const [attributes, setAttr, getAttr] = useAttributes<ConditionAttributesProps>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
  });

  const [values, setValue, getValue] = useAttributes<ConditionEntityNearMarker>(
    merge(defaultsParams?.entityNearMarker || {}, newProps?.initialValues || {}),
  );

  React.useEffect(() => {
    if (attributes.enabled) {
      setValue('entityType', props?.values?.entityType, true);
      setValue('distance', props?.values?.distance, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    attributes.enabled, props?.values?.entityType,
    props?.values?.distance,
  ]);

  // Reflect values changes
  React.useEffect(() => {
    newProps?.onTemplate(toConditionTemplate('EntityNearMarker', values, !attributes.enabled));
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
                Entity Type
              </div>
            </Col>
            <Col xs="5">
              <Select
                isDisabled={isDisabled}
                menuPortalTarget={document.body}
                options={ENTITIES_OPTIONS}
                defaultValue={getValue('entityType')
                  ? {label: capitalCase(getValue('entityType')), value: getValue('entityType')}
                  : null
                }
                placeholder="Choose..."
                onChange={(option: Option | any, {action}): void => {
                  if (action === 'select-option' && option) {
                    setValue('entityType', option.value);
                  }
                }}
              />
            </Col>
          </Row>
          <Row className="mb-1 mt-3">
            <Col sm="2">
              <div className="position-relative pl-3" style={{top: 7}}>
                Distance
              </div>
            </Col>
            <Col sm="4">
              <NumberInput
                maxLength={3}
                min={DISTANCE_MIN}
                max={DISTANCE_MAX}
                decimals={1}
                disabled={isDisabled}
                allowClear={true}
                placeholder="e.g. 20"
                value={getValue('distance')}
                onChange={value => setValue('distance', value)}
                shuffle={true}
                onShuffle={() => setValue('distance', random.randomDistance())}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
EntityNearMarker.propTypes = {
  /*enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  entityType: PropTypes.oneOf(ENTITIES),
  distance: PropTypes.number,*/
};

export default EntityNearMarker;
