/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {capitalCase} from 'change-case';
import {Col, Row} from 'react-bootstrap';

// elemental components
import Select, {Option} from '~/components/ui/Select';
import ConditionHeader from './../elements/ConditionHeader';

// hooks
import useAttributes from '~/hooks/use-attributes';

// utils
import {defaultsParams, START_MODES} from '~/utils/condition';
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';

// types
import type {ConditionAttributesProps, ConditionNewGame, ConditionProps} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionNewGame> {
}

const CONDITION_NAME: string = 'NewGame';

const NewGame = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const [attributes, setAttr, getAttr] = useAttributes<ConditionAttributesProps>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
  });

  const [values, setValue, getValue] = useAttributes<ConditionNewGame>(
    merge(defaultsParams?.newGame || {}, newProps?.initialValues || {}),
  );

  React.useEffect(() => {
    if (attributes.enabled) {
      setValue('startMode', props?.values?.startMode, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    attributes.enabled, props?.values?.startMode,
  ]);

  // Reflect values changes
  React.useEffect(() => {
    newProps?.onTemplate(toConditionTemplate('NewGame', values, !attributes.enabled));
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
              <div className="position-relative pl-3" style={{top: 7}}>Start Mode</div>
            </Col>
            <Col xs="5">
              <Select
                isSearchable={false}
                isClearable
                isDisabled={isDisabled}
                menuPortalTarget={document.body}
                defaultValue={getValue('startMode') ? {
                  label: capitalCase(getValue('startMode') as string),
                  value: getValue('startMode'),
                } : null}
                options={START_MODES.map(value => ({label: capitalCase(value), value}))}
                placeholder="Choose..."
                onChange={(option: Option | any, {action}): void => {
                  if (action === 'select-option' && option) {
                    setValue('startMode', option.value);
                  }
                  if (['clear', 'remove-value'].includes(action)) {
                    setValue('startMode', '');
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
NewGame.propTypes = {
  /*enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  startMode: PropTypes.oneOf(START_MODES),*/
};

export default NewGame;
