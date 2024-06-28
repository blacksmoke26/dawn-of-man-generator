/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-27
 * @version 2.4
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {capitalCase} from 'change-case';
import {Col, Row} from 'react-bootstrap';

// elemental components
import Accordion from '~/components/ui/Accordion';
import NumberInput from '~/components/ui/NumberInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import RandomizeValuesButton from '~/components/ui/RandomizeValuesButton';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {techEntities} from '~/utils/entities';
import {randomArmorRatio, randomArray, randomShieldRatio} from '~/utils/random';
import {ARMOR_RATIO_MAX, ARMOR_RATIO_MIN, SHIELD_RATIO_MAX, SHIELD_RATIO_MIN} from '~/utils/defaults';

// parsers
import {filterEmpty} from '~/utils/parser/templates';

// types
import type {RaidWaveParameters} from '~/types/action.types';

export interface Props {
  disabled?: boolean;
  initialValues?: RaidWaveParameters;

  onValuesChange?(values: Partial<RaidWaveParameters>): void;
}

export interface RaiderWaveAttributesProps {
  disabled: boolean;
  disabledTechsCheckbox: boolean;
}

const RaiderWave = (props: Props = {}) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    onValuesChange() {
    },
  }, props);

  const valuer = useValues<Partial<RaidWaveParameters>>(
    merge({
      shieldRatio: randomShieldRatio(),
      armorRatio: randomArmorRatio(),
      disabledTechs: undefined,
    }, props?.initialValues || {}),
  );

  const state = useValues<RaiderWaveAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledTechsCheckbox: !valuer.is('disabledTechs', undefined),
  });

  React.useEffect(() => {
    const changedValues = {...valuer.data};
    !state.data.disabledTechsCheckbox && (changedValues.disabledTechs = undefined);

    newProps?.onValuesChange(filterEmpty(changedValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, valuer.data,
    state.data.disabledTechsCheckbox,
  ]);

  // Reflect prop changes
  React.useEffect(() => {
    state.set('disabled', props?.disabled, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.disabled]);

  const isDisabled = state.data.disabled;

  return (
    <div className={cn('mt-0 checkbox-align', {'text-muted-deep': newProps.disabled})}>
      <Row className="mb-3 mt-2">
        <PropertyLabel caption="Shield ratio"/>
        <Col sm="4">
          <NumberInput
            maxLength={2}
            decimals={2}
            min={SHIELD_RATIO_MIN}
            max={SHIELD_RATIO_MAX}
            disabled={isDisabled}
            placeholder="e.g. 1"
            value={valuer.get('shieldRatio', 1)}
            onChange={value => valuer.set('shieldRatio', value)}
            shuffle
            onShuffle={() => valuer.set('shieldRatio', +randomShieldRatio())}
            allowRestore
            onRestore={() => valuer.set('shieldRatio', 1)}
          />
        </Col>
      </Row>
      <Row className="mb-3 mt-2">
        <PropertyLabel caption="Armor ratio"/>
        <Col sm="4">
          <NumberInput
            maxLength={2}
            decimals={2}
            min={ARMOR_RATIO_MIN}
            max={ARMOR_RATIO_MAX}
            disabled={isDisabled}
            placeholder="e.g. 1"
            value={valuer.get('armorRatio', 1)}
            onChange={value => valuer.set('armorRatio', value)}
            shuffle
            onShuffle={() => valuer.set('armorRatio', +randomArmorRatio())}
            allowRestore
            onRestore={() => valuer.set('armorRatio', 1)}
          />
        </Col>
      </Row>
      <Accordion
        noBodyPad={true}
        noCard={true}
        header="Optional parameters"
        eventKey="optional_parameters">
        <Row className="mt-3">
          <PropertyCheckboxLabel
            caption="Disabled techs"
            checked={state.data.disabledTechsCheckbox}
            disabled={isDisabled}
            onChange={isChecked => state.set('disabledTechsCheckbox', isChecked)}
          />
          <AttributeSelect
            className="w-75"
            colProps={{sm: 9}}
            disabled={isDisabled || !state.data.disabledTechsCheckbox}
            options={techEntities.map(value => ({label: capitalCase(value), value}))}
            value={valuer.get<string[]>('disabledTechs', [])?.map(value => ({label: capitalCase(value), value})) || []}
            selectProps={{isSearchable: true, isMulti: true, isClearable: false}}
            onChange={(option, {action}) => {
              if (['select-option', 'remove-value', 'clear'].includes(action) && Array.isArray(option)) {
                valuer.overwrite('disabledTechs', option?.map(({value}) => value) || []);
              }
            }}
            allowShuffle
            onShuffle={() => {
              valuer.set('disabledTechs', randomArray(techEntities, 4, true));
            }}
            allowClear
            onClear={() => valuer.empty('disabledTechs')}
          />
        </Row>
      </Accordion>

      <RandomizeValuesButton
        disabled={isDisabled}
        onClick={() => {
          valuer.set('shieldRatio', randomShieldRatio());
          valuer.set('armorRatio', randomArmorRatio());
          state.data.disabledTechsCheckbox
          && valuer.set('disabledTechs', randomArray(techEntities, 4, true));
        }}
      />
    </div>
  );
};


// Properties validation
RaiderWave.propTypes = {
  disabled: PropTypes.bool,
  initialValues: PropTypes.exact({
    shieldRatio: PropTypes.number,
    armorRatio: PropTypes.number,
    disabledTechs: PropTypes.arrayOf(PropTypes.oneOf(techEntities)),
  }),
  onValuesChange: PropTypes.func,
};

export default RaiderWave;
