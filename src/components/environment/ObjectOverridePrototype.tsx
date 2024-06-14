/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-14
 * @version 2.1.1
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import xmlFormatter from 'xml-formatter';
import {Button, Col, Form, Row} from 'react-bootstrap';

// elemental components
import Range from '~/components/ui/Range';
import Slider from '~/components/ui/Slider';
import Accordion from '~/components/ui/Accordion';

// utils
import * as random from '~/utils/random';
import {isObject} from '~/helpers/object';
import * as Defaults from '~/utils/defaults';

// icons
import {COLOR_GRAYED, COLOR_REDDISH, IconRestore, IconShuffle} from '~/components/icons/app';

// types
import type {Required} from 'utility-types';

export interface DensityObject {
  disabled: boolean;
  value: number;
}

export interface AltitudeObject {
  disabled: boolean;
  min: number;
  max: number;
}

export interface AngleObject {
  disabled: boolean;
  min: number;
  max: number;
}

export interface HumidityObject {
  disabled: boolean;
  min: number;
  max: number;
}

export type ObjectType = 'tree' | 'detail' | 'prop' | 'deposit';

export interface ChangedValues {
  name: string;
  type: ObjectType;
  density?: { value: number };
  altitude?: {
    min: number;
    max: number;
  };
  angle?: {
    min: number;
    max: number;
  };
  humidity?: {
    min: number;
    max: number;
  };
}

export interface Props {
  name: string;
  type: ObjectType;
  icon?: React.ReactElement;
  disabled?: boolean;
  expanded?: boolean;
  checked?: boolean;
  density?: DensityObject;
  altitude?: AltitudeObject;
  angle?: AngleObject;
  humidity?: HumidityObject;

  onChange?(template: string, values: ChangedValues): void,

  onRemove?(): void,
}

/** PanelHeader functional component */
const PanelHeader = ({name = '', icon = undefined, onClick = undefined}: {
  name: string,
  icon?: React.ReactElement,
  onClick?: Function
}) => (
  <div
    className="float-left"
    onClick={() => {
      'function' === typeof onClick && onClick();
    }}>
    {icon} {name}
  </div>
);

const defaultValues: Props = {
  type: 'prop',
  name: '',
  disabled: false,
  expanded: true,
  checked: true,
  density: {disabled: false, value: Defaults.DENSITY_DEFAULT},
  angle: {disabled: true, min: Defaults.ANGLE_MIN_DEFAULT, max: Defaults.ANGLE_MAX_DEFAULT},
  altitude: {disabled: true, min: Defaults.ALTITUDE_MIN_DEFAULT, max: Defaults.ALTITUDE_MAX_DEFAULT},
  humidity: {disabled: true, min: Defaults.HUMIDITY_MIN_DEFAULT, max: Defaults.HUMIDITY_MAX_DEFAULT},
  onChange() {
  },
  onRemove() {
  },
};

const toTemplateText = (values: ChangedValues): string => {
  if (!Object.keys(values).length) {
    return '';
  }

  const densityTpl: string = values?.density
    ? `<density value="${values.density.value}" />`
    : '';

  const altitudeTpl: string = values?.altitude
    ? `<min_altitude value="${values.altitude.min}" /><max_altitude value="${values.altitude.max}"/>`
    : '';

  const humidityTpl: string = values?.humidity
    ? `<min_humidity value="${values.humidity.min}" /><max_humidity value="${values.humidity.max}"/>`
    : '';

  const angleTpl: string = values?.angle
    ? `<min_angle value="${values.angle.min}" /><max_angle value="${values.angle.max}"/>`
    : '';

  if (!densityTpl && !altitudeTpl && !angleTpl && !humidityTpl) {
    return '';
  }

  return xmlFormatter(
    `<${values.type}_override_prototype>
      <id value="${values.name}"/>
      ${densityTpl}
      ${altitudeTpl}
      ${angleTpl}
      ${humidityTpl}
    </${values.type}_override_prototype>`,
  );
};

/** ObjectOverridePrototype functional component */
const ObjectOverridePrototype = (props: Props = defaultValues) => {
  const newProps = merge<Required<Props>>(defaultValues, props);

  const [name, setName] = React.useState<string>(newProps.name);
  const [expanded, setExpanded] = React.useState<boolean>(newProps.expanded);
  const [checked, setChecked] = React.useState<boolean>(newProps.checked);
  const [disabled, setDisabled] = React.useState<boolean>(newProps.disabled);
  const [density, setDensity] = React.useState<DensityObject>(newProps.density);
  const [angle, setAngle] = React.useState<AltitudeObject>(newProps.angle);
  const [altitude, setAltitude] = React.useState<AngleObject>(newProps.altitude);
  const [humidity, setHumidity] = React.useState<HumidityObject>(newProps.humidity);

  const isEnabled = !disabled && checked;
  const isDensityEnabled = isEnabled && !density.disabled;
  const isAngleEnabled = isEnabled && !angle.disabled;
  const isAltitudeEnabled = isEnabled && !altitude.disabled;
  const isHumidityEnabled = isEnabled && !humidity.disabled;


  // Reflect prop changes
  React.useEffect(() => {
    props?.name !== undefined && setName(props.name);
    props?.checked !== undefined && setChecked(props.checked);
    props?.disabled !== undefined && setDisabled(props.disabled);
    props?.expanded !== undefined && setExpanded(props.expanded);
    isObject(props?.density) && setDensity(current => merge(current, props.density as DensityObject));
    isObject(props?.angle) && setAngle(current => merge(current, props.angle as AltitudeObject));
    isObject(props?.altitude) && setAltitude(current => merge(current, props.altitude as AngleObject));
    isObject(props?.humidity) && setHumidity(current => merge(current, props.humidity as HumidityObject));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);


  // Reflect state changes
  React.useEffect(() => {
    const values: ChangedValues = {name, type: props.type};

    isDensityEnabled && (values.density = {value: density.value});
    isAngleEnabled && (values.angle = {min: angle.min, max: angle.max});
    isAltitudeEnabled && (values.altitude = {min: altitude.min, max: altitude.max});
    isHumidityEnabled && (values.humidity = {min: humidity.min, max: humidity.max});

    newProps.onChange(toTemplateText(values), values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    name, density, angle, altitude, humidity,
    isEnabled, isDensityEnabled, isAngleEnabled,
    isAltitudeEnabled, isHumidityEnabled,
  ]);

  const randomizeAll = (resetAll: boolean = false): void => {
    isDensityEnabled && setDensity(current => ({
      ...current, value: resetAll ? Defaults.DENSITY_DEFAULT : random.randomDensity(),
    }));

    if (isAngleEnabled) {
      const [min, max] = resetAll ? [Defaults.ANGLE_MIN_DEFAULT, Defaults.ANGLE_MAX_DEFAULT] : random.randomAngle();
      setAngle(current => ({...current, min, max}));
    }

    if (isAltitudeEnabled) {
      const [min, max] = resetAll ? [Defaults.ALTITUDE_MIN_DEFAULT, Defaults.ALTITUDE_MAX_DEFAULT] : random.randomAltitude();
      setAltitude(current => ({...current, min, max}));
    }

    if (isHumidityEnabled) {
      const [min, max] = resetAll ? [Defaults.HUMIDITY_MIN_DEFAULT, Defaults.HUMIDITY_MAX_DEFAULT] : random.randomHumidity();
      setHumidity(current => ({...current, min, max}));
    }
  };

  const allValuesDisabled = !isDensityEnabled && !isAngleEnabled && !isAltitudeEnabled && !isHumidityEnabled;

  return (
    <Accordion
      eventKey={name}
      activeKey={expanded ? name : ''}
      defaultActiveKey={expanded ? name : ''}
      header={<PanelHeader name={name} icon={newProps?.icon} onClick={() => setExpanded(c => !c)}/>}
      headerAfter={(
        <>
          <div className="float-right text-right position-relative" style={{height: 30, top: -4}}>
            <Button
              variant="link"
              disabled={!isEnabled || allValuesDisabled}
              title="Randomize all values"
              onClick={() => randomizeAll()}
              style={{fontSize: '1.6rem', top: -9, marginRight: '.1rem'}}
              className={cn('p-0 text-decoration-none position-relative', {'text-white': !disabled})} size="sm">
              <IconShuffle width="14" height="14"/>
            </Button>
            {' '}
            <Button
              variant="link"
              disabled={!isEnabled || allValuesDisabled}
              title="Restore all values to their defaults"
              onClick={() => randomizeAll(true)}
              style={{fontSize: '1.6rem', top: -9, marginRight: '.8rem'}}
              className={cn('p-0 text-decoration-none position-relative', {'text-white': !disabled})} size="sm">
              <IconRestore width="14" height="14"/>
            </Button>
            {' '}
            <Form.Check
              className={cn('d-inline-block position-relative ml-2 p-0', {'text-white': !disabled})}
              style={{top: -4}}
              type="switch"
              id={`enable-object-${name}`}
              label=""
              checked={checked}
              disabled={disabled}
              onChange={e => setChecked(e.target.checked)}
            />
            {' '}
            <Button
              variant="link"
              disabled={disabled}
              title="Remove this object"
              onClick={() => newProps.onRemove()}
              style={{fontSize: '1.6rem', top: -8, color: disabled ? COLOR_GRAYED : COLOR_REDDISH}}
              className="p-0 text-decoration-none position-relative " size="sm">
              &times;
            </Button>
          </div>
          <div className="clearfix"></div>
        </>
      )}
      accordion={{'aria-disabled': disabled, flush: true}}>
      <div className="clearfix"></div>
      {/*<editor-fold desc="Attribute: Density">*/}
      <Form.Group
        as={Row}
        className={cn('mb-2 checkbox-align', {'text-muted': !isDensityEnabled})}>
        <Form.Label className="text-size-sm" column={true} sm="2">
          <Form.Check
            disabled={!isEnabled}
            className={cn('text-size-xs', {'text-white': isEnabled})}
            type="switch"
            id={`switch-${nanoid(5)}`}
            label={(
              <span
                style={{textDecoration: 'underline dotted'}}
                title="The amount of objects of this type to place, has to be in the range.">
                Density:
              </span>
            )}
            checked={!density.disabled}
            onChange={e => {
              setDensity(current => ({...current, disabled: !e.target.checked}));
            }}
          />
        </Form.Label>
        <Col sm="10">
          <span className="text-size-xs font-family-code">
            Value: <code className={cn({'text-muted': !isDensityEnabled})}>{density.value}</code>
          </span>
          <Button
            disabled={!isDensityEnabled}
            className={cn('button-reset-sm', {'text-white': isDensityEnabled})} variant="link"
            onClick={() => {
              setDensity(current => ({...current, value: random.randomDensity()}));
            }}>
            Random
          </Button>
          <Button
            disabled={!isDensityEnabled}
            className={cn('button-reset-sm', {'text-white': isDensityEnabled})} variant="link"
            onClick={() => {
              setDensity(current => ({...current, value: Defaults.DENSITY_DEFAULT}));
            }}>
            Reset
          </Button>
          <Slider
            disabled={!isDensityEnabled}
            step={0.01} min={Defaults.DENSITY_MIN}
            max={Defaults.DENSITY_MAX}
            value={density.value}
            onChange={(value: any) => {
              setDensity(current => ({...current, value: value}));
            }}/>
        </Col>
      </Form.Group>
      {/*</editor-fold>*/}

      {/*<editor-fold desc="Attribute: Altitude">*/}
      <Form.Group
        as={Row}
        className={cn('mb-2 checkbox-align', {'text-muted': !isAltitudeEnabled})}>
        <Form.Label className="text-size-sm" column={true} sm="2">
          <Form.Check
            disabled={!isEnabled}
            className={cn('text-size-xs', {'text-white': isEnabled})}
            type="switch"
            id={`switch-${nanoid(5)}`}
            label={(
              <span style={{textDecoration: 'underline dotted'}}
                    title="The min and max altitudes at which this object is
										placed, in meters. 0 means water level, negative values
										might make sense for certain objects like reeds or rocks
										that are placed underwater.">
											Altitude:
										</span>
            )}
            checked={!altitude.disabled}
            onChange={e => {
              setAltitude(current => ({...current, disabled: !e.target.checked}));
            }}
          />
        </Form.Label>
        <Col sm="10">
          <span className="text-size-xs font-family-code">
            Min: <code className={cn({'text-muted': !isAltitudeEnabled})}>
              {altitude.min}
            </code>
            {' / '}
            Max: <code className={cn({'text-muted': !isAltitudeEnabled})}>
              {altitude.max}
            </code>
          </span>
          <Button
            disabled={!isAltitudeEnabled}
            className={cn('button-reset-sm', {'text-white': isAltitudeEnabled})} variant="link"
            onClick={() => {
              const [min, max] = random.randomAltitude();
              setAltitude(current => ({...current, min, max}));
            }}>
            Random
          </Button>
          <Button
            disabled={!isAltitudeEnabled}
            className={cn('button-reset-sm', {'text-white': isAltitudeEnabled})} variant="link"
            onClick={() => {
              setAltitude(current => ({
                ...current, min: Defaults.ALTITUDE_MIN_DEFAULT,
                max: Defaults.ALTITUDE_MAX_DEFAULT,
              }));
            }}>
            Reset
          </Button>
          <Range
            disabled={!isAltitudeEnabled}
            step={1}
            min={Defaults.ALTITUDE_MIN}
            max={Defaults.ALTITUDE_MAX}
            value={[altitude.min, altitude.max]}
            onChange={value => {
              const [min, max] = value as [number, number];
              setAltitude(current => ({...current, min, max}));
            }}/>
        </Col>
      </Form.Group>
      {/*</editor-fold>*/}

      {/*<editor-fold desc="Attribute: Angle">*/}
      <Form.Group
        as={Row}
        className={cn('mb-2 checkbox-align', {'text-muted': !isAngleEnabled})}>
        <Form.Label className="text-size-sm" column={true} sm="2">
          <Form.Check
            disabled={!isEnabled}
            className={cn('text-size-xs', {'text-white': isEnabled})}
            type="switch"
            id={`switch-${nanoid(5)}`}
            label={(
              <span style={{textDecoration: 'underline dotted'}}
                    title="The min and max slope angles in degrees at which this object
											is placed. Values range from 0 (flat), to 60 (very steep). Negative
											values of up to -10 are allowed to ensure you get max density at 0
											degrees, as there is a transition zone.">
											Angle:
										</span>
            )}
            checked={!angle.disabled}
            onChange={e => {
              setAngle(current => ({...current, disabled: !e.target.checked}));
            }}
          />
        </Form.Label>
        <Col sm="10">
          <span className="text-size-xs font-family-code">
            Min: <code className={cn({'text-muted': !isAngleEnabled})}>
              {angle.min}
            </code>
            {' / '}
            Max: <code className={cn({'text-muted': !isAngleEnabled})}>
              {angle.max}
            </code>
          </span>
          <Button
            disabled={!isAngleEnabled}
            className={cn('button-reset-sm', {'text-white': isAngleEnabled})} variant="link"
            onClick={() => {
              const [min, max] = random.randomAltitude();
              setAngle(current => ({...current, min, max}));
            }}>
            Random
          </Button>
          <Button
            disabled={!isAngleEnabled}
            className={cn('button-reset-sm', {'text-white': isAngleEnabled})} variant="link"
            onClick={() => {
              setAngle(current => ({
                ...current, min: Defaults.ANGLE_MIN_DEFAULT,
                max: Defaults.ANGLE_MAX_DEFAULT,
              }));
            }}>
            Reset
          </Button>
          <Range
            disabled={!isAngleEnabled}
            min={Defaults.ANGLE_MIN}
            max={Defaults.ANGLE_MAX}
            step={1}
            value={[angle.min, angle.max]}
            onChange={value => {
              const [min, max] = value as [number, number];
              setAngle(current => ({...current, min, max}));
            }}/>
        </Col>
      </Form.Group>
      {/*</editor-fold>*/}

      {/*<editor-fold desc="Attribute: Humidity">*/}
      <Form.Group
        as={Row}
        className={cn('mb-2 checkbox-align', {'text-muted': !isHumidityEnabled})}>
        <Form.Label className="text-size-sm" column={true} sm="2">
          <Form.Check
            disabled={!isEnabled}
            className={cn('text-size-xs', {'text-white': isEnabled})}
            type="switch"
            id={`switch-${nanoid(5)}`}
            label={(
              <span
                style={{textDecoration: 'underline dotted'}}
                title="The min and max humidity at which this detail object is placed,
											humidity is close to 1 near rivers and forests, and 0 in other places.">
                Humidity:
              </span>
            )}
            checked={!humidity.disabled}
            onChange={e => {
              setHumidity(current => ({...current, disabled: !e.target.checked}));
            }}
          />
        </Form.Label>
        <Col sm="10">
          <span className="text-size-xs font-family-code">
            Min: <code className={cn({'text-muted': !isHumidityEnabled})}>
              {humidity.min}
            </code>
            {' / '}
            Max: <code className={cn({'text-muted': !isHumidityEnabled})}>
              {humidity.max}
            </code>
          </span>
          <Button
            disabled={!isHumidityEnabled}
            className={cn('button-reset-sm', {'text-white': isHumidityEnabled})} variant="link"
            onClick={() => {
              const [min, max] = random.randomHumidity();
              setHumidity(current => ({...current, min, max}));
            }}>
            Random
          </Button>
          <Button
            disabled={!isHumidityEnabled}
            className={cn('button-reset-sm', {'text-white': isHumidityEnabled})} variant="link"
            onClick={() => {
              setHumidity(current => ({
                ...current, min: Defaults.HUMIDITY_MIN_DEFAULT,
                max: Defaults.HUMIDITY_MAX_DEFAULT,
              }));
            }}>
            Reset
          </Button>
          <Range
            disabled={!isHumidityEnabled}
            min={Defaults.HUMIDITY_MIN}
            max={Defaults.HUMIDITY_MAX}
            step={0.1}
            value={[humidity.min, humidity.max]}
            onChange={value => {
              const [min, max] = value as [number, number];
              setHumidity(current => ({...current, min, max}));
            }}/>
        </Col>
      </Form.Group>
      {/*</editor-fold>*/}
    </Accordion>
  );
};

// Properties validation
ObjectOverridePrototype.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['tree', 'detail', 'prop', 'deposit']).isRequired,
  icon: PropTypes.element,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  density: PropTypes.shape({
    value: PropTypes.number.isRequired,
  }),
  altitude: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }),
  angle: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }),
  humidity: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }),
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
};

export default ObjectOverridePrototype;
