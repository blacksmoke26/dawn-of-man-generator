/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import {nanoid} from 'nanoid';
import {capitalCase} from 'change-case';
import {Button, ButtonGroup, ButtonToolbar, Form, InputGroup, Tab, Tabs} from 'react-bootstrap';

// components
import Location from './Location';

// icons
import {IconClear, IconNew} from '~/components/icons/app';
import {toLocationsTemplate} from '~/utils/parser/templates-location';

// utils
import * as location from '~/utils/location';
import {toLanguageString} from '~/utils/strings';
import {locationToStrings} from '~/utils/location';
import {LOCATIONS_CREATE_MAX} from '~/utils/defaults';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/scenario/reducers';

// types
import type {scenario} from '~/data/scenario/parser/types';
import {cloneObject} from '~/helpers/object';

/** LocationContainer `props` type */
interface Props {
  onTemplate(template: string): void,

  onStrings(strings: string): void,
}

/** LocationContainer functional component */
const LocationContainer = (props: Props) => {
  const dispatch = useAppDispatch();

  const initiated = useAppSelector(({config}) => config.initiated);

  const [checked, setChecked] = React.useState<boolean>(true);
  const [locations, setLocations] = React.useState<Record<string, scenario.Location>>({});
  const [activeKey, setActiveKey] = React.useState<string>('');

  const reduxState = useAppSelector(({scenario}) => scenario?.values?.locations) as null | scenario.Location[] | undefined;

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(true);
      setLocations({});
      dispatch(clearProperty('locations'));
    } else if (Array.isArray(reduxState)) {
      setChecked(true);
      const cloned = cloneObject<scenario.Location[]>(reduxState);
      setLocations(cloned.reduce((accum, item) => {
        accum[nanoid(10)] = item;
        return accum;
      }, {} as Record<string, scenario.Location>))
      dispatch(clearProperty('locations'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  React.useEffect(() => {
    if (initiated) newLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initiated]);

  /** Add new location */
  const newLocation = React.useCallback(() => {
    const randLocation = location.randomizeLocation([], ['position']);
    const uid = nanoid(10).toLowerCase();
    setLocations(current => ({...current, [uid]: randLocation}));
    setActiveKey(uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Remove location */
  const removeLocation = React.useCallback((tabId: string): void => {
    const ids = Object.keys(locations);

    const newLocations = {...locations};

    let tabIdIndex: number = ids.findIndex(id => id === tabId) || 0;

    let curValue: string = activeKey;

    if (curValue === tabId) {
      curValue = tabIdIndex === 0
        ? ids[tabIdIndex + 1]
        : ids[tabIdIndex - 1];
    }

    delete newLocations[tabId];

    setLocations(newLocations);

    setActiveKey(curValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, activeKey]);

  // Reflect state changes
  React.useEffect(() => {
    const nodes = Object.values(locations);

    typeof props.onTemplate === 'function'
    && props.onTemplate(toLocationsTemplate(nodes, !checked));

    typeof props.onStrings === 'function'
    && props.onStrings(toLanguageString(locationToStrings(nodes, !checked)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, checked]);

  /** Total locations count */
  const total: number = Object.keys(locations).length;

  return (
    <>
      <div className="pl-3">
        <div className="mt-2 mb-2 checkbox-align">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`locations_override-switch-${nanoid(5)}`}
            label="Enable locations"
            checked={checked}
            onChange={e => setChecked(e.target.checked)}
          />
        </div>
        <div className="pb-3">
          <ButtonToolbar
            className="justify-content-between"
            aria-label="Toolbar with Button groups">
            <ButtonGroup>
              <Button
                variant="secondary" size="sm"
                disabled={!checked || total >= LOCATIONS_CREATE_MAX}
                onClick={() => newLocation()}>
                <IconNew/> New Location
              </Button>
              <Button variant="danger" size="sm" disabled={!checked} onClick={() => {
                setLocations({});
              }}><IconClear/> Remove All</Button>
            </ButtonGroup>
            <InputGroup>
              <InputGroup.Text
                as="span"
                className={cn('text-size-sm border-0 pl-2 pr-4 pt-0 pb-0 bg-transparent', {
                  'text-muted text-line-through': !checked,
                })}>{!total ? <></> : <>{total} / {LOCATIONS_CREATE_MAX}</>}
              </InputGroup.Text>
            </InputGroup>
          </ButtonToolbar>
        </div>
      </div>
      {!Boolean(total) ? (
        <div className="mb-2"></div>
      ) : (
        <Tabs
          activeKey={activeKey} id="locations-tab"
          className="nav-tabs-bottom"
          onSelect={k => setActiveKey(k as string)}>
          {Object.entries(locations).map(([id, location], i: number) => (
            <Tab
              disabled={!checked}
              eventKey={id}
              key={id} as="div" className="mb-3"
              title={
                <>
                 <span className={cn('text-size-sm pr-2', {
                   'text-muted text-line-through': !checked,
                 })}>{capitalCase(location.id)}</span>
                  <a aria-disabled={!checked} hidden={i === 0}
                     href="#tab-close"
                     className="text-color-default text-decoration-none p-0"
                     style={{
                       lineHeight: '10px',
                       position: 'relative',
                       top: '-2px',
                     }} onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeLocation(id);
                  }}>&times;</a>
                </>
              }>
              <div style={{marginTop: '1rem'}} className="pl-3 pr-3">
                <Location
                  disabled={!checked}
                  initialValues={location}
                  onValuesChange={updated => {
                    setLocations(current => ({...current, [id]: {...updated}}));
                  }}/>
              </div>
            </Tab>
          ))}
        </Tabs>
      )}
    </>
  );
};

// Properties validation
LocationContainer.propTypes = {
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default LocationContainer;
