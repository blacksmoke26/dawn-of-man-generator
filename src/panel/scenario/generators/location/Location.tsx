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
import {capitalCase} from 'change-case';
import {Button, Col, Form, InputGroup, Row} from 'react-bootstrap';

// components
import Slider from '~/components/ui/Slider';
import TextInput from '~/components/ui/TextInput';
import LinkButton from '~/components/ui/LinkButton';
import NumberInput from '~/components/ui/NumberInput';

// icons
import {IconShuffle} from '~/components/icons/app';

// utils
import * as location from '~/utils/location';
import {presetOptions} from '~/data/environments/builtin';
import {POSITION_MAX, POSITION_MIN} from '~/utils/defaults';
import {LOCATION_LAKES_MAX, LOCATION_LAKES_MIN} from '~/utils/scenario/defaults';

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

  const environmentName = useAppSelector(({environment}) => environment.name);
  const environmentVar = `{{environment}}`;

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

  const builtinPresets = presetOptions.filter(v => v.label === 'General')?.[0]?.options;

  const environments = [...builtinPresets, {
    label: capitalCase(environmentName),
    value: environmentVar,
    description: 'Custom tailored environment for the free play scenario',
  }];

  return (
    <>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label className="text-size-sm" column={true} sm="2">Name</Form.Label>
        <Col sm="10">
          <InputGroup>
            <TextInput
              caseType="SNAKE_CASE"
              disabled={!enabled}
              value={values.slug}
              maxLength={22}
              inputProps={{
                className: 'd-inline-block position-relative',
                style: {maxWidth: 280},
              }}
              placeholder="e.g., chakwal"
              allowShuffle
              onShuffle={() => {
                const {name, slug} = location.randomName();
                updateValue('name', name);
                updateValue('slug', slug);
              }}
              onChange={slug => {
                updateValue('slug', slug);
                updateValue('name', capitalCase(slug as string));
              }}/>
          </InputGroup>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label className="text-size-sm" style={{textDecoration: 'underline dotted'}}
                    title="Used to create a map" column={true} sm="2">Seed</Form.Label>
        <Col sm="10">
          <div className="float-left">
            <NumberInput
              maxLength={8}
              min={1}
              max={99999999}
              disabled={!enabled}
              placeholder="e.g. 11111111"
              value={values.seed}
              inputProps={{style: {width: 150}, className: 'd-inline-block position-relative'}}
              onChange={value => updateValue('seed', '' + value)}
              shuffle={true}
              onShuffle={() => updateValue('seed', location.randomSeed())}
            />
          </div>
          <div className="float-left mt-1">
            <LinkButton
              className="text-size-sm"
              title="Set all as 0"
              disabled={!enabled}
              onClick={() => updateValue('seed', '00000000')}>
              0x8
            </LinkButton>
            <LinkButton
              className="mr-2 text-size-sm"
              title="Set all as 1"
              disabled={!enabled}
              onClick={() => updateValue('seed', '11111111')}>
              1x8
            </LinkButton>
            <LinkButton
              className="mr-2 text-size-sm"
              title="Set all as 9"
              disabled={!enabled}
              onClick={() => updateValue('seed', '99999999')}>
              9x8
            </LinkButton>
          </div>
          <div className="clearfix"></div>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label
          className="text-size-sm" column={true} sm="2"
          style={{textDecoration: 'underline dotted'}}
          title="Reference to environment, custom environmnts must be placed in subfolder rootOtScenarioFile/Environments"
        >Environment</Form.Label>
        <Col sm="10">
          <TextInput
            caseType="SNAKE_CASE"
            disabled={!enabled}
            value={values.environment}
            maxLength={40}
            inputProps={{
              className: 'd-inline-block position-relative',
              style: {maxWidth: 300},
            }}
            placeholder="e.g., custom_environment"
            allowShuffle
            onShuffle={() => {
              updateValue('environment', location.randomEnvironment([environmentVar]));
            }}
            onChange={value => {
              updateValue('environment', value);
            }}/>
          <ul className="list-unstyled list-inline mb-0 mt-1">

            {environments.map((v: Json) => (
              <li className="list-inline-item text-size-xxs" key={`environment_key_${v.value}`}>
                {enabled ? (
                  <a href="/" title={v.description} data-value={v.value.replace('general/', '')} onClick={e => {
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
        <Form.Label
          className="text-size-sm" column={true} sm="2"
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
            <LinkButton
              className="p-0 m-0 mb-2"
              disabled={!enabled}
              onClick={() => updateValue('coordinates', location.randomCoordinates())}>
              <IconShuffle/> Randomize
            </LinkButton>
          </div>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled || !positionEnabled}, 'checkbox-align')}>
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
            <LinkButton
              className="p-0 m-0"
              disabled={!isPositionEnabled}
              onClick={() => updateValue('position', location.randomPosition())}>
              <IconShuffle/> Randomize
            </LinkButton>
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
            disabled={!enabled || !riverEnabled}
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
          <NumberInput
            disabled={!enabled || !lakeEnabled}
            value={values.lakes}
            min={LOCATION_LAKES_MIN} max={LOCATION_LAKES_MAX} maxLength={LOCATION_LAKES_MAX.toString().length}
            inputProps={{
              className: 'd-inline-block position-relative',
              style: {maxWidth: 80},
            }}
            placeholder="1"
            shuffle
            onShuffle={() => updateValue('lakes', location.randomLakes())}
            allowRestore
            onRestore={() => updateValue('lakes', 1)}
            onChange={value => updateValue('lakes', +value)}/>
        </Col>
      </Form.Group>
      <hr/>
      <div className="mt-2">
        <LinkButton
          className="ml-0"
          title="Randomize all values except for the disabled ones"
          disabled={!enabled}
          onClick={() => {
            const randLocation = location.randomizeLocation([environmentName]);
            randLocation._id = values._id;
            !isLakeEnabled && (randLocation.lakes = values.lakes);
            !isRiverEnabled && (randLocation.river = values.river);
            !isPositionEnabled && (randLocation.position = values.position);
            setValues(randLocation);
          }}>
          <IconShuffle/> Randomize values
        </LinkButton>
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
 
