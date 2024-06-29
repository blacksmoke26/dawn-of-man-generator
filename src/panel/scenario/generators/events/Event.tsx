/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Tab, Tabs} from 'react-bootstrap';

// elemental components
import TabTitle from '~/components/ui/TabTitle';
import Action from '~/components/scenario/generic/Action';
import Condition from '~/components/scenario/generic/Condition';

// components
import FlagsDropdown from './elements/FlagsDropdown';
import ActionDropdown from './elements/ActionDropdown';
import ConditionDropdown from './elements/ConditionDropdown';

// utils
import {onlyKeys} from '~/helpers/object';
import {findNextTabKey} from '~/helpers/ui';
import {filterEmpty} from '~/utils/template';
import {ACTIONS_CREATE_MAX} from '~/utils/defaults';
import {toEventTemplate} from '~/utils/parser/templates-event';
import {actionTypesCounter, defaultValues} from './utils/general';

// hooks
import useValues from '~/hooks/use-values';

// types
import type {Required} from 'utility-types';
import type {Event as EventType} from '~/types/event.types';
import type {AnyCondition} from '~/types/condition.types';
import type {ActionName, AnyAction} from '~/types/action.types';

export interface Props {
  disabled?: boolean;
  disabledCheckbox?: boolean;
  expanded?: boolean;
  initialValues?: EventType;

  /** A callback triggers when condition is updated */
  onConditionChange?(condition: AnyCondition): void;

  /** A callback triggers when action is updated */
  onActionChange?(action: AnyAction): void;

  /** A callback triggers when metadata values are updated */
  onValuesChange?(values: Partial<EventType>): void;

  /** A callback triggers when xml template is rendered */
  onTemplate?(value: string): void;

  /** A callback triggers click on remove button */
  onRemoveClick?(value: string): void;
}

export interface EventState extends Omit<EventType, 'actions'> {
  actions: Record<string, AnyAction>;
}

export const changedValuesToEventValues = (data: EventState): EventType => {
  const {flags, condition, actions} = data;

  return {
    flags,
    condition,
    actions: Object.values(actions),
  };
};

/** Event functional component */
const Event = (props: Props) => {
  const newProps = merge<Required<Props>>(defaultValues as Props, props);

  const [actionActiveKey, setActionActiveKey] = React.useState<string>('');

  const valuer = useValues<EventState>(merge({
    flags: [],
    condition: {} as AnyCondition,
    actions: {},
  }, (props?.initialValues || {}) as EventState));

  const meta = useValues<{
    disabled: boolean;
    disabledCheckbox: boolean;
    actionsExpanded: boolean;
    flagsExpanded: boolean;
  }>({
    disabled: newProps.disabled,
    disabledCheckbox: newProps.disabledCheckbox,
    actionsExpanded: true,
    flagsExpanded: false,
  });

  //<editor-fold desc="Reflect values changes">
  React.useEffect(() => {
    const changedValues = filterEmpty(changedValuesToEventValues(valuer.data));

    newProps.onValuesChange(changedValues);
    newProps.onTemplate(toEventTemplate(changedValues, meta.data.disabled));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.data.disabled, valuer.data]);
  //</editor-fold>

  //<editor-fold desc="Reflect prop changes">
  React.useEffect(() => {
    meta.set('disabled', props?.disabled, true);
    meta.set('disabledCheckbox', props?.disabledCheckbox, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.disabled, props?.disabledCheckbox]);
  //</editor-fold>

  const isDisabled = meta.get<boolean>('disabledCheckbox') || meta.get<boolean>('disabled');
  const conditionInitialValues = (props?.initialValues?.condition || {}) as AnyCondition;
  const actionTypesCountMap = actionTypesCounter(valuer.get<EventState['actions']>('actions', {}));

  /** Generate selection based nodes */
  const renderActions = (): React.ReactElement[] => {
    const elements: React.ReactElement[] = [];
    const actions = Object.entries(valuer?.data?.actions || {});

    let index = 0;

    for (const [id, action] of actions) {
      ++index;

      const {type, ...initialValues} = action || {};

      elements.push(
        <Tab
          disabled={isDisabled}
          eventKey={id}
          key={id}
          as="div"
          active={actionActiveKey === id}
          title={
            <TabTitle
              className="text-size-xs"
              title={(
                <>
                  {action?.type ?? ''}
                  {' '} <i className="text-grey">[{index}]</i>
                </>
              )} disabled={isDisabled}
              onRemove={() => removeTab(id)}/>
          }>
          <div className={cn('mt-3', {'pl-3 pr-3': type !== 'SetRaider'})}>
            <Action
              type={type as ActionName}
              showHeader={false}
              disabledCheckbox={isDisabled}
              disabled={isDisabled}
              initialValues={initialValues}
              onRemoveClick={() => {
                valuer.remove(`actions.${id}`);
              }}
              onValuesChange={values => {
                const changedValues = {
                  type: valuer.get(`actions.${id}.type`),
                  ...values,
                } as AnyAction;

                valuer.overwrite(`actions.${id}`, changedValues);
                newProps.onActionChange(changedValues);
              }}
            />
          </div>
        </Tab>,
      );
    }

    return elements;
  };

  const hasCondition = valuer.hasPath('condition.type');

  /** Total tabs count */
  const tabsCount: number = Object.keys(valuer?.data?.actions || {}).length;

  const removeTab = (tabId: string): void => {
    setActionActiveKey(findNextTabKey(Object.keys(valuer?.data?.actions || {}), actionActiveKey, tabId));
    valuer.remove(`actions.${tabId}`);
  };

  return (
    <div className={cn('mt-0 checkbox-align', {'text-muted': isDisabled})}>
      <div className="pt-2 pl-3 pr-3 pb-2 mt-2 mb-1">
        <FlagsDropdown
          expanded={meta.data.flagsExpanded}
          onCaptionClick={() => {
            meta.set('flagsExpanded', current => !current);
          }}
          value={valuer.get('flags', [])}
          disabled={isDisabled}
          onChange={(flags: string[]) => {
            valuer.overwrite('flags', flags);
          }}
        />

        {!hasCondition && (
          <ConditionDropdown
            disabled={hasCondition || isDisabled}
            onChange={(condition => {
              valuer.set('condition', condition);
            })}
          />
        )}

        {hasCondition && (
          <Condition
            type={valuer.get('condition').type}
            disabledCheckbox={isDisabled}
            enabled={!isDisabled}
            initialValues={onlyKeys(conditionInitialValues, ['type'], true)}
            onRemoveClick={() => valuer.set('condition', {})}
            onValuesChange={values => {
              const changedValues = {
                type: valuer.get('condition.type'),
                ...values,
              } as AnyCondition;
              valuer.overwrite('condition', changedValues);
              newProps.onConditionChange(changedValues);
            }}
          />
        )}

        <div className={cn({'mt-3': hasCondition})}>
          <ActionDropdown
            expanded={meta.data.actionsExpanded}
            onCaptionClick={() => {
              meta.set('actionsExpanded', current => !current);
            }}
            onRemoveClick={() => valuer.empty('actions')}
            countMap={actionTypesCountMap}
            disabled={isDisabled || tabsCount >= ACTIONS_CREATE_MAX}
            caption="Actions"
            onChange={type => {
              meta.set('actionsExpanded', true);
              const uniqueId = nanoid(10).toLowerCase();
              valuer.set(`actions.${uniqueId}`, {type});
              setActionActiveKey(uniqueId);
            }}/>
        </div>
      </div>
      {meta.data.actionsExpanded && (
        <Tabs
          id="actions-tab"
          navbar
          activeKey={actionActiveKey}
          className={cn('nav-tabs-bottom mb-0', {'border-0': !tabsCount})}
          onSelect={k => setActionActiveKey(k as string)}>
          {renderActions()}
        </Tabs>
      )}
      <div className="mb-2"></div>
    </div>
  );
};

// Properties validation
Event.propTypes = {
  disabledCheckbox: PropTypes.bool,
  disabled: PropTypes.bool,
  expanded: PropTypes.bool,
  initialValues: PropTypes.object,
  onConditionChange: PropTypes.func,
  onActionChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
  onRemoveClick: PropTypes.func,
};

export default Event;
