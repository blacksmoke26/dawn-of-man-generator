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
import ConditionHeader from './../elements/ConditionHeader';

// hooks
import useAttributes from '~/hooks/use-attributes';

// utils
import {defaultsParams} from '~/utils/condition';
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';

// types
import type {ConditionAttributesProps, ConditionIsAlive, ConditionProps} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionIsAlive> {
}

const CONDITION_NAME: string = 'IsAlive';

const IsAlive = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const [attributes, setAttr, getAttr] = useAttributes<ConditionAttributesProps>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
  });

  const [values, setValue, getValue] = useAttributes<ConditionIsAlive>(
    merge(defaultsParams?.isAlive || {}, newProps?.initialValues || {}),
  );

  React.useEffect(() => {
    if (attributes.enabled) {
      setValue('name', props?.values?.name, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    attributes.enabled, props?.values?.name,
  ]);

  // Reflect values changes
  React.useEffect(() => {
    newProps?.onTemplate(toConditionTemplate('IsAlive', values, !attributes.enabled));
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
              <div className="position-relative pl-3" style={{top: 7}}>Name</div>
            </Col>
            <Col xs="6">
              <TextInput
                selectOnLoad={true}
                focusOnLoad={true}
                disabled={isDisabled}
                value={getValue('name', '')}
                placeholder="e.g., deer"
                onChange={value => setValue('name', value)}/>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
IsAlive.propTypes = {
  /*enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,*/
};

export default IsAlive;
