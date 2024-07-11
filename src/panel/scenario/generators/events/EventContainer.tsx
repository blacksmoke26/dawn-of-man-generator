/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import cn from 'classname';
import {nanoid} from 'nanoid';
import {Button, ButtonGroup, ButtonToolbar, Form, InputGroup, Tab, Tabs} from 'react-bootstrap';

// elemental components
import TabTitle from '~/components/ui/TabTitle';

// components
import Event from './Event';

// icons
import {IconClear, IconNew} from '~/components/icons/app';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {cloneObject} from '~/helpers/object';
import {EVENTS_CREATE_MAX} from '~/utils/defaults';

// parsers
import {toEventsTemplate} from '~/utils/parser/templates-event';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/scenario/reducers';

// types
import type {scenario} from '~/data/scenario/parser/types';

export type EventsState = Record<string, scenario.Event>;

interface Props {
  checked?: boolean;

  onTemplate?(template: string): void;
}

const EventContainer = (props: Props) => {
  const dispatch = useAppDispatch();

  const counter = React.useRef<{ event: number }>({event: 0});

  const [checked, setChecked] = React.useState<boolean>(props?.checked ?? true);
  const [activeKey, setActiveKey] = React.useState<string>('');

  const events = useValues<EventsState>({});

  const reduxState = useAppSelector(({scenario}) => scenario?.values?.events) as null | scenario.Events | undefined;

  // Reflect redux-specific changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(true);
      events.clear();
      setActiveKey('');
      dispatch(clearProperty('events'));
    } else if (Array.isArray(reduxState)) {
      counter.current.event = 0;
      setChecked(true);
      events.clear();
      if (reduxState.length) {
        counter.current.event = 0;
        const list = cloneObject(reduxState).reduce((accum, current) => {
          const key = 'Event_' + (++counter.current.event);
          accum[key] = current;
          return accum;
        }, {} as EventsState);

        events.setAll(list);
        setActiveKey('Event_' + 1);
      }
      dispatch(clearProperty('events'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    props?.onTemplate?.(toEventsTemplate(Object.values(events.data), !checked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, events.data]);

  /** Total tabs count */
  const eventsList = Object.entries(events.data);
  const total: number = eventsList.length;

  const removeTab = (tabId: string): void => {
    const ids = Object.keys(events.data);

    let tabIdIndex: number = ids.findIndex(id => id === tabId) || 0;

    let curValue: string = activeKey;

    if (curValue === tabId) {
      curValue = tabIdIndex === 0
        ? ids[tabIdIndex + 1]
        : ids[tabIdIndex - 1];
    }

    events.remove(tabId);
    setActiveKey(curValue);
  };

  return (
    <div className="mb-2 checkbox-align">
      <div className="pl-3 pr-3">
        <Form.Check
          className="pull-right"
          type="switch"
          id={`events-switch-${nanoid(5)}`}
          label="Allow events throughout the whole gameplay"
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
                disabled={!checked || total >= EVENTS_CREATE_MAX}
                className={cn({'cursor-disabled': !checked || total >= EVENTS_CREATE_MAX})}
                onClick={() => {
                  const uniqueId = 'Event_' + (++counter.current.event);
                  events.set(uniqueId, {});
                  setActiveKey(uniqueId);
                }}><IconNew/> New Event</Button>
              <Button
                variant="danger"
                size="sm"
                className={cn({'cursor-disabled': !checked || total < 1})}
                disabled={!checked || total < 1}
                onClick={() => {
                  events.clear();
                  counter.current.event = 0;
                }}>
                <IconClear/> Remove All
              </Button>
            </ButtonGroup>
            <InputGroup>
              <InputGroup.Text
                as="span"
                className={cn('text-size-sm border-0 pl-2 pr-2 pt-0 pb-0 bg-transparent', {
                  'text-muted text-line-through': !checked,
                })}>{!total ? <>&nbsp;</> : <>{total} / {EVENTS_CREATE_MAX}</>}
              </InputGroup.Text>
            </InputGroup>
          </ButtonToolbar>
        </div>
      </div>
      <Tabs
        id="events-tab"
        activeKey={activeKey}
        className={cn('nav-tabs-bottom mb-0', {'border-0': !total})}
        onSelect={k => setActiveKey(k as string)}>
        {eventsList.map(([id, initialValues]) => {
          return (
            <Tab
              disabled={!checked}
              eventKey={id}
              key={id}
              as="div"
              title={
                <TabTitle
                  title={id.replace('_', ' ')}
                  disabled={!checked}
                  onRemove={() => removeTab(id)}
                />
              }>
              <Event
                initialValues={initialValues}
                disabledCheckbox={!checked}
                onValuesChange={changedValues => {
                  events.overwrite(id, cloneObject(changedValues));
                }}
                disabled={!checked}
                onRemoveClick={() => removeTab(id)}/>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
};

export default EventContainer;
