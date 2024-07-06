/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-14
 * @version 2.1.1
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classname';
import obPath from 'object-path';
import merge from 'deepmerge';
import {Form, Row} from 'react-bootstrap';

// elemental components
import LinkButton from '~/components/ui/LinkButton';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import AttributeRangeValue from '~/components/ui/elements/AttributeValueRange';
import AttributeValueSlider from '~/components/ui/elements/AttributeValueSlider';

// hooks
import useValues from '~/hooks/use-values';

// icons
import {COLOR_DISABLED, COLOR_ORANGE, IconClear, IconRestore, IconShuffle} from '~/components/icons/app';

// utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';
import {objects as OBJECT_TYPES} from '~/utils/objects';
import {toTemplateValues, InitialValues} from './utils/object-override-prototype';

// parsers
import {toOverridePrototypeTemplate} from '~/utils/parser/environment/templates';

// types
import type {Required} from 'utility-types';
import type {ObjectType} from '~/utils/objects';
import type {ValuesState} from './utils/object-override-prototype';

export type {InitialValues};

export interface Props {
  name: string;
  type: ObjectType;
  disabled?: boolean;
  initialValues?: InitialValues;

  onChange?(values: InitialValues): void;

  onTemplate?(template: string): void;

  onRemove?(): void,
}

const defaultValues = {
  disabled: false,
  initialValues: {},
  onChange() {
  },
  onRemove() {
  },
  onTemplate() {
  },
};

/** ObjectOverridePrototype functional component */
const ObjectOverridePrototype = (props: Props) => {
  const newProps = merge<Required<Props>>(defaultValues, props);

  const accessor = obPath(props?.initialValues || {});

  const valuer = useValues<ValuesState>({
    density: {
      disabled: !accessor.has('density'),
      value: +accessor.get('density', Defaults.DENSITY_DEFAULT),
    },
    angle: {
      disabled: !accessor.has('angle'),
      min: +accessor.get('angle.0', Defaults.ANGLE_MIN_DEFAULT),
      max: +accessor.get('angle.1', Defaults.ANGLE_MAX_DEFAULT),
    },
    altitude: {
      disabled: !accessor.has('altitude'),
      min: +accessor.get('altitude.0', Defaults.ALTITUDE_MIN_DEFAULT),
      max: +accessor.get('altitude.1', Defaults.ALTITUDE_MAX_DEFAULT),
    },
    humidity: {
      disabled: !accessor.has('humidity'),
      min: +accessor.get('humidity.0', Defaults.HUMIDITY_MIN_DEFAULT),
      max: +accessor.get('humidity.1', Defaults.HUMIDITY_MAX_DEFAULT),
    },
  });

  const [checked, setChecked] = React.useState<boolean>(true);

  const randomizeAll = (restore: boolean = false): void => {
    if (valuer.is('density.disabled', false)) {
      valuer.set('density.value', restore ? Defaults.DENSITY_DEFAULT : random.randomDensity(true));
    }

    if (valuer.is('angle.disabled', false)) {
      const [min, max] = restore ? [Defaults.ANGLE_MIN_DEFAULT, Defaults.ANGLE_MAX_DEFAULT] : random.randomAngle();
      valuer.set('angle.min', min);
      valuer.set('angle.max', max);
    }

    if (valuer.is('altitude.disabled', false)) {
      const [min, max] = restore ? [Defaults.ALTITUDE_MIN_DEFAULT, Defaults.ALTITUDE_MAX_DEFAULT] : random.randomAltitude();
      valuer.set('altitude.min', min);
      valuer.set('altitude.max', max);
    }

    if (valuer.is('humidity.disabled', false)) {
      const [min, max] = restore ? [Defaults.HUMIDITY_MIN_DEFAULT, Defaults.HUMIDITY_MAX_DEFAULT] : random.randomHumidity();
      valuer.set('humidity.min', min);
      valuer.set('humidity.max', max);
    }
  };

  const values = valuer.getAll();

  // Reflect state changes
  React.useEffect(() => {
    const allowRender = !props?.disabled && checked;
    const changedValues = toTemplateValues(values, allowRender);
    const template = toOverridePrototypeTemplate(
      props.type, props.name, changedValues, allowRender,
    );

    newProps.onChange(changedValues);
    newProps.onTemplate(template.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props?.disabled, props.name, props.type, checked, values,
  ]);

  const isEnabled = !newProps.disabled && checked;
  const isDensityEnabled = isEnabled && valuer.is('density.disabled', false);
  const isAngleEnabled = isEnabled && valuer.is('angle.disabled', false);
  const isAltitudeEnabled = isEnabled && valuer.is('altitude.disabled', false);
  const isHumidityEnabled = isEnabled && valuer.is('humidity.disabled', false);

  const allValuesDisabled = !(isDensityEnabled === isAngleEnabled === isAltitudeEnabled === isHumidityEnabled);

  return (
    <>
      <div>
        <div className="float-right text-right position-relative mb-2" style={{height: 30, top: 15}}>
          <LinkButton
            disabled={!isEnabled || allValuesDisabled}
            title="Randomize all values"
            onClick={() => randomizeAll()}
            style={{top: -7, marginRight: '.1rem'}}
            className="p-0 text-decoration-none position-relative">
            <IconShuffle width="14" height="14"/>
          </LinkButton>
          {' '}
          <LinkButton
            disabled={!isEnabled || allValuesDisabled}
            title="Restore all values to their defaults"
            onClick={() => randomizeAll(true)}
            style={{top: -7, marginRight: '.85rem'}}>
            <IconRestore
              width="14" height="14"
              color={newProps.disabled ? COLOR_DISABLED : COLOR_ORANGE}/>
          </LinkButton>
          {' '}
          <Form.Check
            className="d-inline-block position-relative ml-2 p-0"
            style={{top: -4, marginRight: '.10rem'}}
            type="switch"
            id={`enable-object-${props.name}`}
            label=""
            checked={checked}
            disabled={newProps.disabled}
            onChange={e => setChecked(e.target.checked)}
          />
          {' '}
          <LinkButton
            disabled={newProps.disabled}
            title="Remove this object"
            onClick={() => newProps.onRemove()}
            color="REDDISH"
            style={{top: -8}}
            className="p-0 ml-0 text-decoration-none position-relative">
            <IconClear width="17" height="17"/>
          </LinkButton>
        </div>
        <div className="clearfix"></div>
      </div>
      <div>
        {/*<editor-fold desc="Attribute: Density">*/}
        <Form.Group
          as={Row}
          className={cn('mb-2 checkbox-align', {'text-muted': !isDensityEnabled})}>
          <PropertyCheckboxLabel
            style={{top: 5}}
            caption="Density:"
            checked={valuer.is<boolean>('density.disabled', false)}
            disabled={!isEnabled}
            tooltip="The amount of objects of this type to place, has to be in the range."
            onChange={(checkState) => {
              valuer.set('density.disabled', !checkState);
            }}
          />
          <AttributeValueSlider
            value={valuer.get('density.value')}
            disabled={!isDensityEnabled}
            onShuffle={() => {
              valuer.set('density.value', random.randomDensity(true));
            }}
            onRestore={() => {
              valuer.set('density.value', Defaults.DENSITY_DEFAULT);
            }}
            sliderProps={{
              min: Defaults.DENSITY_MIN,
              max: Defaults.DENSITY_MAX,
              step: 0.01,
            }}
            onChange={value => valuer.set('density.value', value)}
          />
        </Form.Group>
        {/*</editor-fold>*/}

        {/*<editor-fold desc="Attribute: Altitude">*/}
        <Form.Group
          as={Row}
          className={cn('mb-2 checkbox-align', {'text-muted': !isAltitudeEnabled})}>
          <PropertyCheckboxLabel
            style={{top: 5}}
            caption="Altitude:"
            checked={valuer.is<boolean>('altitude.disabled', false)}
            disabled={!isEnabled}
            tooltip="The min and max altitudes at which this object is
										placed, in meters. 0 means water level, negative values
										might make sense for certain objects like reeds or rocks
										that are placed underwater."
            onChange={(checkState) => {
              valuer.set('altitude.disabled', !checkState);
            }}
          />
          <AttributeRangeValue
            min={valuer.get('altitude.min')}
            max={valuer.get('altitude.max')}
            disabled={!isAltitudeEnabled}
            onShuffle={() => {
              const [min, max] = random.randomAltitude();
              valuer.set('altitude.min', min);
              valuer.set('altitude.max', max);
            }}
            onRestore={() => {
              valuer.set('altitude.min', Defaults.ALTITUDE_MIN_DEFAULT);
              valuer.set('altitude.max', Defaults.ALTITUDE_MAX_DEFAULT);
            }}
            sliderProps={{
              min: Defaults.ALTITUDE_MIN,
              max: Defaults.ALTITUDE_MAX,
            }}
            onChange={(min, max) => {
              valuer.set('altitude.min', min);
              valuer.set('altitude.max', max);
            }}
          />
        </Form.Group>
        {/*</editor-fold>*/}

        {/*<editor-fold desc="Attribute: Angle">*/}
        <Form.Group
          as={Row}
          className={cn('mb-2 checkbox-align', {'text-muted': !isAngleEnabled})}>
          <PropertyCheckboxLabel
            style={{top: 5}}
            caption="Angle:"
            checked={valuer.is<boolean>('angle.disabled', false)}
            disabled={!isEnabled}
            tooltip="The min and max slope angles in degrees at which this object
											is placed. Values range from 0 (flat), to 60 (very steep). Negative
											values of up to -10 are allowed to ensure you get max density at 0
											degrees, as there is a transition zone."
            onChange={(checkState) => {
              valuer.set('angle.disabled', !checkState);
            }}
          />
          <AttributeRangeValue
            min={valuer.get('angle.min')}
            max={valuer.get('angle.max')}
            disabled={!isAngleEnabled}
            allowShuffle
            allowRestore
            onShuffle={() => {
              const [min, max] = random.randomAngle();
              valuer.set('angle.min', min);
              valuer.set('angle.max', max);
            }}
            onRestore={() => {
              valuer.set('angle.min', Defaults.ANGLE_MIN_DEFAULT);
              valuer.set('angle.max', Defaults.ANGLE_MAX_DEFAULT);
            }}
            sliderProps={{
              min: Defaults.ANGLE_MIN,
              max: Defaults.ANGLE_MAX,
            }}
            onChange={(min, max) => {
              valuer.set('angle.min', min);
              valuer.set('angle.max', max);
            }}
          />
        </Form.Group>
        {/*</editor-fold>*/}

        {/*<editor-fold desc="Attribute: Humidity">*/}
        <Form.Group
          as={Row}
          className={cn('mb-2 checkbox-align', {'text-muted': !isHumidityEnabled})}>
          <PropertyCheckboxLabel
            style={{top: 5}}
            caption="Humidity:"
            checked={valuer.is<boolean>('humidity.disabled', false)}
            disabled={!isEnabled}
            tooltip="The min and max humidity at which this detail object is placed,
											humidity is close to 1 near rivers and forests, and 0 in other places."
            onChange={(checkState) => {
              valuer.set('humidity.disabled', !checkState);
            }}
          />
          <AttributeRangeValue
            min={valuer.get('humidity.min')}
            max={valuer.get('humidity.max')}
            disabled={!isHumidityEnabled}
            onShuffle={() => {
              const [min, max] = random.randomHumidity();
              valuer.set('humidity.min', min);
              valuer.set('humidity.max', max);
            }}
            onRestore={() => {
              valuer.set('humidity.min', Defaults.HUMIDITY_MIN_DEFAULT);
              valuer.set('humidity.max', Defaults.HUMIDITY_MAX_DEFAULT);
            }}
            sliderProps={{
              min: Defaults.HUMIDITY_MIN,
              max: Defaults.HUMIDITY_MAX,
              step: 0.01,
            }}
            onChange={(min, max) => {
              valuer.set('humidity.min', min);
              valuer.set('humidity.max', max);
            }}
          />
        </Form.Group>
        {/*</editor-fold>*/}</div>
    </>
  );
};

// Properties validation
ObjectOverridePrototype.propTypes = {
  type: PropTypes.oneOf(OBJECT_TYPES).isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  initialValues: PropTypes.exact({
    density: PropTypes.number,
    altitude: PropTypes.arrayOf(PropTypes.number),
    angle: PropTypes.arrayOf(PropTypes.number),
    humidity: PropTypes.arrayOf(PropTypes.number),
  }),
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default ObjectOverridePrototype;
