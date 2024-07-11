/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import {nanoid} from 'nanoid';
import {Tab, Tabs} from 'react-bootstrap';

// elemental components
import TabTitle from '~/components/ui/TabTitle';
import Accordion from '~/components/ui/Accordion';
import Action from '~/components/scenario/generic/Action';
import Condition from '~/components/scenario/generic/Condition';

// components
import EventId from './elements/EventId';
import FlagsDropdown from './elements/FlagsDropdown';
import ActionDropdown from './elements/ActionDropdown';
import ConditionDropdown from './elements/ConditionDropdown';

// utils
import {filterEmpty} from '~/utils/template';
import {ACTIONS_CREATE_MAX} from '~/utils/defaults';
import {cloneObject, onlyKeys} from '~/helpers/object';
import {toEventTemplate} from '~/utils/parser/templates-event';
import {ActionsState, actionTypesCounter} from './utils/general';

// hooks
import useValues from '~/hooks/use-values';

// types
import type {scenario} from '~/data/scenario/parser/types';

export interface Props {
  disabled?: boolean;
  disabledCheckbox?: boolean;
  expanded?: boolean;
  initialValues?: scenario.Event;

  /** A callback triggers when condition is updated */
  onConditionChange?(condition: scenario.condition.Condition): void;

  /** A callback triggers when action is updated */
  onActionChange?(action: scenario.action.Action): void;

  /** A callback triggers when metadata values are updated */
  onValuesChange?(values: scenario.Event): void;

  /** A callback triggers when xml template is rendered */
  onTemplate?(value: string): void;

  /** A callback triggers click on remove button */
  onRemoveClick?(value: string): void;
}

type EventState = Omit<scenario.Event, 'actions'>;

/** Event functional component */
const Event = (props: Props) => {
  const [actionActiveKey, setActionActiveKey] = React.useState<string>('');
  const valuer = useValues<EventState>({} as EventState);

  const action = useValues<ActionsState>({});

  const [initiated, setInitiated] = React.useState<boolean>(false);

  React.useEffect(() => {
    valuer.setAll(onlyKeys(props?.initialValues ?? {}, ['actions'], true) as EventState);
    const initActions = normalizeActions(props?.initialValues?.actions ?? []);
    const keys = Object.keys(initActions);
    action.setAll(initActions);
    keys.length && setActionActiveKey(keys[keys.length - 1]);

    setInitiated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const meta = useValues<{
    disabled: boolean;
    disabledCheckbox: boolean;
    actionsExpanded: boolean;
  }>({
    disabled: props?.disabled ?? false,
    disabledCheckbox: props?.disabledCheckbox ?? false,
    actionsExpanded: true,
  });

  //<editor-fold desc="Reflect values changes">
  React.useEffect(() => {
    if (initiated) {
      const changedValues = filterEmpty({
        ...valuer.data,
        actions: Object.values(action.data),
      } as scenario.Event);

      props?.onValuesChange?.(changedValues);
      props?.onTemplate?.(toEventTemplate(changedValues, meta.data.disabled));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.data.disabled, valuer.data, action.data]);
  //</editor-fold>

  //<editor-fold desc="Reflect prop changes">
  React.useEffect(() => {
    meta.set('disabled', props?.disabled, true);
    meta.set('disabledCheckbox', props?.disabledCheckbox, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.disabled, props?.disabledCheckbox]);
  //</editor-fold>

  const isDisabled = meta.get<boolean>('disabledCheckbox') || meta.get<boolean>('disabled');
  const actionTypesCountMap = actionTypesCounter(action.data);

  /** Generate selection based nodes */
  const renderActions = (): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    const actions = Object.entries(action.data);

    let index = 0;

    for (const [id, actionData] of actions) {
      ++index;

      const {type, ...initialValues} = actionData;

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
                  {actionData?.type ?? ''}
                  {' '} <i className="text-grey">{index}</i>
                </>
              )} disabled={isDisabled}
              onRemove={() => removeTab(id)}/>
          }>
          <div className={cn('mt-3', {'pl-3 pr-3': type !== 'SetRaider'})}>
            <Action
              type={type as scenario.action.Name}
              showHeader={false}
              disabledCheckbox={isDisabled}
              disabled={isDisabled}
              initialValues={initialValues}
              onRemoveClick={() => {
                action.remove(id);
              }}
              onValuesChange={values => {
                const prevAction = action.get(id);
                const changedValues = cloneObject({type: prevAction.type, ...values});
                action.overwrite(id, changedValues);
                props?.onActionChange?.(changedValues);
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
  const tabsCount: number = Object.keys(action.data).length;

  const removeTab = (tabId: string): void => {
    const ids = Object.keys(action.data);

    let tabIdIndex: number = ids.findIndex(id => id === tabId) || 0;

    let curValue: string = actionActiveKey;

    if (curValue === tabId) {
      curValue = tabIdIndex === 0
        ? ids[tabIdIndex + 1]
        : ids[tabIdIndex - 1];
    }

    action.remove(tabId);
    setActionActiveKey(curValue);
  };

  return (
    <div className={cn('mt-0 checkbox-align', {'text-muted': isDisabled})}>
      <div className="pt-2 pl-3 pr-3 pb-2 mt-2 mb-1">
        <Accordion
          noBodyPad={true}
          noCard={true}
          header="Optional parameters"
          eventKey="clear_trees_optional_parameters">
          <EventId
            disabled={isDisabled}
            value={valuer.get('id', '')}
            onChange={value => valuer.set('id', value as string)}/>
          <FlagsDropdown
            value={valuer.get('flags', [])}
            disabled={isDisabled}
            onChange={(flags: string[]) => {
              valuer.overwrite('flags', flags);
            }}
          />
        </Accordion>
        <div className="mb-3"></div>

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
            initialValues={onlyKeys(valuer.get('condition'), ['type'], true)}
            onRemoveClick={() => valuer.set('condition', {})}
            onValuesChange={values => {
              const changedValues = {
                type: valuer.get('condition.type'),
                ...values,
              } as scenario.condition.Condition;
              valuer.overwrite('condition', changedValues);
              props?.onConditionChange?.(changedValues);
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
              action.set(uniqueId, {type});
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

const normalizeActions = (actions: scenario.Event['actions']): ActionsState => {
  return actions
    .reduce((accum, current) => {
      accum[nanoid(10).toLowerCase()] = current;
      return accum;
    }, {} as ActionsState);
};

export default Event;
