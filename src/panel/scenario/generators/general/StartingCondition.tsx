/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {Col, Row} from 'react-bootstrap';
import uniqueRandomArray from 'unique-random-array';

// elemental components
import TextInput from '~/components/ui/TextInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import PanelToolbar from '~/components/environment/PanelToolbar';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';

// redux
import {useAppSelector} from '~redux/hooks';

// utils
import {DEFAULT_SEASONS} from '~/utils/defaults';

// parsers
import {toStartingConditionTemplate} from '~/utils/parser/templates-general';

// types
import type {Season} from '~/utils/seasons.types';

/** StartingCondition `props` type */
interface Attributes {
  enabled: boolean;
  seasonId: Season;
  visualSetupId: string;
}

/** StartingCondition `props` type */
interface Props {
  enabled?: boolean;
  seasonId?: Season;
  visualSetupId?: string;

  onChange?(template: string, values: Attributes): void;
}

/** StartingCondition functional component */
const StartingCondition = (props: Props) => {
  props = merge({
    enabled: true,
    seasonId: 'Spring',
    visualSetupId: '',
    onChange: () => {
    },
  }, props);

  const startingConditionAttribute = useAppSelector(({scenario}) => scenario.values?.startingCondition);

  const [attributes, setAttributes] = React.useState<Attributes>({
    seasonId: props.seasonId as Season,
    enabled: props.enabled as boolean,
    visualSetupId: props.visualSetupId as string,
  });

  const setAttribute = <T = any>(name: keyof Attributes, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = startingConditionAttribute ?? null;
    const isEnabled = !!extValue;
    setAttribute<boolean>('enabled', isEnabled);

    if (isEnabled) {
      setAttribute<Season>('seasonId', extValue?.seasonId as Season);
    }
  }, [startingConditionAttribute]);

  // Reflect state changes
  React.useEffect(() => {
    const {enabled, ...attrs} = attributes;
    typeof props.onChange === 'function' && props.onChange(
      toStartingConditionTemplate(attrs, enabled), attributes,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  return (
    <div className={cn('mb-2 checkbox-align', {'text-muted-deep': !attributes.enabled})}>
      <PanelToolbar
        checked={attributes.enabled}
        heading="Starting conditions"
        checkboxPosition="right"
        description="Defines the conditions when game is started."
        onCheckboxChange={state => setAttribute('enabled', state)}
        value=""
        disabled={!attributes.enabled}/>

      <Row className="mb-1 mt-3">
        <PropertyLabel disabled={!attributes.enabled} caption="Season"/>
        <AttributeSelect
          className="w-75"
          colProps={{sm: 6}}
          disabled={!attributes.enabled}
          selectProps={{isSearchable: false}}
          options={DEFAULT_SEASONS.map(value => ({label: value, value}))}
          value={attributes?.seasonId}
          onSelect={option => setAttribute('seasonId', option.value)}
          allowShuffle
          onShuffle={() => {
            setAttribute('seasonId', uniqueRandomArray(DEFAULT_SEASONS)());
          }}
        />
      </Row>
      <Row className="mb-1 mt-3">
        <PropertyLabel disabled={!attributes.enabled} caption="Visual Setup"/>
        <Col xs="6">
          <TextInput
            caseType="PASCAL_CASE"
            disabled={!attributes.enabled}
            value={attributes?.visualSetupId ?? ''}
            placeholder="e.g., WinterSnow"
            allowClear
            onChange={theValue => setAttribute('visualSetupId', theValue as string)}/>
        </Col>
      </Row>
    </div>
  );
};

// Properties validation
StartingCondition.propTypes = {
  value: PropTypes.bool,
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default StartingCondition;
