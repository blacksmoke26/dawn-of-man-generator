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
import Milestone from './Milestone';

// utils
import useValues from '~/hooks/use-values';
import {MILESTONES_CREATE_MAX} from '~/utils/defaults';
import {LangStrings, toLanguageString} from '~/utils/strings';

// parsers
import {cloneObject} from '~/helpers/object';
import {toMilestonesTemplate} from '~/utils/parser/template-milestone';

// types
import {scenario} from '~/data/scenario/parser/types';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/scenario/reducers';

type MilestoneAttributes = Record<string, scenario.Milestone>;
type LangAttributes = Record<string, LangStrings>;

interface Props {
  checked?: boolean;

  onTemplate?(template: string): void;

  onStrings?(text: string): void;
}

/** MilestoneContainer functional component */
const MilestoneContainer = (props: Props) => {
  const dispatch = useAppDispatch();

  const counter = React.useRef<{ count: number }>({count: 0});

  const valuer = useValues<MilestoneAttributes>({});
  const strings = useValues<LangAttributes>({});

  const [checked, setChecked] = React.useState<boolean>(props?.checked ?? true);
  const [activeKey, setActiveKey] = React.useState<string>('');


  const reduxState = useAppSelector(({scenario}) => scenario?.values?.locations) as null | scenario.Milestone[] | undefined;

  // Reflect redux-specific changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(true);
      valuer.setAll({});
      strings.setAll({});
      setActiveKey('');
      dispatch(clearProperty('milestones'));
    } else if (Array.isArray(reduxState)) {
      setChecked(true);
      const initial = createInitialValues(reduxState);
      valuer.setAll(initial.milestones);
      strings.setAll(initial.strings);
      setActiveKey(initial.tabId);
      counter.current.count = initial.count;
      dispatch(clearProperty('milestones'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    //setMile((milestones: MilestonesState) => merge(milestones, newProps.milestones));
    props?.onTemplate?.(toMilestonesTemplate(Object.values(valuer.data), !checked));
    props?.onStrings?.(renderStrings(Object.values(strings.data)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, valuer.data, strings.data]);

  const milestonesList = Object.entries(valuer.data);
  const total: number = milestonesList.length;

  const removeTab = (tabId: string): void => {
    const ids = Object.keys(valuer.data);

    let tabIdIndex: number = ids.findIndex(id => id === tabId) || 0;

    let curValue: string = activeKey;

    if (curValue === tabId) {
      curValue = tabIdIndex === 0
        ? ids[tabIdIndex + 1]
        : ids[tabIdIndex - 1];
    }

    valuer.remove(tabId);
    strings.remove(tabId);

    setActiveKey(curValue);
  };

  return (
    <>
      <div className="mb-2 checkbox-align">
        <Form.Check
          className="pull-right"
          type="switch"
          id="milestones_container_toggle"
          label="Allow milestones throughout the whole scenario"
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
                const uniqueId = 'Mile_' + count;
                valuer.set(uniqueId, {id: `untitled${count}`});
                strings.set(uniqueId, {});
                setActiveKey(uniqueId);
              }}><IconNew/> New Milestone</Button>
            <Button
              variant="danger"
              size="sm"
              className={cn({'cursor-disabled': !checked || total < 1})}
              disabled={!checked || total < 1}
              onClick={() => {
                valuer.setAll({});
                strings.setAll({});
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
        id="milestones-container-tab"
        activeKey={activeKey}
        className={cn('nav-tabs-bottom mb-0', {'border-0': !total})}
        onSelect={k => setActiveKey(k as string)}>
        {milestonesList.map(([id, initialValues]) => (
          <Tab
            disabled={!checked} eventKey={id} key={id} as="div"
            title={
              <TabTitle
                disabled={!checked}
                title={id.replace('_', ' ')}
                onRemove={() => removeTab(id)}/>
            }>
            <Milestone
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

const createInitialValues = (milestones: scenario.Milestone[] = []) => {
  let index = 0;
  let tabId: string = '';

  const milestoneAttr: MilestoneAttributes = {};
  const stringsAttr: LangAttributes = {};

  for (const milestone of milestones) {
    const key: string = `Mile_${++index}`;

    !tabId.trim() && (tabId = key);

    milestoneAttr[key] = cloneObject(milestone);
    stringsAttr[key] = {
      [milestone.id]: milestone?.description?.trim() ?? '',
    };
  }

  return {
    milestones: milestoneAttr,
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

export default MilestoneContainer;
