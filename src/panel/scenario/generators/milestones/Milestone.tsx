/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-10
 */

import React from 'react';
import cn from 'classname';
import {nanoid} from 'nanoid';
import {Col, Row} from 'react-bootstrap';

// elemental components
import Accordion from '~/components/ui/Accordion';
import TextInput from '~/components/ui/TextInput';
import Select, {Option} from '~/components/ui/Select';
import PropertyLabel from '~/components/ui/PropertyLabel';
import Condition from '~/components/scenario/generic/Condition';

// components
import {MilestoneCheck, MilestoneRemove, MilestoneToggle} from './utils/elements';

// icons
import {COLOR_REDDISH, IconCondition, IconConditionLogical} from '~/components/icons/app';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {findNextTab} from '~/helpers/ui';
import {cloneObject, onlyKeys} from '~/helpers/object';
import {CONDITIONS_OPTIONS} from '~/utils/condition';

// parsers
import {buildStrings, LangStrings} from '~/utils/strings';
import {toMilestoneTemplate} from '~/utils/parser/template-milestone';

// types
import {scenario} from '~/data/scenario/parser/types';
import {ConditionName} from '~/types/condition.types';

export interface Props {
  disabled?: boolean;
  disabledCheckbox?: boolean;
  expanded?: boolean;

  initialValues?: scenario.Milestone;

  /** A callback triggers when metadata values are updated */
  onValuesChange?(values: scenario.Milestone): void;

  /** A callback triggers when language strings are updated */
  onStringsChange?(strings: LangStrings): void;

  /** A callback triggers when xml template is rendered */
  onTemplate?(value: string): void;
}

type ConditionAttribute = Record<string, scenario.condition.Condition>;

interface MilestoneAttributes {
  disabled: boolean;
  disabledCheckbox: boolean;
  expanded: boolean;
}

interface ValueAttributes extends Omit<scenario.Milestone, 'conditions'> {
  conditions: ConditionAttribute;
}

const Milestone = (props: Props) => {
  const valuer = useValues<ValueAttributes>({} as ValueAttributes);
  const condition = useValues<ConditionAttribute>({});

  const [init, setInit] = React.useState<boolean>(false);

  const meta = useValues<MilestoneAttributes>({
    disabled: props?.disabled ?? false,
    disabledCheckbox: props?.disabledCheckbox ?? false,
    expanded: props?.expanded ?? true,
  });

  React.useEffect(() => {
    valuer.setAll(onlyKeys(
      props?.initialValues ?? {}, ['conditions'], true,
    ) as ValueAttributes);
    condition.setAll(valuesToConditionAttributes(props?.initialValues));
    setInit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!init) return;

    const changedValues = cloneObject({
      ...valuer.data,
      conditions: Object.values(condition.data),
    });

    const isDisabled = meta.data.disabled || meta.data.disabledCheckbox;

    props?.onTemplate?.(toMilestoneTemplate(changedValues, isDisabled));
    props?.onStringsChange?.(!isDisabled && changedValues?.conditions.length ? createStrings(changedValues) : {});
    props?.onValuesChange?.(isDisabled ? {} as scenario.Milestone : changedValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [init, condition.data, valuer.data, meta.data.disabled, meta.data.disabledCheckbox]);
  //</editor-fold>

  //<editor-fold desc="Reflect prop changes">
  React.useEffect(() => {
    meta.set('expanded', props?.expanded, true);
    meta.set('disabled', props?.disabled, true);
    meta.set('disabledCheckbox', props?.disabledCheckbox, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.expanded, props?.disabled, props?.disabledCheckbox]);
  //</editor-fold>

  const isDisabled = meta.data.disabled || meta.data.disabledCheckbox;
  const conditions = Object.entries(condition.data);
  const conditionsCount = conditions.length;

  return (
    <div className={cn('mt-0 checkbox-align', {'text-muted-deep': isDisabled})}>
      <Row className="mb-2 mt-2">
        <PropertyLabel caption="Milestone ID" disabled={isDisabled}/>
        <Col sm="10">
          <Row>
            <Col sm="7" className="text-left">
              <TextInput
                selectOnLoad={true}
                focusOnLoad={true}
                caseType="SNAKE_CASE"
                disabled={isDisabled}
                value={valuer.get('id', 'untitled')}
                placeholder="e.g., survival_5_weeks"
                onChange={value => valuer.set('id', value as string)}/>
            </Col>
            <Col sm="5" className="text-right">
              <MilestoneToggle
                disabled={meta.data.disabledCheckbox}
                expanded={meta.data.expanded}
                onClick={() => meta.set('expanded', isExpanded => !isExpanded)}/>
              <MilestoneRemove
                disabled={meta.data.disabledCheckbox}
                onClick={() => condition.setAll({})}/>
              <MilestoneCheck
                disabled={meta.data.disabledCheckbox}
                checked={meta.data.disabled}
                onChange={isChecked => meta.set('disabled', !isChecked)}/>
            </Col>
          </Row>
        </Col>
      </Row>

      <div className={cn({'d-none invisible': !meta.data.expanded})}>
        <Accordion
          noBodyPad={true}
          noCard={true}
          header="Optional parameters"
          eventKey="optional_parameters">
          <Row className="mt-2">
            <PropertyLabel
              disabled={isDisabled}
              caption="Description"
              tooltip="Displayed as the name of the milestone, stores in a language file"
            />
            <Col sm="7">
              <TextInput
                caseType="DEFAULT"
                allowClear={true}
                disabled={isDisabled}
                value={valuer.get('description', '')}
                inputProps={{as: 'textarea', style: {height: 32, overflow: 'auto'}, 'aria-disabled': isDisabled}}
                placeholder="e.g., Survive the long and cold winters..."
                onChange={value => valuer.set('description', String(value))}/>
            </Col>
          </Row>
        </Accordion>

        <Row className="mt-3 mb-3">
          <Col sm="9">
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
              onChange={(option: Option | any): void => {
                const conditionId: string = nanoid(10).toLowerCase();
                condition.set(conditionId, {type: option.value});
              }}
            />
          </Col>
        </Row>
        {conditions.map(([id, data], index) => {
          const {type, ...initialValues} = cloneObject(data as Record<string, any>);

          return (
            <React.Fragment key={id}>
              <div
                className="ml-2 pl-3"
                style={{borderLeft: '2px solid rgb(97 137 97)'}}>
                <Condition
                  type={type as ConditionName}
                  disabledCheckbox={isDisabled}
                  enabled={!isDisabled}
                  initialValues={initialValues}
                  onRemoveClick={() => condition.remove(id)}
                  onValuesChange={changedValues => {
                    condition.overwrite(id, cloneObject({type, ...changedValues}));
                  }}
                />
              </div>
              {index < conditionsCount - 1 && <hr className="mt-2 mb-2"/>}
            </React.Fragment>
          );
        })}
        <div className="mb-3"></div>
      </div>
    </div>
  );
};

const valuesToConditionAttributes = (initialValues?: scenario.Milestone) => {
  return cloneObject(initialValues?.conditions ?? []).reduce((accum, condition) => {
    accum[nanoid(10).toLowerCase()] = condition;
    return accum;
  }, {} as ConditionAttribute);
};

const createStrings = (values: scenario.Milestone, disabled: boolean = false) => {
  const strings: LangStrings = {};

  if (disabled) return strings;

  if (values?.description?.trim()) {
    strings[values.id] = values.description;
  }

  return buildStrings(strings);
};

export default Milestone;
