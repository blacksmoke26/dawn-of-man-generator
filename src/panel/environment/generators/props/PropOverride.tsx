/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// types
import React from 'react';
import * as PropTypes from 'prop-types';
import {Button, Col, Form, Row} from 'react-bootstrap';
import cn from 'classname';
import {nanoid} from 'nanoid';
import merge from 'deepmerge';

// components
import Range from '~/components/ui/Range';
import Slider from '~/components/ui/Slider';
import Select, {Option} from '~/components/ui/Select';
import Accordion from '~/components/ui/Accordion';

// utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';
import {isObject} from '~/helpers/object';

// icons
import {IconHammer} from '~/components/icons/app';

// redux
import {useAppSelector} from '~redux/hooks';

export interface PropAttr {
  _enabled?: boolean;

  angle_enabled?: boolean,
  min_angle?: number;
  max_angle?: number;

  altitude_enabled?: boolean;
  min_altitude?: number;
  max_altitude?: number;

  density_enabled?: boolean,
  density?: number,

  humidity_enabled?: boolean,
  min_humidity?: number,
  max_humidity?: number,
}

type PropSelection = {
  [p: string]: PropAttr
};

/** Get randomized initial values */
const getInitialValues = (): PropAttr => {
  const [min_humidity, max_humidity] = random.randomHumidity();
  const [min_angle, max_angle] = random.randomAngle();
  const [min_altitude, max_altitude] = random.randomAltitude();

  return {
    _enabled: true,

    angle_enabled: false,
    min_angle, max_angle,

    altitude_enabled: false,
    min_altitude, max_altitude,

    density_enabled: true,
    density: random.randomDensity(),

    humidity_enabled: false,
    min_humidity, max_humidity,
  };
};

/** Transform extended value into a selection object */
const extValueToSelection = (data: Object = {}): PropSelection => {
  const selection: PropSelection = {};

  for (const [name, attr] of Object.entries(data)) {
    const node: PropAttr = {
      _enabled: true,
    };

    if ('density' in attr) {
      node.density_enabled = true;
      node.density = attr.density
    }

    if ('angle' in attr) {
      node.angle_enabled = true;
      node.min_angle = attr.angle[0];
      node.max_angle = attr.angle[1];
    }

    if ('humidity' in attr) {
      node.humidity_enabled = true;
      node.min_humidity = attr.humidity[0];
      node.max_humidity = attr.humidity[1];
    }

    if ('altitude' in attr) {
      node.altitude_enabled = true;
      node.min_altitude = attr.altitude[0];
      node.max_altitude = attr.altitude[1];
    }

    selection[name] = node as PropAttr;
  }

  return selection;
};

/** PropOverride `props` type */
export interface Props {
  enabled?: boolean;
  selection?: PropSelection;

  onChange?(template: string, values?: { [p: string]: any }): void;
}

/** PropOverride functional component */
const PropOverride = (props: Props) => {
  props = merge({
    enabled: true,
    selection: {},
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);
  const [selection, setSelection] = React.useState<PropSelection>(props.selection as PropSelection);

  const environment = useAppSelector(({environment}) => (environment));

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = environment?.propOverridePrototypes ?? null;

    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
    }

    if (isObject(extValue)) {
      setEnabled(true);
      setSelection(extValueToSelection(extValue as PropAttr));
    }
  }, [environment]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), selection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, enabled]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    const templateOverride: Array<string> = [];

    if (!enabled) {
      return '';
    }

    for (const [name, attr] of Object.entries(selection)) {
      if (!attr._enabled) {
        continue;
      }

      const densityTpl: string = attr.density_enabled
        ? `<density value="${attr.density}" />`
        : '';

      const altitudeTpl: string = attr.altitude_enabled
        ? `<min_altitude value="${attr.min_altitude}" /><max_altitude value="${attr.max_altitude}"/>`
        : '';

      const humidityTpl: string = attr.humidity_enabled
        ? `<min_humidity value="${attr.min_humidity}" /><max_humidity value="${attr.max_humidity}"/>`
        : '';

      const angleTpl: string = attr.angle_enabled
        ? `<min_angle value="${attr.min_angle}" /><max_angle value="${attr.max_angle}"/>`
        : '';

      templateOverride.push(
        `<prop_override_prototype>
					<id value="${name}"/>
					${densityTpl}
					${altitudeTpl}
					${angleTpl}
					${humidityTpl}
				</prop_override_prototype>`
      );
    }

    return templateOverride.length
      ? (
        `<prop_override_prototypes>
				${templateOverride.join('')}
				</prop_override_prototypes>`
      ) : '';
  }, [enabled, selection]);

  /** Get react-select options */
  const renderSelectOptions = React.useCallback((): Array<Object> => {
    const excludes: Array<string> = Object.keys(selection);

    return random.props
      .filter(v => !excludes.includes(v))
      .map(v => ({label: v, value: v}));
  }, [selection]);

  /** Update given selection data */
  const modifySelection = (name: string, attr: PropAttr): void => {
    setSelection(current => ({
      ...current,
      [name]: {...(current[name] ?? {}), ...attr}
    }));
  };

  /** Remove existing selection */
  const removeFromSelection = (name: string): void => {
    setSelection(current => {
      current.hasOwnProperty(name) && (delete current[name]);
      return {...current};
    });
  };

  /** Generate selection based nodes */
  const selectionNodes = React.useCallback((): React.ReactElement[] => {
    const nodes: React.ReactElement[] = [];

    for (const [name, attr] of Object.entries(selection)) {
      const isEnabled = attr._enabled && enabled;
      const isAltitudeEnabled = isEnabled && attr.altitude_enabled;
      const isDensityEnabled = isEnabled && attr.density_enabled;
      const isAngleEnabled = isEnabled && attr.angle_enabled;
      const isHumidityEnabled = isEnabled && attr.humidity_enabled;
      const eventKey = `prop_${name}`;

      nodes.push(
        <Accordion noCard={true} key={eventKey} defaultActiveKey={eventKey} eventKey={eventKey} headerAfter={
          <div className="float-right">
            <Form.Check
              disabled={!enabled}
              className="d-inline-block position-relative"
              style={{top: -4}}
              type="switch"
              id={`enable-prop-${name}`}
              label=""
              checked={attr._enabled}
              onChange={e => {
                e.preventDefault();
                e.stopPropagation();
                modifySelection(name, {_enabled: e.target.checked});
              }}
            />
            {' '}
            <Button variant="link" disabled={!isEnabled}
                    onClick={() => removeFromSelection(name)}
                    style={{fontSize: '1.2rem', top: -7}}
                    className="p-0 text-decoration-none position-relative" size="sm">
              &times;
            </Button>
          </div>
        } header={
          <div className="clearfix">
            <div className="float-left">
              <IconHammer width="17" height="17"/> {name}
            </div>
          </div>
        } accordion={{'aria-disabled': !isAltitudeEnabled, flush: true}}>
          <Form.Group as={Row} className={cn('mb-2', {'text-muted': !isDensityEnabled})}>
            <Form.Label className="text-size-sm" column={true} sm="2">
              <Form.Check
                disabled={!isEnabled}
                className="text-size-xs"
                type="switch"
                id={`switch-${nanoid(5)}`}
                label={<span style={{textDecoration: 'underline dotted'}}
                             title="The amount of objects of this type to place, has to be in the range.">
											Density:
										</span>}
                checked={attr.density_enabled}
                onChange={e => modifySelection(name, {density_enabled: Boolean(e.target.checked)})}
              />
            </Form.Label>
            <Col sm="10">
									<span className="text-size-xs font-family-code">
										Value: <code className={cn({'text-muted': !isDensityEnabled})}>{attr.density}</code>
									</span>
              <Button disabled={!isDensityEnabled}
                      className="button-reset-sm" variant="link"
                      onClick={() => modifySelection(name, {density: random.randomDensity()})}>
                Random
              </Button>
              <Button disabled={!isDensityEnabled}
                      className="button-reset-sm" variant="link"
                      onClick={() => modifySelection(name, {density: Defaults.DENSITY_DEFAULT})}>
                Reset
              </Button>
              <Slider disabled={!isDensityEnabled}
                        step={0.01} min={Defaults.DENSITY_MIN} max={Defaults.DENSITY_MAX}
                        value={Number(attr.density)} onChange={(value: any) => modifySelection(name, {density: value})}/>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className={cn('mb-2', {'text-muted': !isAltitudeEnabled})}>
            <Form.Label className="text-size-sm" column={true} sm="2">
              <Form.Check
                disabled={!isEnabled}
                className="text-size-xs"
                type="switch"
                id={`prop_override_altitude-switch-${nanoid(5)}`}
                label={
                  <span style={{textDecoration: 'underline dotted'}}
                        title="The min and max altitudes at which this object is
										placed, in meters. 0 means water level, negative values
										might make sense for certain objects like reeds or rocks
										that are placed underwater.">
											Altitude:
										</span>
                }
                checked={attr.altitude_enabled}
                onChange={e => modifySelection(name, {altitude_enabled: e.target.checked})}
              />
            </Form.Label>
            <Col sm="10">
              <>
                <span className="text-size-xs font-family-code">
                  Min: <code className={cn({'text-muted': !isAltitudeEnabled})}>
                    {attr.min_altitude}
                  </code>
                  {' / '}
                  Max: <code className={cn({'text-muted': !isAltitudeEnabled})}>
                    {attr.max_altitude}
                  </code>
                </span>
                <Button disabled={!isAltitudeEnabled}
                        className="button-reset-sm" variant="link"
                        onClick={() => {
                          const [min_altitude, max_altitude] = random.randomAltitude();
                          modifySelection(name, {min_altitude, max_altitude});
                        }}>Random</Button>
                <Button disabled={!isAltitudeEnabled}
                        className="button-reset-sm" variant="link"
                        onClick={() => modifySelection(name, {
                          min_altitude: Defaults.ALTITUDE_MIN_DEFAULT,
                          max_altitude: Defaults.ALTITUDE_MAX_DEFAULT,
                        })}>Default</Button>
              </>
              <Range
                min={Defaults.ALTITUDE_MIN}
                max={Defaults.ALTITUDE_MAX}
                disabled={!isAltitudeEnabled}
                value={[attr.min_altitude as number, attr.max_altitude as number]}
                onChange={(value) => {
                  const [min_altitude, max_altitude] = value as number[];
                  modifySelection(name, {min_altitude, max_altitude});
                }}/>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className={cn('mb-2', {'text-muted': !isAngleEnabled})}>
            <Form.Label className="text-size-sm" column={true} sm="2">
              <Form.Check
                disabled={!isEnabled}
                className="text-size-xs"
                type="switch"
                id={`prop_override_angle-switch-${nanoid(5)}`}
                label={<span style={{textDecoration: 'underline dotted'}}
                             title="The min and max slope angles in degrees at which this object
											is placed. Values range from 0 (flat), to 60 (very steep). Negative
											values of up to -10 are allowed to ensure you get max density at 0
											degrees, as there is a transition zone.">
											Angle:
										</span>}
                checked={attr.angle_enabled}
                onChange={e => modifySelection(name, {angle_enabled: e.target.checked})}
              />
            </Form.Label>
            <Col sm="10">
              <div>
										<span className="text-size-xs font-family-code">
											Min: <code className={cn({'text-muted': !isAngleEnabled})}>
												{attr.min_angle}
											</code>
                      {' / '}
                      Max: <code className={cn({'text-muted': !isAngleEnabled})}>
												{attr.max_angle}
											</code>
										</span>
                <Button disabled={!isAngleEnabled}
                        className="button-reset-sm" variant="link"
                        onClick={() => {
                          const [min_angle, max_angle] = random.randomAngle();
                          modifySelection(name, {min_angle, max_angle});
                        }}>Random</Button>
                <Button disabled={!isAngleEnabled}
                        className="button-reset-sm" variant="link"
                        onClick={() => modifySelection(name, {
                          min_angle: Defaults.ANGLE_MIN_DEFAULT,
                          max_angle: Defaults.ANGLE_MAX_DEFAULT,
                        })}>Default</Button>
              </div>
              <Range
                min={Defaults.ANGLE_MIN}
                max={Defaults.ANGLE_MAX}
                disabled={!isAngleEnabled}
                value={[attr.min_angle as number, attr.max_angle as number]}
                onChange={value => {
                  const [min_angle, max_angle] = value as number[]
                  modifySelection(name, {min_angle, max_angle});
                }}/>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className={cn('mb-2', {'text-muted': !isHumidityEnabled})}>
            <Form.Label className="text-size-sm" column={true} sm="2">
              <Form.Check
                disabled={!enabled}
                className="text-size-xs"
                type="switch"
                id={`prop_override_humidity-switch-${nanoid(5)}`}
                label={<span style={{textDecoration: 'underline dotted'}}
                             title="The min and max humidity at which this prop object is placed,
											humidity is close to 1 near rivers and forests, and 0 in other places.">
											Humidity:
										</span>}
                checked={attr.humidity_enabled}
                onChange={e => modifySelection(name, {humidity_enabled: e.target.checked})}
              />
            </Form.Label>
            <Col sm="10">
              <div>
										<span className="text-size-xs font-family-code">
											Min: <code className={cn({'text-muted': !isHumidityEnabled})}>{attr.min_humidity}</code>
                      {' / '}
                      Max: <code className={cn({'text-muted': !isHumidityEnabled})}>{attr.max_humidity}</code>
										</span>
                <Button disabled={!enabled || !attr.humidity_enabled}
                        className="button-reset-sm" variant="link"
                        onClick={() => {
                          const [min_humidity, max_humidity] = random.randomHumidity();
                          modifySelection(name, {min_humidity, max_humidity});
                        }}>Random</Button>
                <Button disabled={!enabled || !attr.humidity_enabled}
                        className="button-reset-sm" variant="link"
                        onClick={() => modifySelection(name, {
                          min_humidity: Defaults.HUMIDITY_MIN_DEFAULT,
                          max_humidity: Defaults.HUMIDITY_MAX_DEFAULT,
                        })}>Default</Button>
              </div>
              <Range
                min={Defaults.HUMIDITY_MIN}
                max={Defaults.HUMIDITY_MAX}
                step={0.01}
                disabled={!enabled || !attr.humidity_enabled}
                value={[attr.min_humidity as number, attr.max_humidity as number]}
                onChange={value => {
                  const [min_humidity, max_humidity] = value as number[]
                  modifySelection(name, {min_humidity, max_humidity});
                }}/>
            </Col>
          </Form.Group>
        </Accordion>
      );
    }

    return nodes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, selection]);

  return (
    <Accordion noCard={true} header="Override Prop Prototypes" eventKey="prop_override_panel">
      <div className="mt-2 checkbox-align">
        <Form.Check
          className="pull-right"
          type="switch"
          id={`prop_override-switch-${nanoid(5)}`}
          label="Override prop"
          checked={enabled}
          onChange={e => setEnabled(e.target.checked)}
        />
        <div className="mt-2 mb-3">
          <Select
            isDisabled={!enabled}
            menuPortalTarget={document.body}
            options={renderSelectOptions()}
            placeholder="Choose prop to override"
            onChange={(option: Option | any, {action}): void => {
              if (action === 'select-option' && option) {
                modifySelection(option.value, getInitialValues());
              }
            }}
          />
        </div>
        {selectionNodes()}
      </div>
    </Accordion>
  );
};

// Properties validation
PropOverride.propTypes = {
  enabled: PropTypes.bool,
  selection: PropTypes.object,
  onChange: PropTypes.func,
};

export default PropOverride;
