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
import {Col, Form, Row} from 'react-bootstrap';

// elemental components
import Select, {Option} from '~/components/ui/Select';

// redux
import {useAppSelector} from '~redux/hooks';

// utils
import {DEFAULT_SEASONS} from '~/utils/defaults';

// types
import type {$Keys} from 'utility-types';
import type {Season} from '~/utils/seasons.types';
import {Json} from '~/types/json.types';

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

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
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
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  const renderSelectOptions = React.useCallback((): Json[] => {
    return DEFAULT_SEASONS
      .map(v => ({label: v, value: v}));
  }, []);

  const toTemplateText = (): string => {
    const visualSetupIdProp = attributes.visualSetupId?.trim()
      ? ` visual_setup_id="${attributes.visualSetupId?.trim()}"` : ''
    return !attributes.enabled
      ? ''
      : `<starting_conditions season_id="${attributes.seasonId}"${visualSetupIdProp}/>`;
  };

  return (
    <div className={cn('mb-2', {'text-muted': !attributes.enabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10">
          Starting conditions
          <div className="text-size-xxs text-muted mt-1">
            Defines the conditions when game is started.
          </div>
        </Col>
        <Col xs="2" className="text-right">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`category-switch-${nanoid(5)}`}
            label=""
            checked={attributes.enabled}
            onChange={e => setAttribute('enabled', e.target.checked)}
          />
        </Col>
      </Row>
      <Row className="mb-1 mt-3">
        <Col xs="2">
            <span className="position-relative" style={{top: 9}}>
              Season
            </span>
        </Col>
        <Col xs="6">
          <Select id={`starting_conditions-${nanoid(5)}`}
                  isDisabled={!attributes.enabled}
                  menuPortalTarget={document.body}
                  isSearchable={false}
                  placeholder="Choose season"
                  value={{label: attributes.seasonId, value: attributes.seasonId}}
                  options={renderSelectOptions()}
                  onChange={(option: Option | any, {action}): void => {
                    if (action === 'select-option' && option) {
                      setAttribute('seasonId', option.value);
                    }
                  }}/>
        </Col>
      </Row>
      <Row className="mb-1 mt-3">
        <Col xs="2">
            <span className="position-relative" style={{top: 9}}>
              Visual Setup
            </span>
        </Col>
        <Col xs="6">
          <Form.Control
            type="text"
            disabled={!attributes.enabled}
            className="pull-right"
            aria-disabled={!attributes.enabled}
            id={`visual_setup_id-${nanoid(5)}`}
            placeholder="e.g., WinterSnow"
            value={attributes.visualSetupId}
            onChange={e => setAttribute('visualSetupId', e.target.value.replace(/['"]+/ig, ``))}
          />
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
