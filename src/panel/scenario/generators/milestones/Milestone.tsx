/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
//import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Col, Row} from 'react-bootstrap';

// elemental components
import TextInput from '~/components/ui/TextInput';
import Select, {Option} from '~/components/ui/Select';

// components
import {MilestoneCheck, MilestoneRemove, MilestoneToggle} from './utils/elements';
import Condition from '~/components/scenario/generic/Condition';

// icons
import {COLOR_REDDISH, IconCondition, IconConditionLogical, IconMilestone} from '~/components/icons/app';

// utils
import {toString} from '~/helpers/string';
import {buildStrings, LangStrings} from '~/utils/strings';
import {CONDITIONS_OPTIONS, LOGICAL_CONDITION} from '~/utils/condition';
import {
  conditionsToChangedValues,
  defaultValues,
  propToConditionsAttributes,
  toMilestoneTemplate,
} from './utils/general';

// hooks
import useAttributes from '~/hooks/use-attributes';

// types
import type {Required} from 'utility-types';
import type {KVDocument} from '~/types/json.types';
import type {
  MilestoneChangedConditions,
  MilestoneChangedValues,
  MilestoneConditionsAttributes,
  MilestonePropConditions,
} from './types/milestone.types';
import {onlyKeys} from '~/helpers/object';

export interface Props {
  id?: string;
  description?: string;
  disabled?: boolean;
  disabledCheckbox?: boolean;
  expanded?: boolean;
  conditions?: MilestonePropConditions;

  /** A callback triggers when metadata values are updated */
  onValuesChange?(values: MilestoneChangedValues): void;

  /** A callback triggers when conditions are updated */
  onConditionsChange?(values: MilestoneChangedConditions): void;

  /** A callback triggers when language strings are updated */
  onStringsChange?(strings: LangStrings): void;

  /** A callback triggers when xml template is rendered */
  onTemplate?(value: string): void;

  /** A callback triggers when remove icon button is clicked */
  onRemoveClick?(): void,
}

/** Milestone functional component */
const Milestone = (props: Props) => {
  const newProps = merge<Required<Props>>(defaultValues, props);

  const [attributes, setAttr, getAttr] = useAttributes<{
    id: string, desc: string,
    disabled: boolean;
    disabledCheckbox: boolean;
    expanded: boolean;
  }>({
    id: toString(newProps.id),
    desc: toString(newProps.description),
    disabled: newProps.disabled,
    disabledCheckbox: newProps.disabledCheckbox,
    expanded: newProps.expanded,
  });

  const [conditions, setCond, , remCond, clearCond, setAllCond] = useAttributes<MilestoneConditionsAttributes>(
    propToConditionsAttributes(newProps?.conditions),
  );

  //<editor-fold desc="Reflect strings(language texts) changes">
  React.useEffect(() => {
    const strings: KVDocument<string> = {};

    if (!attributes.disabled) {
      strings[attributes.id] = attributes.desc;
    }

    newProps.onStringsChange(buildStrings(strings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes.id, attributes.desc, attributes.disabled]);
  //</editor-fold>

  //<editor-fold desc="Reflect values changes">
  React.useEffect(() => {
    newProps.onValuesChange(attributes.disabled ? {} : {
      id: attributes.id,
      description: attributes.desc,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes.id, attributes.desc, attributes.disabled]);
  //</editor-fold>

  //<editor-fold desc="Reflect conditions/xml-template changes">
  React.useEffect(() => {
    newProps.onTemplate(attributes.disabled ? '' : toMilestoneTemplate(attributes.id, conditions));
    newProps.onConditionsChange(attributes.disabled ? [] : conditionsToChangedValues(conditions));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditions, attributes.disabled, attributes.id]);
  //</editor-fold>

  //<editor-fold desc="Reflect prop changes">
  React.useEffect(() => {
    setAttr('id', props?.id, true);
    setAttr('desc', props?.description, true);
    setAttr('expanded', props?.expanded, true);
    setAttr('disabled', props?.disabled, true);
    setAttr('disabledCheckbox', props?.disabledCheckbox, true);

    if (Array.isArray(props?.conditions)) {
      clearCond();
      setAllCond(propToConditionsAttributes(props?.conditions || []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.id, props?.description, props?.expanded, props?.disabled, props?.disabledCheckbox, props?.conditions]);
  //</editor-fold>

  const isDisabled =
    getAttr<boolean>('disabledCheckbox')
    || getAttr<boolean>('disabled');

  /** Generate selection based nodes */
  const renderConditions = (): React.ReactElement[] => {
    const elements: React.ReactElement[] = [];

    const totalCount = Object.keys(conditions).length;
    let index = 0;

    for (const [_id, condition] of Object.entries(conditions)) {
      const {type, ...initialValues} = condition;

      elements.push(
        <React.Fragment key={_id}>
          <div
            className="ml-2 pl-3"
            style={{borderLeft: '2px solid rgb(97 137 97)'}}>
            <Condition
              type={type}
              disabledCheckbox={isDisabled}
              enabled={!isDisabled}
              initialValues={initialValues}
              onRemoveClick={() => remCond(_id)}
              onValuesChange={values => {
                setCond(_id, {type, ...onlyKeys(values, ['type'], true)});
              }}
            />
          </div>
          {index < totalCount - 1 && <hr className="mt-2 mb-2"/>}
        </React.Fragment>,
      );
      index++;
    }

    return elements;
  };

  return (
    <div className={cn('mt-0 checkbox-align', {'text-muted': isDisabled})}>
      <Row className="mb-2 mt-2">
        <Col sm="2">
          <div className="position-relative" style={{top: 7}}>
            <IconMilestone width="16" height="16"/> Milestone ID
          </div>
        </Col>
        <Col sm="10">
          <Row>
            <Col sm="7" className="text-left">
              <TextInput
                selectOnLoad={true}
                focusOnLoad={true}
                caseType="SNAKE_CASE"
                disabled={isDisabled}
                value={getAttr<string>('id')}
                placeholder="e.g., survival_5_weeks"
                onChange={value => setAttr('id', value as string)}/>
            </Col>
            <Col sm="5" className="text-right">
              <div className="float-right">
                <MilestoneToggle
                  disabled={getAttr<boolean>('disabledCheckbox')}
                  expanded={getAttr<boolean>('expanded')}
                  onClick={() => setAttr('expanded', !getAttr<boolean>('expanded'))}/>
                <MilestoneCheck
                  disabled={getAttr<boolean>('disabledCheckbox')} checked={getAttr<boolean>('disabled')}
                  onChange={isChecked => setAttr('disabled', !isChecked)}/>
                <MilestoneRemove
                  disabled={getAttr<boolean>('disabledCheckbox')}
                  onClick={() => newProps.onRemoveClick()}/>
              </div>
              <div className="clearfix"></div>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className={cn({'d-none invisible': !getAttr<boolean>('expanded')})}>
        <Row className="mb-2 mt-2">
          <Col sm="2">
            <div
              className="position-relative ml-3"
              style={{top: 7}}>
              <span
                title="Displayed as the name of the milestone, stores in a language file"
                style={{textDecoration: 'underline dotted', cursor: 'default'}}>
                Description
              </span>
            </div>
          </Col>
          <Col sm="10">
            <Row>
              <Col sm="10" className="text-left">
                <TextInput
                  caseType="DEFAULT"
                  allowClear={true}
                  disabled={isDisabled}
                  value={getAttr<string>('desc')}
                  inputProps={{as: 'textarea', style: {height: 50, overflow: 'auto'}, 'aria-disabled': isDisabled}}
                  placeholder="e.g., Survive the long and cold winters..."
                  onChange={value => setAttr('desc', value as string)}/>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="mt-2 mb-3">
          <Select
            isDisabled={isDisabled}
            menuPortalTarget={document.body}
            options={CONDITIONS_OPTIONS}
            value={null}
            formatOptionLabel={(option: Option | any) => (
              <span>
                {option.type === 'logical' && <IconConditionLogical width="17" height="17" color={COLOR_REDDISH}/>}
                {option.type === 'general' && <IconCondition width="17" height="17" color={COLOR_REDDISH}/>}
                {' '} {option?.label}
              </span>
            )}
            placeholder="Add milestone condition..."
            onChange={(option: Option | any, {action}): void => {
              if (action === 'select-option' && option) {
                const conditionId: string = nanoid(10).toLowerCase();
                const params: KVDocument = {type: option.value};

                if (LOGICAL_CONDITION.includes(option.value)) {
                  params.conditions = [];
                }

                setCond(conditionId, params);
              }
            }}
          />
        </div>
        {renderConditions()}
      </div>
      <div className="mb-3"></div>
    </div>
  );
};

// Properties validation
Milestone.propTypes = {
  /*id: PropTypes.string,
  disabledCheckbox: PropTypes.bool,
  disabled: PropTypes.bool,
  conditions: PropTypes.object,
  onRemoveClick: PropTypes.func,*/
};

export default Milestone;
