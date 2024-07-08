/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import {capitalCase} from 'change-case';
import {Col, InputGroup, Row} from 'react-bootstrap';

// elemental components
import TextInput from '~/components/ui/TextInput';
import LinkButton from '~/components/ui/LinkButton';
import NumberInput from '~/components/ui/NumberInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import AttributeCheckbox from '~/components/ui/elements/AttributeCheckbox';
import AttributeRangeValue from '~/components/ui/elements/AttributeValueRange';

// icons
import {IconShuffle} from '~/components/icons/app';

// utils
import * as location from '~/utils/location';
import {presetOptions} from '~/data/environments/builtin';
import {
  LOCATION_LAKES_MAX,
  LOCATION_LAKES_MIN,
  LOCATION_MAP_MAX,
  LOCATION_MAP_MIN,
  LOCATION_POSITION_MAX,
  LOCATION_POSITION_MIN,
} from '~/utils/scenario/defaults';

// hooks
import useValues from '~/hooks/use-values';

// parsers
import {filterEmpty} from '~/utils/parser/templates';
import {toLocationTemplate} from '~/utils/parser/templates-location';

// redux
import {useAppSelector} from '~redux/hooks';

// types
import type {Json} from '~/types/json.types';
import type {scenario} from '~/data/scenario/parser/types';

export interface Props {
  disabled?: boolean;
  initialValues?: scenario.Location;

  onChange?(values: LocationAttributes): void;

  onValuesChange?(values: scenario.Location): void;

  onTemplate?(template: string): void;
}

export interface LocationAttributes {
  disabled?: boolean;
  positionChecked?: boolean;
  riverChecked?: boolean;
  lakesChecked?: boolean;
}

/** Location functional component */
const Location = (props: Props) => {
  const environmentName = useAppSelector(({environment}) => environment.name);
  const environmentVar = `{{environment}}`;

  const [position] = React.useState<scenario.LocationPosition>(location.randomPosition());

  const valuer = useValues<scenario.Location>({...(props?.initialValues ?? {})} as unknown as scenario.Location);
  const meta = useValues<LocationAttributes>({
    disabled: props?.disabled ?? false,
    positionChecked: !valuer.is('position', undefined),
    riverChecked: !valuer.is('river', undefined),
    lakesChecked: !valuer.is('lakes', undefined),
  });

  // Reflect state changes
  React.useEffect(() => {
    'function' === typeof props.onChange && props.onChange(meta.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.data]);

  // Reflect prop changes
  React.useEffect(() => {
    meta.set('disabled', props?.disabled, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.disabled]);

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    !meta.data.positionChecked && (changeValues.position = undefined);
    !meta.data.riverChecked && (changeValues.river = undefined);
    !meta.data.lakesChecked && (changeValues.lakes = undefined);

    const filteredValues = filterEmpty(changeValues);
    'function' === typeof props?.onTemplate && props?.onTemplate(toLocationTemplate(filteredValues));
    'function' === typeof props?.onValuesChange && props?.onValuesChange(filteredValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    meta.data.disabled, valuer.data,
    meta.data.positionChecked,
    meta.data.riverChecked,
    meta.data.lakesChecked,
  ]);

  const builtinPresets = presetOptions.filter(v => v.label === 'General')?.[0]?.options;

  const environments = [...builtinPresets, {
    label: capitalCase(environmentName),
    value: environmentVar,
    description: 'Custom tailored environment for the free play scenario',
  }];

  return (
    <div className={cn('mb-2', {
      'text-muted-deep': meta.data.disabled,
    }, 'checkbox-align')}>
      <Row className="mb-2">
        <PropertyLabel
          caption="Name"
          tooltip="ID of the environment, will be used in strings file"
        />
        <Col sm="8">
          <InputGroup>
            <TextInput
              caseType="SNAKE_CASE"
              disabled={meta.data.disabled}
              value={valuer.get('id', 'eurasia')}
              maxLength={22}
              inputProps={{
                className: 'd-inline-block position-relative',
                style: {maxWidth: 280},
              }}
              placeholder="e.g., chakwal"
              allowShuffle
              onShuffle={() => valuer.set('id', location.randomName().slug)}
              onChange={name => valuer.set('id', name)}/>
          </InputGroup>
        </Col>
      </Row>
      <Row className="mb-2">
        <PropertyLabel
          caption="Seed"
          tooltip="Used to create a map/Environments"
        />
        <Col sm="8">
          <div className="float-left">
            <NumberInput
              maxLength={8}
              min={0}
              max={99999999}
              disabled={meta.data.disabled}
              placeholder="e.g. 11111111"
              value={valuer.data.seed}
              inputProps={{
                style: {width: 150},
                className: 'd-inline-block position-relative',
              }}
              onChange={value => valuer.set('seed', value)}
              shuffle={true}
              onShuffle={() => valuer.set('seed', location.randomSeed())}
            />
          </div>
          <div className="float-left mt-1">
            <LinkButton
              className="text-size-sm position-relative"
              title="Set all as 0" style={{top: -2}}
              disabled={meta.data.disabled}
              onClick={() => valuer.set('seed', 0)}>
              0x8
            </LinkButton>
            <LinkButton
              className="mr-2 text-size-sm position-relative"
              title="Set all as 1" style={{top: -2}}
              disabled={meta.data.disabled}
              onClick={() => valuer.set('seed', 11111111)}>
              1x8
            </LinkButton>
            <LinkButton
              className="mr-2 text-size-sm position-relative"
              title="Set all as 9" style={{top: -2}}
              disabled={meta.data.disabled}
              onClick={() => valuer.set('seed', 99999999)}>
              9x8
            </LinkButton>
          </div>
          <div className="clearfix"></div>
        </Col>
      </Row>
      <Row>
        <PropertyLabel
          caption="Environment"
          tooltip="Reference to environment, custom environmnts must
          be placed in subfolder rootOtScenarioFile/Environments"
        />
        <Col sm="8">
          <TextInput
            caseType="SNAKE_CASE"
            disabled={meta.data.disabled}
            value={valuer.data.environment}
            maxLength={40}
            inputProps={{
              className: 'd-inline-block position-relative',
              style: {maxWidth: 300},
            }}
            placeholder="e.g., custom_environment"
            allowShuffle
            onShuffle={() => {
              valuer.set('environment', location.randomEnvironment([environmentVar]));
            }}
            onChange={value => valuer.set('environment', value)}/>
          <ul className="list-unstyled list-inline mb-0 mt-1">
            {environments.map((v: Json) => (
              <li
                className="list-inline-item text-size-xxs"
                key={`environment_key_${v.value}`}>
                {!meta.data.disabled ? (
                  <a href="/" title={v.description}
                     data-value={v.value.replace('general/', '')}
                     onClick={e => {
                       e.preventDefault();
                       // @ts-ignore
                       valuer.set('environment', e.target.getAttribute('data-value'));
                     }}>{v.label}</a>
                ) : (
                  <span className="text-muted cursor-default">{v.label}</span>
                )}
              </li>
            ))}
          </ul>
        </Col>
      </Row>
      <Row className="mb-2">
        <PropertyLabel
          caption="Location"
          tooltip="Only affects the marker position on the minimap!
          this is not the starting position of the settlement see position for that"
        />
        <AttributeRangeValue
          colProps={{sm: 8}}
          disabled={meta.data.disabled}
          min={valuer.get('mapLocation.0', 0)}
          max={valuer.get('mapLocation.1', 0)}
          sliderProps={{min: LOCATION_MAP_MIN, max: LOCATION_MAP_MAX, step: 0.001}}
          allowRestore={false}
          allowShuffle
          onShuffle={() => {
            valuer.overwrite('mapLocation', location.randomCoordinates());
          }}
          onChange={(min, max) => valuer.overwrite('mapLocation', [min, max])}
        />
      </Row>
      <Row className="mb-2">
        <PropertyCheckboxLabel
          caption="Position"
          tooltip="Sets the starting position of the
          settlement, possible range is (0, <size>*512-1)"
          checked={meta.data.positionChecked}
          disabled={meta.data.disabled}
          onChange={isChecked => meta.set('positionChecked', isChecked)}
          undefinedSetter={[valuer, 'position', position]}
        />
        <AttributeRangeValue
          colProps={{sm: 8}}
          disabled={meta.data.disabled || !meta.data.positionChecked}
          min={valuer.get('position.0', position[0])}
          max={valuer.get('position.1', position[1])}
          sliderProps={{min: LOCATION_POSITION_MIN, max: LOCATION_POSITION_MAX, step: 0}}
          allowShuffle
          onShuffle={() => {
            valuer.set('position', location.randomPosition());
          }}
          allowRestore={false}
          onChange={(min, max) => valuer.overwrite('position', [min, max])}
        />
      </Row>
      <Row className="mb-2">
        <PropertyCheckboxLabel
          checked={meta.data.riverChecked}
          disabled={meta.data.disabled}
          onChange={isChecked => meta.set('riverChecked', isChecked)}
          caption="River"
          tooltip="Determines if rivers are created"
          undefinedSetter={[valuer, 'river', true]}
        />
        <AttributeCheckbox
          disabled={meta.data.disabled || !meta.data.riverChecked}
          caption="Display river on map?"
          checked={valuer.data.river}
          onChange={isChecked => valuer.set('river', isChecked)}/>
      </Row>
      <Row>
        <PropertyCheckboxLabel
          checked={meta.data.lakesChecked}
          disabled={meta.data.disabled}
          onChange={isChecked => meta.set('lakesChecked', isChecked)}
          caption="Lakes"
          tooltip="Number of lakes, no influence on size, lakes might intersect"
          undefinedSetter={[valuer, 'lakes', 1]}
        />
        <Col sm="8">
          <NumberInput
            disabled={meta.data.disabled || !meta.data.lakesChecked}
            value={valuer.get('lakes', 1)}
            min={LOCATION_LAKES_MIN} max={LOCATION_LAKES_MAX}
            maxLength={LOCATION_LAKES_MAX.toString().length}
            inputProps={{
              className: 'd-inline-block position-relative',
              style: {maxWidth: 80},
            }}
            placeholder="1"
            shuffle
            onShuffle={() => valuer.set('lakes', location.randomLakes())}
            allowRestore
            onRestore={() => valuer.set('lakes', 1)}
            onChange={value => valuer.set('lakes', value)}/>
        </Col>
      </Row>
      <hr className="mt-2 mb-2"/>
      <div>
        <LinkButton
          className="ml-0"
          title="Randomize all values except for the disabled ones"
          disabled={meta.data.disabled}
          onClick={() => {
            const values = location.randomizeLocation([environmentVar]);
            !meta.data.positionChecked && delete values.position;
            !meta.data.riverChecked && delete values.river;
            !meta.data.lakesChecked && delete values.lakes;

            valuer.setAll({...values});
          }}>
          <IconShuffle/> Randomize values
        </LinkButton>
      </div>
    </div>
  );
};

// Properties validation
Location.propTypes = {
  disabled: PropTypes.bool,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    seed: PropTypes.number,
    environment: PropTypes.string,
    mapLocation: PropTypes.arrayOf(PropTypes.number),
    position: PropTypes.arrayOf(PropTypes.number),
    river: PropTypes.bool,
    lakes: PropTypes.number,
  }),
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
  onChange: PropTypes.func,
};

export default Location;
