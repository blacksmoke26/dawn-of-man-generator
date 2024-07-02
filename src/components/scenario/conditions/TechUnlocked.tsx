// noinspection HtmlUnknownAttribute

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-gentechstor
 * @since 2020-08-29
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {Row} from 'react-bootstrap';
import {capitalCase} from 'change-case';

// elemental components
import PropertyLabel from '~/components/ui/PropertyLabel';
import ConditionHeader from './../elements/ConditionHeader';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {randomArray, randomIntMinMax} from '~/utils/random';
import {techEntities} from '~/utils/entities';
import {defaultsParams} from '~/utils/condition';
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';

// types
import type {ConditionAttributesProps, ConditionTechUnlocked, ConditionProps} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionTechUnlocked> {
}

export interface TechUnlockedAttributes extends ConditionAttributesProps {
}

const CONDITION_NAME: string = 'TechUnlocked';

const TechUnlocked = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const valuer = useValues<Partial<ConditionTechUnlocked>>(
    merge(defaultsParams?.techUnlocked || {}, props?.initialValues || {}),
  );

  const state = useValues<TechUnlockedAttributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
  });

  React.useEffect(() => {
    const changeValues = {...valuer.data};

    if (changeValues.techs?.length === 1 ) {
      changeValues.tech = changeValues.techs[0];
      changeValues.techs = undefined;
    } else {
      changeValues.tech = undefined;
    }

    newProps?.onTemplate(toConditionTemplate('TechUnlocked', changeValues, !state.data.enabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data.enabled, valuer.data]);

  // Reflect state changes
  React.useEffect(() => {
    newProps.onChange(state.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data]);

  // Reflect prop changes
  React.useEffect(() => {
    state.set('enabled', props?.enabled, true);
    state.set('disabledCheckbox', props?.disabledCheckbox, true);
    state.set('expanded', props?.expanded, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.enabled, props?.disabledCheckbox, props?.expanded]);

  const isDisabled = state.data.disabledCheckbox || !state.data.enabled;

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <ConditionHeader
        caption={CONDITION_NAME} showCheckbox={newProps.showCheckbox}
        enabled={state.data.enabled}
        onEnabled={(isEnabled: boolean) => state.set('enabled', isEnabled)}
        disabledCheckbox={state.data.disabledCheckbox}
        removeIcon={newProps.removeIcon}
        onRemoveClick={newProps.onRemoveClick}
        onExpandedClick={(isExpended: boolean) => state.set('expanded', isExpended)}
        expanded={state.data.expanded}/>
      {state.data.expanded && (
        <>
          <Row className="mb-2 mt-2">
            <PropertyLabel caption="Tech(s)"/>
            <AttributeSelect
              className="w-75"
              colProps={{sm: 10}}
              disabled={isDisabled}
              options={techEntities.map(value => ({label: capitalCase(value), value}))}
              value={valuer.get<string[]>('techs', [])?.map(value => ({label: capitalCase(value), value})) || []}
              selectProps={{isSearchable: true, isMulti: true, isClearable: false}}
              onChange={(option, {action}) => {
                if (['select-option', 'remove-value', 'clear'].includes(action) && Array.isArray(option)) {
                  valuer.overwrite('techs', option?.map(({value}) => value) || []);
                }
              }}
              allowClear
              onClear={() => valuer.overwrite('techs', [])}
              allowShuffle
              onShuffle={() => {
                valuer.set('techs', [...(new Set<string>(randomArray(techEntities, randomIntMinMax(1, 5)) as string[]) as unknown as string[])]);
              }}
            />
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
TechUnlocked.propTypes = {
  /*enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  techs: PropTypes.oneOf(ERAS),*/
};

export default TechUnlocked;
