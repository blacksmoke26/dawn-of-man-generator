/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Button, ButtonGroup, ButtonToolbar, Form, InputGroup, Tab, Tabs} from 'react-bootstrap';

// utils
import {LOCATIONS_CREATE_MAX} from '~/utils/defaults';

// types
import type {Json} from '~/types/json.types';
import type {LocationProps} from '~/utils/location';

// utils
import * as location from '~/utils/location';

// components
import Location from './Location';

// redux
import {useAppSelector} from '~redux/hooks';

// icons
import {IconClear, IconNew} from '~/components/icons/app';

/** Tab contents wrapper */
const TabContentWrapper = (props: Json) => {
  return (
    <div style={{marginTop: '1rem'}} className="pl-3 pr-3">
      {props.children}
    </div>
  );
};

/** LocationContainer `props` type */
interface Props {
  enabled?: boolean,

  onChange(template: string, list: Array<LocationProps>): void,
}

/** LocationContainer functional component */
const LocationContainer = (props: Props) => {
  props = merge({
    enabled: true,
    onChange: () => {
    },
  }, props);

  const initiated = useAppSelector(({config}) => config.initiated);

  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);
  const [locations, setLocations] = React.useState<LocationProps[]>([]);
  const [activeKey, setActiveKey] = React.useState<string>('');

  React.useEffect(() => {
    if (initiated) {
      newLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initiated]);

  /** Add new location */
  const newLocation = React.useCallback((): void => {
    const randLocation: LocationProps = location.randomizeLocation();
    setLocations((current: Array<LocationProps>) => ([
      ...current,
      randLocation,
    ]));
    setActiveKey(randLocation._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Remove location */
  const removeLocation = React.useCallback((tabId: string): void => {
    if (locations.length === 1) {
      return;
    }

    let tabIdIndex: number = 0;

    const tabs: Array<LocationProps> = locations.filter((tab: LocationProps, index: number) => {
      tab._id === tabId && (tabIdIndex = index);
      return tab._id !== tabId;
    });

    let curValue: string = activeKey;

    if (curValue === tabId) {
      curValue = tabIdIndex === 0
        ? locations[tabIdIndex + 1]._id
        : locations[tabIdIndex - 1]._id;
    }

    setLocations(tabs);
    setActiveKey(curValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, activeKey]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), locations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, enabled]);

  /** Generate xml code */
  const toTemplateText = (): string => {
    return enabled
      ? `<locations>${locations.map(n => location.nodeToTemplate(n)).join('')}</locations>`
      : '';
  };

  /** Total locations count */
  const total: number = locations.length;

  return (
    <>
      <div className="pl-3">
        <div className="mt-2 mb-2 checkbox-align">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`locations_override-switch-${nanoid(5)}`}
            label="Enable locations"
            checked={enabled}
            onChange={e => setEnabled(e.target.checked)}
          />
        </div>
        <div className="mb-3">
          <ButtonToolbar
            className="justify-content-between"
            aria-label="Toolbar with Button groups">
            <ButtonGroup>
              <Button
                variant="secondary" size="sm"
                disabled={!enabled || total >= LOCATIONS_CREATE_MAX}
                onClick={() => newLocation()}>
                <IconNew/> New Location
              </Button>
              <Button variant="danger" size="sm" disabled={!enabled || total <= 1} onClick={() => {
                setLocations([]);
                newLocation();
              }}><IconClear/> Remove All</Button>
            </ButtonGroup>
            <InputGroup>
              <InputGroup.Text
                as="span"
                className={cn('text-size-sm border-0 pl-2 pr-4 pt-0 pb-0 bg-transparent', {
                  'text-muted text-line-through': !enabled,
                })}>{!total ? <>&nbsp;</> : <>{total} / {LOCATIONS_CREATE_MAX}</>}
              </InputGroup.Text>
            </InputGroup>
          </ButtonToolbar>
        </div>
      </div>
      <Tabs activeKey={activeKey} id="locations-tab"
            className="nav-tabs-bottom" onSelect={k => setActiveKey(k as string)}>
        {locations.map((location, i: number) => (
          <Tab disabled={!enabled} eventKey={location._id} key={location._id} as="div" className="mb-3"
               title={
                 <>
                   <span className={cn('text-size-sm pr-2', {
                     'text-muted text-line-through': !enabled,
                   })}>{location.name}</span>
                   <a aria-disabled={!enabled} hidden={i === 0}
                      href="#tab-close"
                      className="text-color-default text-decoration-none p-0"
                      style={{
                        lineHeight: '10px',
                        position: 'relative',
                        top: '-2px',
                      }} onClick={e => {
                     e.preventDefault();
                     e.stopPropagation();
                     removeLocation(location._id);
                   }}>&times;</a>
                 </>
               }>
            <TabContentWrapper>
              <Location enabled={enabled} values={location} onChange={updated => {
                setLocations(current => {
                  const list: Array<LocationProps> = [...current];
                  const index: number = list.findIndex(loc => loc._id === updated._id);
                  list[index] = updated;
                  return list;
                });
              }}/>
            </TabContentWrapper>
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

// Properties validation
LocationContainer.propTypes = {
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default LocationContainer;
