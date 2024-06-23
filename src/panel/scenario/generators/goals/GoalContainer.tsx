/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Button, ButtonGroup, ButtonToolbar, Form, InputGroup, Tab, Tabs} from 'react-bootstrap';
import type {Required} from 'utility-types';
import useValues from '~/hooks/use-values';
import cn from 'classname';
import {IconClear, IconNew} from '~/components/icons/app';
import {toLanguageString} from '~/utils/strings';
import {capitalCase} from 'change-case';
import TabTitle from '~/components/ui/TabTitle';
import Goal from '~/panel/scenario/generators/goals/Goal';
import {findNextTabKey} from '~/helpers/ui';

/** Maximum limit of tabs */
const MAX_COUNT: number = 20;

export interface GoalsState {
  [key: string]: {
    template: string;
    strings: string;
    name: string;
    disabled: boolean;
  };
}

interface Props {
  checked?: boolean;

  onTemplate?(template: string): void;

  onStrings?(text: string): void;
}

const toTemplateText = (goals: GoalsState): string => {
  const template = Object
    .values(goals)
    .filter(attr => !attr.disabled)
    .map((attr => attr.template)).join('').trim();

  return !template ? '' : (
    `<goals>`
    + Object.values(goals).map((attr => attr.template)).join('')
    + '</goals>'
  );
};

const toStringsText = (goals: GoalsState): string => {
  return Object.values(goals)
    .filter(attr => !attr.disabled)
    .map((attr => attr.strings)).join('').trim();
};

const GoalContainer = (props: Props) => {
  const newProps = merge<Required<Props>>({
    checked: false,
    onTemplate() {
    },
    onStrings() {
    },
  }, props);

  const [checked, setChecked] = React.useState<boolean>(newProps.checked);
  const [activeKey, setActiveKey] = React.useState<string>('');

  const goals = useValues<GoalsState>({});
  const allGoals = goals.getAll();

  // Reflect state changes
  React.useEffect(() => {
    //setMile((milestones: MilestonesState) => merge(milestones, newProps.milestones));
    newProps.onTemplate(!checked ? '' : toTemplateText(allGoals));
    newProps.onStrings(!checked ? '' : toStringsText(allGoals));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, allGoals]);

  /** Total tabs count */
  const total: number = Object.keys(allGoals).length;

  const removeTab = (tabId: string): void => {
    setActiveKey(findNextTabKey(Object.keys(allGoals), activeKey, tabId));
    goals.remove(tabId);
  };

  return (
    <>
      <div className="mb-2 checkbox-align">
        <Form.Check
          className="pull-right"
          type="switch"
          id={`goals-switch-${nanoid(5)}`}
          label="Allow goals throughout the whole gameplay"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
        />
        <div className="mb-3">
          <ButtonToolbar
            className="justify-content-between"
            aria-label="Toolbar with Button groups">
            <ButtonGroup>
              <Button
                variant="secondary" size="sm"
                disabled={!checked || total >= MAX_COUNT}
                className={cn({'cursor-disabled': !checked || total >= MAX_COUNT})}
                onClick={() => {
                  const uniqueId = nanoid(10).toLowerCase();
                  goals.set(uniqueId, {
                    template: '', strings: '', name: 'Untitled', disabled: false,
                  });
                  setActiveKey(uniqueId);
                }}><IconNew/> New Goal</Button>
              <Button
                variant="danger"
                size="sm"
                className={cn({'cursor-disabled': !checked || total < 1})}
                disabled={!checked || total < 1}
                onClick={() => goals.clear()}>
                <IconClear/> Remove All
              </Button>
            </ButtonGroup>
            <InputGroup>
              <InputGroup.Text
                className={cn('border-0 pl-2 pr-2', {
                  'text-muted text-line-through': !checked || total < 1,
                })}>Total: {total}</InputGroup.Text>
            </InputGroup>
          </ButtonToolbar>
        </div>
        <Tabs
          id="goals-tab"
          activeKey={activeKey}
          className={cn('nav-tabs-bottom mb-0', {'border-0': !total})}
          onSelect={k => setActiveKey(k as string)}>
          {Object.entries(goals.getAll()).map(([id, goal]) => {
            // noinspection HtmlUnknownAnchorTarget
            return (
              <Tab
                disabled={!checked}
                eventKey={id}
                key={id}
                as="div"
                title={
                  <TabTitle
                    title={goal?.name?.trim() || 'Untitled'} disabled={goal.disabled}
                    onRemove={() => removeTab(id)}/>
                }>
                <Goal
                  disabledCheckbox={!checked}
                  onTemplate={(template: string) => {
                    goals.set(`${id}.template`, template);
                  }}
                  onStringsChange={strings => {
                    goals.set(`${id}.strings`, toLanguageString(strings));
                  }}
                  onValuesChange={changedValues => {
                    const _name = capitalCase(changedValues?.id?.trim() || '').substring(0, 15);
                    goals.set(`${id}.disabled`, !Boolean(_name));
                    goals.set(`${id}.name`, value => _name || value);

                  }}
                  onRemoveClick={() => goals.remove(id)}/>
              </Tab>
            );
          })}
        </Tabs>
      </div>
    </>
  );
};

export default GoalContainer;
