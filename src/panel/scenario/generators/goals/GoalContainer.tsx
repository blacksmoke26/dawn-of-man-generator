/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-13
 */

import React from 'react';
import cn from 'classname';
import {Button, ButtonGroup, ButtonToolbar, Form, InputGroup, Tab, Tabs} from 'react-bootstrap';

// elemental components
import TabTitle from '~/components/ui/TabTitle';

// icons
import {IconClear, IconNew} from '~/components/icons/app';

// components
import Goal from './Goal';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {findNextTab} from '~/helpers/ui';
import {MILESTONES_CREATE_MAX} from '~/utils/defaults';
import {LangStrings, toLanguageString} from '~/utils/strings';

// parsers
import {cloneObject} from '~/helpers/object';
import {toGoalsTemplate} from '~/utils/parser/template-goal';

// types
import type {scenario} from '~/data/scenario/parser/types';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/scenario/reducers';

type GoalAttributes = Record<string, scenario.Goal>;
type LangAttributes = Record<string, LangStrings>;

interface Props {
  checked?: boolean;

  onTemplate?(template: string): void;

  onStrings?(text: string): void;
}

/** GoalContainer functional component */
const GoalContainer = (props: Props) => {
  const dispatch = useAppDispatch();

  const counter = React.useRef<{ count: number }>({count: 0});

  const valuer = useValues<GoalAttributes>({});
  const strings = useValues<LangAttributes>({});

  const [checked, setChecked] = React.useState<boolean>(props?.checked ?? true);
  const [activeKey, setActiveKey] = React.useState<string>('');


  const reduxState = useAppSelector(({scenario}) => scenario?.values?.goals) as null | scenario.Goal[] | undefined;

  // Reflect redux-specific changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(true);
      valuer.setAll({});
      strings.setAll({});
      setActiveKey('');
      counter.current.count = 0;
      dispatch(clearProperty('goals'));
    } else if (Array.isArray(reduxState)) {
      setChecked(true);
      const initial = createInitialValues(reduxState);
      valuer.setAll(initial.goals);
      strings.setAll(initial.strings);
      setActiveKey(initial.tabId);
      counter.current.count = initial.count;
      dispatch(clearProperty('goals'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    //setGoal((goals: GoalsState) => merge(goals, newProps.goals));
    props?.onTemplate?.(toGoalsTemplate(Object.values(valuer.data), !checked));
    props?.onStrings?.(renderStrings(Object.values(strings.data)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, valuer.data, strings.data]);

  const goalsList = Object.entries(valuer.data);
  const total: number = goalsList.length;

  return (
    <>
      <div className="mb-2 checkbox-align">
        <Form.Check
          className="pull-right"
          type="switch"
          id="goals_container_toggle"
          label="Allow goals throughout the whole scenario"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
        />
      </div>
      <div className="mb-3">
        <ButtonToolbar
          className="justify-content-between"
          aria-label="Toolbar with Button groups">
          <ButtonGroup>
            <Button
              variant="secondary" size="sm"
              disabled={!checked || total >= MILESTONES_CREATE_MAX}
              className={cn({'cursor-disabled': !checked || total >= MILESTONES_CREATE_MAX})}
              onClick={() => {
                const count = ++counter.current.count;
                const uniqueId = 'Goal_' + count;
                valuer.set(uniqueId, {id: `untitled${count}`});
                strings.set(uniqueId, {});
                setActiveKey(uniqueId);
              }}><IconNew/> New Goal</Button>
            <Button
              variant="danger"
              size="sm"
              className={cn({'cursor-disabled': !checked || total < 1})}
              disabled={!checked || total < 1}
              onClick={() => {
                valuer.setAll({});
                strings.setAll({});
                counter.current.count = 0;
              }}>
              <IconClear/> Remove All
            </Button>
          </ButtonGroup>
          <InputGroup>
            <InputGroup.Text
              as="span"
              className={cn('text-size-sm border-0 pl-2 pr-2 pt-0 pb-0 bg-transparent', {
                'text-muted text-line-through': !checked,
              })}>{!total ? <>&nbsp;</> : <>{total} / {MILESTONES_CREATE_MAX}</>}
            </InputGroup.Text>
          </InputGroup>
        </ButtonToolbar>
      </div>
      <Tabs
        id="goals-container-tab"
        activeKey={activeKey}
        className={cn('nav-tabs-bottom mb-0', {'border-0': !total})}
        onSelect={k => setActiveKey(k as string)}>
        {goalsList.map(([id, initialValues]) => (
          <Tab
            disabled={!checked} eventKey={id} key={id} as="div"
            title={
              <TabTitle
                disabled={!checked}
                title={id.replace('_', ' ')}
                onRemove={() => {
                  findNextTab(valuer.data, id, activeKey, (nextTab) => {
                    valuer.remove(id);
                    strings.remove(id);
                    setActiveKey(nextTab);
                  });
                }}/>
            }>
            <Goal
              initialValues={initialValues}
              disabledCheckbox={!checked}
              onStringsChange={values => {
                strings.overwrite(id, cloneObject(values));
              }}
              onValuesChange={changedValues => {
                valuer.overwrite(id, cloneObject(changedValues));
              }}/>
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

const createInitialValues = (goals: scenario.Goal[] = []) => {
  let index = 0;
  let tabId: string = '';

  const milestoneAttr: GoalAttributes = {};
  const stringsAttr: LangAttributes = {};

  for (const milestone of goals) {
    const key: string = `Goal_${++index}`;

    !tabId.trim() && (tabId = key);

    milestoneAttr[key] = cloneObject(milestone);
    stringsAttr[key] = {
      [milestone.id]: milestone?.description?.trim() ?? '',
    };
  }

  return {
    goals: milestoneAttr,
    strings: stringsAttr,
    count: index,
    tabId,
  };
};

const renderStrings = (strings: LangStrings[], disabled: boolean = false): string => {
  if (disabled || !strings.length) return '';

  let stringsList: LangStrings = {};

  for (const string of strings) {
    if (!Object.keys(strings).length) continue;
    stringsList = {...stringsList, ...string};
  }

  return !Object.keys(strings).length ? '' : toLanguageString(stringsList);
};

export default GoalContainer;
