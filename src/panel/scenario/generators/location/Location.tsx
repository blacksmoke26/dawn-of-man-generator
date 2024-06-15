/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import slugify from 'slugify';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {capitalCase} from 'change-case';
import {Button, ButtonGroup, Col, Form, InputGroup, Row} from 'react-bootstrap';

// components
import Slider from '~/components/ui/Slider';
import {labels} from '~/data/environments/builtin';

// icons
import {IconRestore, IconShuffle} from '~/components/icons/app';

// utils
import * as location from '~/utils/location';
import {POSITION_MAX, POSITION_MIN} from '~/utils/defaults';

// redux
import {useAppSelector} from '~redux/hooks';

// types
import type {Json} from '~/types/json.types';
import type {LocationProps} from '~/utils/location';

export interface Props {
  enabled?: boolean,
  values?: LocationProps,

  onChange(location: LocationProps): void,
}

/** Location functional component */
const Location = (props: Props) => {
  props = merge({
    enabled: true,
    values: location.randomizeLocation(),
    onChange: () => {
    },
  }, props);

  const {fileName} = useAppSelector(state => ({
    fileName: state.fileName,
  }));

  const [values, setValues] = React.useState<LocationProps>(props.values as LocationProps);
  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);
  const [positionEnabled, setPositionEnabled] = React.useState<boolean>(false);
  const [lakeEnabled, setLakeEnabled] = React.useState<boolean>(true);
  const [riverEnabled, setRiverEnabled] = React.useState<boolean>(true);

  const isPositionEnabled = enabled && positionEnabled;
  const isLakeEnabled = enabled && lakeEnabled;
  const isRiverEnabled = enabled && riverEnabled;

  // Reflect props changes
  React.useEffect(() => {
    setEnabled(props.enabled as boolean);
  }, [props.enabled]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange({
      ...values,
      positionEnabled: isPositionEnabled,
      lakesEnabled: isLakeEnabled,
      riverEnabled: isRiverEnabled,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, isPositionEnabled, isLakeEnabled, isRiverEnabled]);

  /** Update given value by name */
  const updateValue = (name: string, value: any): void => {
    setValues(current => ({
      ...current,
      [name]: value,
    }));
  };

  /** Update coordinate */
  const updateCoordinate = (north: number | null = null, south: number | null = null): void => {
    const [n, s] = values.coordinates;
    updateValue('coordinates', [north ?? n, south ?? s]);
  };

  /** Update position */
  const updatePosition = (north: number | null = null, south: number | null = null): void => {
    const [n, s] = values.position as number[];
    updateValue('position', [north ?? n, south ?? s]);
  };

  const environments = [...labels, {
    label: capitalCase(fileName),
    value: fileName,
    desc: 'Custom tailored environment for the free play scenario',
  }];

  return (
    <>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label className="text-size-sm" column={true} sm="2">Name</Form.Label>
        <Col sm="10">
          <InputGroup>
            <Form.Control
              disabled={!enabled}
              value={values.slug} size="sm" className="d-inline-block position-relative"
              maxLength={22} style={{maxWidth: 280}} onChange={e => {
              const slug: string = slugify(e.target.value, {
                replacement: '_', lower: true, strict: true,
              });

              const name: string = slug
                .split('_')
                .map(v => `${v.charAt(0).toUpperCase()}${v.slice(1)}`)
                .join(' ');

              updateValue('slug', slug);
              updateValue('name', name);
            }}/>
            <Button disabled={!enabled} variant="secondary" className="mt-xs-1" size="sm"
                    onClick={() => {
                      const {name, slug} = location.randomName();
                      updateValue('name', name);
                      updateValue('slug', slug);
                    }} title="Randomize"><IconShuffle/></Button>
          </InputGroup>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label className="text-size-sm" style={{textDecoration: 'underline dotted'}}
                    title="Used to create a map" column={true} sm="2">Seed</Form.Label>
        <Col sm="10">
          <InputGroup>
            <Form.Control
              disabled={!enabled}
              value={values.seed} size="sm" className="d-inline-block position-relative"
              maxLength={9} style={{maxWidth: 140}} onChange={e => {
              if (e.target.value === '' || /^[0-9\b]+$/.test(e.target.value)) {
                updateValue('seed', e.target.value);
              }
            }}/>
            {' '}
            <Button disabled={!enabled} variant="secondary" size="sm"
                    onClick={() => updateValue('seed', location.randomSeed())} title="Randomize"><IconShuffle/></Button>
            <Button disabled={!enabled} variant="secondary" size="sm"
                    onClick={() => updateValue('seed', '11111111')} title="Set all as 1">1x8</Button>
            <Button disabled={!enabled} variant="secondary" size="sm" title="Set all as 0"
                    onClick={() => updateValue('seed', '00000000')}>0x8</Button>
          </InputGroup>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label className="text-size-sm" column={true} sm="2"
                    style={{textDecoration: 'underline dotted'}}
                    title="Reference to environment, custom environmnts must be placed in subfolder rootOtScenarioFile/Environments"
        >Environment</Form.Label>
        <Col sm="10">
          <InputGroup>
            <Form.Control
              disabled={!enabled}
              value={values.environment} size="sm"
              className="d-inline-block position-relative"
              maxLength={40} style={{maxWidth: 300}} onChange={e => {
              updateValue('environment', slugify(e.target.value, '_'));
            }}/>
            <Button disabled={!enabled} variant="secondary" size="sm" title="Randomize"
                    onClick={() => {
                      updateValue('environment', location.randomEnvironment([fileName]));
                    }}><IconShuffle/></Button>
          </InputGroup>
          <ul className="list-unstyled list-inline mb-0 mt-1">
            {environments.map((v: Json) => (
              <li className="list-inline-item text-size-xxs" key={`environment_key_${v.value}`}>
                {enabled ? (
                  <a href="/" title={v.desc} data-value={v.value} onClick={e => {
                    e.preventDefault();
                    // @ts-ignore
                    updateValue('environment', e.target.getAttribute('data-value'));
                  }}>{v.label}</a>
                ) : (
                  <span className="text-muted cursor-default">{v.label}</span>
                )}
              </li>
            ))}
          </ul>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label className="text-size-sm" column={true} sm="2"
                    style={{textDecoration: 'underline dotted'}}
                    title="Only affects the marker position on the minimap! this is not the starting position of the settlement see position for that">
          Coordinates
        </Form.Label>
        <Col sm="10">
          <div className="mb-2 text-size-xs">
            North: <code className={cn('text-size-xs', {'text-muted': !enabled})}>{values.coordinates[0]}</code>
            <Button disabled={!enabled} className="button-reset-sm" variant="link"
                    onClick={() => updateCoordinate(location.randomCoordinate())}>Random</Button>
            <Button disabled={!enabled} className="button-reset-sm" variant="link"
                    onClick={() => updateCoordinate(0)}>Reset</Button>
            <Slider disabled={!enabled} step={0.01}
                    value={values.coordinates[0]}
                    onChange={v => updateCoordinate(Number(v), null)}/>
          </div>
          <div className="mb-2 text-size-xs">
            South: <code className={cn('text-size-xs', {'text-muted': !enabled})}>{values.coordinates[1]}</code>
            <Button disabled={!enabled} className="button-reset-sm" variant="link"
                    onClick={() => updateCoordinate(null, location.randomCoordinate())}>Random</Button>
            <Button disabled={!enabled} className="button-reset-sm" variant="link"
                    onClick={() => updateCoordinate(null, 0)}>Reset</Button>
            <Slider disabled={!enabled} step={0.01}
                    value={values.coordinates[1]}
                    onChange={v => updateCoordinate(null, Number(v))}/>
          </div>
          <div className="mt-2">
            <ButtonGroup aria-label="Basic example">
              <Button disabled={!enabled} variant="secondary" size="sm"
                      onClick={() => updateValue('coordinates', location.randomCoordinates())}><IconShuffle/> Randomize</Button>
            </ButtonGroup>
          </div>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !positionEnabled}, 'checkbox-align')}>
        <Form.Label className="text-size-sm" column={true} sm="2">
          <Form.Check
            type="switch"
            disabled={!enabled}
            id="position-enabled"
            label=""
            className="d-inline p-relative"
            style={{top: 4}}
            checked={positionEnabled}
            onChange={e => setPositionEnabled(e.target.checked)}
          /><span
          style={{textDecoration: 'underline dotted'}}
          title="Sets the starting position of the settlement, possible range is (0, <size>*512-1)">Position</span>
        </Form.Label>
        <Col sm="10" className={cn('mb-2 text-size-xs', {'text-muted': !isPositionEnabled})}>
          <div className="mb-2 text-size-xs">
            North: <code
            className={cn('text-size-xs', {'text-muted': !isPositionEnabled})}>{values.position?.[0] as number}</code>
            <Button disabled={!isPositionEnabled} className="button-reset-sm" variant="link"
                    onClick={() => updatePosition(location.randomPosition()[0], null)}>Random</Button>
            <Button disabled={!isPositionEnabled} className="button-reset-sm" variant="link"
                    onClick={() => updatePosition(0)}>Reset</Button>
            <Slider disabled={!isPositionEnabled} step={0} min={POSITION_MIN} max={POSITION_MAX}
                    value={values.position?.[0] ?? 0}
                    onChange={v => updatePosition(Number(v))}/>
          </div>
          <div>
            South: <code
            className={cn('text-size-xs', {'text-muted': !isPositionEnabled})}>{values.position?.[1] as number}</code>
            <Button disabled={!isPositionEnabled} className="button-reset-sm" variant="link"
                    onClick={() => updatePosition(null, location.randomPosition()[1])}>Random</Button>
            <Button disabled={!isPositionEnabled} className="button-reset-sm" variant="link"
                    onClick={() => updatePosition(null, 0)}>Reset</Button>
            <Slider disabled={!isPositionEnabled} step={0}
                    value={values.position?.[1] ?? 0} min={POSITION_MIN} max={POSITION_MAX}
                    onChange={v => updatePosition(null, Number(v))}/>
          </div>
          <div className="mt-2">
            <ButtonGroup aria-label="Basic example">
              <Button disabled={!isPositionEnabled} variant="secondary" size="sm"
                      onClick={() => updateValue('position', location.randomPosition())}><IconShuffle/> Randomize</Button>
            </ButtonGroup>
          </div>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !isRiverEnabled}, 'checkbox-align')}>
        <Form.Label className="text-size-sm" column={true} sm="2">
          <Form.Check
            type="switch"
            disabled={!enabled}
            id={`river-switch-${nanoid(5)}`}
            label=""
            style={{top: 4}}
            className="d-inline p-relative"
            checked={riverEnabled}
            onChange={e => setRiverEnabled(e.target.checked)}
          /><span
          style={{textDecoration: 'underline dotted'}}
          title="Determines if rivers are created">River</span>
        </Form.Label>

        <Col sm="10">
          <Form.Check
            disabled={!riverEnabled}
            style={{top: 9}}
            className="position-relative"
            type="switch"
            id={`river-switch-${nanoid(5)}`}
            label="Display river on map?"
            checked={values.river}
            onChange={e => updateValue('river', e.target.checked)}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !isLakeEnabled}, 'checkbox-align')}>
        <Form.Label className="text-size-sm" column={true} sm="2">
          <Form.Check
            type="switch"
            disabled={!enabled}
            id={`lakes-switch-${nanoid(5)}`}
            label=""
            style={{top: 4}}
            className="d-inline p-relative"
            checked={lakeEnabled}
            onChange={e => setLakeEnabled(e.target.checked)}
          /><span
          style={{textDecoration: 'underline dotted'}}
          title="Number of lakes, no influence on size, lakes might intersect">Lakes</span>
        </Form.Label>
        <Col sm="10">
          <InputGroup>
            <Form.Control
              disabled={!lakeEnabled}
              value={values.lakes} size="sm" className="d-inline-block position-relative"
              maxLength={1} style={{maxWidth: 60}} onChange={e => {
              updateValue('lakes', Number(e.target.value));
            }} onKeyUp={e => {
              // @ts-ignore
              e.target.value = Number(String(e.target.value).replace(/\D+/, '')) || 0;
            }}/>
            <Button disabled={!lakeEnabled} variant="secondary" size="sm" title="Randomize"
                    onClick={() => {
                      updateValue('lakes', location.randomLakes());
                    }}><IconShuffle/></Button>
            <Button disabled={!lakeEnabled} variant="secondary" size="sm" title="Clear / None"
                    onClick={() => updateValue('lakes', 0)}><IconRestore/></Button>
          </InputGroup>
        </Col>
      </Form.Group>
      <hr/>
      <div className="mt-2">
        <ButtonGroup>
          <Button disabled={!enabled} variant="secondary" size="sm"
                  onClick={() => {
                    const randLocation = location.randomizeLocation([fileName]);
                    randLocation._id = values._id;
                    !isLakeEnabled && (randLocation.lakes = values.lakes);
                    !isRiverEnabled && (randLocation.river = values.river);
                    !isPositionEnabled && (randLocation.position = values.position);
                    setValues(randLocation);
                  }}><IconShuffle/> Randomize All</Button>
        </ButtonGroup>
      </div>
    </>
  );
};

// Properties validation
Location.propTypes = {
  values: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    slug: PropTypes.string,
    seed: PropTypes.string,
    coordinates: PropTypes.arrayOf(PropTypes.number),
    river: PropTypes.bool,
    environment: PropTypes.string,
    lakes: PropTypes.number,
    positionEnabled: PropTypes.bool,
    position: PropTypes.arrayOf(PropTypes.number),
  }),
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Location;
 
