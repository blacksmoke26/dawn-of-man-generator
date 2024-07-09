/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-14
 * @version 2.1.1
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classname';
import {Form, Row} from 'react-bootstrap';

// elemental components
import LinkButton from '~/components/ui/LinkButton';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import AttributeRangeValue from '~/components/ui/elements/AttributeValueRange';
import AttributeValueSlider from '~/components/ui/elements/AttributeValueSlider';

// hooks
import useValues from '~/hooks/use-values';

// icons
import {IconRestore, IconShuffle} from '~/components/icons/app';

// utils
import {objects} from '~/utils/objects';
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';
import {filterEmpty} from '~/utils/parser/templates';

// parsers
import {toOverridePrototypeTemplate} from '~/utils/parser/environment/templates';

// types
import type {environment} from '~/data/environments/parser/types';
import type {UseValuesHook} from '~/hooks/use-values.types';

type OverridePrototype = environment.prototypes.OverridePrototype;

export interface Props {
  name: string;
  type: environment.prototypes.ObjectType;
  disabled?: boolean;
  initialValues?: OverridePrototype;

  onChange?(values: OverrideMetaAttributes): void;

  onValuesChange?(values: OverridePrototype): void;

  onTemplate?(template: string): void;
}

export interface OverrideMetaAttributes {
  disabled: boolean;
  densityChecked: boolean;
  angleChecked: boolean;
  altitudeChecked: boolean;
  humidityChecked: boolean;
}

const isAllParamsDisabled = (meta: UseValuesHook<OverrideMetaAttributes>): boolean => {
  return [
    'densityChecked', 'angleChecked', 'altitudeChecked', 'humidityChecked',
  ].every(key => !meta.get(key, false));
};

/** ObjectOverridePrototype functional component */
const ObjectOverridePrototype = (props: Props) => {
  const valuer = useValues<OverridePrototype>(props?.initialValues ?? {} as OverridePrototype);

  const meta = useValues<OverrideMetaAttributes>({
    disabled: props?.disabled ?? false,
    densityChecked: !valuer.is('density', undefined),
    angleChecked: !valuer.is('angle', undefined),
    altitudeChecked: !valuer.is('altitude', undefined),
    humidityChecked: !valuer.is('humidity', undefined),
  });

  React.useEffect(() => {
    if (isAllParamsDisabled(meta)) {
      meta.set('densityChecked', true);
      valuer.set('density', Defaults.DENSITY_DEFAULT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect state changes
  React.useEffect(() => {
    const changedValues = {...valuer.data} as OverridePrototype;
    !meta.data.densityChecked && delete changedValues.density;
    !meta.data.altitudeChecked && delete changedValues.altitude;
    !meta.data.angleChecked && delete changedValues.angle;
    !meta.data.humidityChecked && delete changedValues.humidity;

    const filtered = filterEmpty(changedValues);

    props?.onValuesChange?.(filtered);
    props?.onTemplate?.(toOverridePrototypeTemplate(
      props.type, props.name, filtered, !meta.data.disabled,
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.disabled, meta.data, valuer.data, props.name, props.type]);

  // Reflect state changes
  React.useEffect(() => {
    props?.onChange?.(meta.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.data]);

  // Reflect state changes
  React.useEffect(() => {
    meta.set('disabled', props.disabled, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.disabled]);

  const isDisabled = meta.data.disabled;
  const isDensityDisabled = isDisabled || !meta.data.densityChecked;
  const isAngleDisabled = isDisabled || !meta.data.angleChecked;
  const isAltitudeDisabled = isDisabled || !meta.data.altitudeChecked;
  const isHumidityDisabled = isDisabled || !meta.data.humidityChecked;

  return (
    <>
      <div>
        {/*<editor-fold desc="Attribute: Density">*/}
        <Row
          as={Row}
          className={cn('mb-2 checkbox-align', {'text-muted-deep': isDensityDisabled})}>
          <PropertyCheckboxLabel
            style={{top: 5}}
            caption="Density:"
            checked={meta.data.densityChecked}
            disabled={isDisabled}
            undefinedSetter={[valuer, 'density', Defaults.DENSITY_DEFAULT]}
            tooltip="The amount of objects of this type to place, has to be in the range."
            onChange={isChecked => meta.set('densityChecked', isChecked)}
          />
          <AttributeValueSlider
            value={valuer.get('density', Defaults.DENSITY_DEFAULT)}
            disabled={isDensityDisabled}
            onShuffle={() => valuer.set('density', random.randomDensity(true))}
            onRestore={() => valuer.set('density', Defaults.DENSITY_DEFAULT)}
            sliderProps={{
              min: Defaults.DENSITY_MIN,
              max: Defaults.DENSITY_MAX,
              step: 0.01,
            }}
            onChange={value => valuer.set('density', value)}
          />
        </Row>
        {/*</editor-fold>*/}

        {/*<editor-fold desc="Attribute: Altitude">*/}
        <Form.Group
          as={Row}
          className={cn('mb-2 checkbox-align', {'text-muted-deep': isAltitudeDisabled})}>
          <PropertyCheckboxLabel
            style={{top: 5}}
            caption="Altitude:"
            checked={meta.data.altitudeChecked}
            disabled={isDisabled}
            undefinedSetter={[valuer, 'altitude', [Defaults.ALTITUDE_MIN_DEFAULT, Defaults.ALTITUDE_MAX_DEFAULT]]}
            tooltip="The min and max altitudes at which this object is
										placed, in meters. 0 means water level, negative values
										might make sense for certain objects like reeds or rocks
										that are placed underwater."
            onChange={isChecked => meta.set('altitudeChecked', isChecked)}
          />
          {/*<editor-fold desc="Input control">*/}
          <AttributeRangeValue
            min={valuer.get('altitude.0', Defaults.ALTITUDE_MIN_DEFAULT)}
            max={valuer.get('altitude.1', Defaults.ALTITUDE_MAX_DEFAULT)}
            disabled={isAltitudeDisabled}
            onShuffle={() => valuer.overwrite('altitude', random.randomAltitude())}
            onRestore={() => {
              valuer.overwrite('altitude', [
                Defaults.ALTITUDE_MIN_DEFAULT,
                Defaults.ALTITUDE_MAX_DEFAULT,
              ]);
            }}
            sliderProps={{min: Defaults.ALTITUDE_MIN, max: Defaults.ALTITUDE_MAX}}
            onChange={(min, max) => valuer.overwrite('altitude', [min, max])}
          />
          {/*</editor-fold>*/}
        </Form.Group>
        {/*</editor-fold>*/}

        {/*<editor-fold desc="Attribute: Angle">*/}
        <Form.Group
          as={Row}
          className={cn('mb-2 checkbox-align', {'text-muted-deep': isAngleDisabled})}>
          <PropertyCheckboxLabel
            style={{top: 5}}
            caption="Angle:"
            checked={meta.data.angleChecked}
            disabled={isDisabled}
            undefinedSetter={[valuer, 'angle', [Defaults.ANGLE_MIN_DEFAULT, Defaults.ANGLE_MAX_DEFAULT]]}
            tooltip="The min and max slope angles in degrees at which this object
											is placed. Values range from 0 (flat), to 60 (very steep). Negative
											values of up to -10 are allowed to ensure you get max density at 0
											degrees, as there is a transition zone."
            onChange={isChecked => meta.set('angleChecked', isChecked)}
          />
          <AttributeRangeValue
            min={valuer.get('angle.0', Defaults.ANGLE_MIN_DEFAULT)}
            max={valuer.get('angle.1', Defaults.ANGLE_MAX_DEFAULT)}
            disabled={isAngleDisabled}
            allowShuffle
            allowRestore
            onShuffle={() => valuer.overwrite('angle', random.randomAngle())}
            onRestore={() => {
              valuer.overwrite('angle', [
                Defaults.ANGLE_MIN_DEFAULT,
                Defaults.ANGLE_MAX_DEFAULT,
              ]);
            }}
            sliderProps={{min: Defaults.ANGLE_MIN, max: Defaults.ANGLE_MAX}}
            onChange={(min, max) => valuer.overwrite('angle', [min, max])}
          />
        </Form.Group>
        {/*</editor-fold>*/}

        {/*<editor-fold desc="Attribute: Humidity">*/}
        <Form.Group
          as={Row}
          className={cn('mb-2 checkbox-align', {'text-muted-deep': isHumidityDisabled})}>
          <PropertyCheckboxLabel
            style={{top: 5}}
            caption="Humidity:"
            checked={meta.data.humidityChecked}
            disabled={isDisabled}
            undefinedSetter={[valuer, 'humidity', [Defaults.HUMIDITY_MIN_DEFAULT, Defaults.HUMIDITY_MAX_DEFAULT]]}
            tooltip="The min and max humidity at which this detail object is placed,
											humidity is close to 1 near rivers and forests, and 0 in other places."
            onChange={isChecked => meta.set('humidityChecked', isChecked)}
          />
          <AttributeRangeValue
            min={valuer.get('humidity.0', Defaults.HUMIDITY_MIN_DEFAULT)}
            max={valuer.get('humidity.1', Defaults.HUMIDITY_MAX_DEFAULT)}
            disabled={isHumidityDisabled}
            onShuffle={() => valuer.overwrite('humidity', random.randomHumidity())}
            onRestore={() => {
              valuer.overwrite('humidity', [
                Defaults.HUMIDITY_MIN_DEFAULT,
                Defaults.HUMIDITY_MAX_DEFAULT,
              ]);
            }}
            sliderProps={{
              min: Defaults.HUMIDITY_MIN, max: Defaults.HUMIDITY_MAX, step: 0.01,
            }}
            onChange={(min, max) => valuer.overwrite('humidity', [min, max])}
          />
        </Form.Group>
        <hr className="mt-2 mb-2"/>
        <LinkButton
          className="ml-0"
          title="Randomize all values except for the disabled ones"
          disabled={props?.disabled}
          onClick={() => {
            const shuffled = {...random.randomObjectOverridePrototype()};
            !meta.data.densityChecked && delete shuffled.density;
            !meta.data.altitudeChecked && delete shuffled.altitude;
            !meta.data.angleChecked && delete shuffled.angle;
            !meta.data.humidityChecked && delete shuffled.humidity;
            
            Object.keys(shuffled).length && valuer.setAll(shuffled);
          }}>
          <IconShuffle/> Randomize all
        </LinkButton>

        <LinkButton
          className="ml-2"
          title="Restore all values except for the disabled ones"
          disabled={props?.disabled}
          onClick={() => {
            const original = {...random.defaultObjectOverridePrototype()};
            !meta.data.densityChecked && delete original.density;
            !meta.data.altitudeChecked && delete original.altitude;
            !meta.data.angleChecked && delete original.angle;
            !meta.data.humidityChecked && delete original.humidity;
            
            Object.keys(original).length && valuer.setAll(original);
          }}>
          <IconRestore/> Restore all
        </LinkButton>
        {/*</editor-fold>*/}</div>
    </>
  );
};

// Properties validation
ObjectOverridePrototype.propTypes = {
  type: PropTypes.oneOf(objects).isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  initialValues: PropTypes.exact({
    density: PropTypes.number,
    altitude: PropTypes.arrayOf(PropTypes.number),
    angle: PropTypes.arrayOf(PropTypes.number),
    humidity: PropTypes.arrayOf(PropTypes.number),
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default ObjectOverridePrototype;
