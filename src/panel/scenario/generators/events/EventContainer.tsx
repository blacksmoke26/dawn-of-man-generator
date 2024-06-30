/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
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
import {findNextTabKey} from '~/helpers/ui';
import {EVENTS_CREATE_MAX} from '~/utils/defaults';

// parsers
import {toEventsTemplate} from '~/utils/parser/templates-event';

// types
import type {Required} from 'utility-types';
import type {KVDocument} from '~/types/json.types';

export type EventsState = KVDocument<{
  template: string;
  disabled: boolean;
}>

interface Props {
  checked?: boolean;

  onTemplate?(template: string): void;
}

const listTemplates = (events: EventsState): string[] => {
  return Object
    .values(events)
    .filter(attr => !attr.disabled && attr.template.trim())
    .map((attr => attr.template));
};

const EventContainer = (props: Props) => {
  const newProps = merge<Required<Props>>({
    checked: false,
    onTemplate() {
    },
  }, props);

  const counter = React.useRef<{ event: number }>({event: 0});

  const [checked, setChecked] = React.useState<boolean>(newProps.checked);
  const [activeKey, setActiveKey] = React.useState<string>('');

  const events = useValues<EventsState>({});

  // Reflect state changes
  React.useEffect(() => {
    newProps.onTemplate(!checked ? '' : toEventsTemplate(listTemplates(events.data)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, events.data]);

  /** Total tabs count */
  const total: number = Object.keys(events.data).length;

  const removeTab = (tabId: string): void => {
    setActiveKey(findNextTabKey(Object.keys(events.data), activeKey, tabId));
    events.remove(tabId);
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
                  events.set(uniqueId, {
                    template: '', abled: false,
                  });
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
        {Object.entries(events.data).map(([id, event]) => (
          <Tab
            disabled={!checked}
            eventKey={id}
            key={id}
            as="div"
            title={
              <TabTitle
                title={id.replace('_', ' ')}
                disabled={event.disabled}
                onRemove={() => removeTab(id)}
              />
            }>
            <Event
              disabledCheckbox={!checked}
              onTemplate={(template: string) => {
                events.set(`${id}.template`, template);
              }}
              disabled={!checked}
              onRemoveClick={() => events.remove(id)}/>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default EventContainer;
