/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import {Col, Row} from 'react-bootstrap';

// elemental components
import TextInput from '~/components/ui/TextInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import PanelToolbar from '~/components/environment/PanelToolbar';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';

// utils
import useValues from '~/hooks/use-values';
import {randomSeasonName} from '~/utils/random';
import {cloneObject, isObject} from '~/helpers/object';
import {DEFAULT_SEASONS, STARTING_CONDITIONS} from '~/utils/defaults';

// parsers
import {toStartingConditionTemplate} from '~/utils/parser/templates-general';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/scenario/reducers';

// types
import {scenario} from '~/data/scenario/parser/types';

/** StartingCondition `props` type */
interface Props {
  disabled?: boolean;
  initialValues?: scenario.StartingConditions;

  onChange?(template: string): void;
}

/** StartingCondition functional component */
const StartingCondition = (props: Props) => {
  const dispatch = useAppDispatch();

  const valuer = useValues<scenario.StartingConditions>(props?.initialValues ?? STARTING_CONDITIONS as scenario.StartingConditions);

  const [checked, setChecked] = React.useState<boolean>(!(props?.disabled ?? true));

  const reduxState = useAppSelector(({scenario}) => scenario.values?.startingConditions) as scenario.StartingConditions;

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      valuer.setAll(cloneObject(STARTING_CONDITIONS));
      dispatch(clearProperty('startingConditions'));
    } else if (isObject(reduxState)) {
      setChecked(true);
      valuer.setAll(cloneObject(reduxState));
      dispatch(clearProperty('startingConditions'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    props?.onChange?.(toStartingConditionTemplate(valuer.data, checked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, valuer.data]);

  return (
    <div className={cn('mb-2 checkbox-align', {'text-muted-deep': !checked})}>
      <PanelToolbar
        checked={checked}
        heading="Starting conditions"
        checkboxPosition="right"
        description="Defines the conditions when game is started."
        onCheckboxChange={setChecked}
        value=""/>

      <Row className="mt-2">
        <PropertyLabel disabled={!checked} caption="Season"/>
        <AttributeSelect
          className="w-75"
          colProps={{sm: 6}}
          disabled={!checked}
          selectProps={{isSearchable: false}}
          options={DEFAULT_SEASONS.map(value => ({label: value, value}))}
          value={valuer.get('seasonId', 'Spring')}
          onSelect={option => valuer.set('seasonId', option.value)}
          allowShuffle
          onShuffle={() => valuer.set('seasonId', randomSeasonName())}
        />
      </Row>
      <Row className="mt-2">
        <PropertyLabel disabled={!checked} caption="Visual Setup"/>
        <Col xs="6">
          <TextInput
            caseType="PASCAL_CASE"
            disabled={!checked}
            value={valuer.get('visualSetupId', '')}
            placeholder="e.g., WinterSnow"
            allowClear
            onChange={value => valuer.set('visualSetupId', value)}/>
        </Col>
      </Row>
    </div>
  );
};

// Properties validation
StartingCondition.propTypes = {
  disabled: PropTypes.bool,
  initialValues: PropTypes.exact({
    seasonId: PropTypes.oneOf(DEFAULT_SEASONS).isRequired,
    visualSetupId: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

export default StartingCondition;
