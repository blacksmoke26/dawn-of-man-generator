// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';

// elemental components
import TextInput from '~/components/ui/TextInput';
import PanelToolbar from '~/components/environment/PanelToolbar';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/scenario/reducers';

// parsers
import {toRequiredScenarioTemplate} from '~/utils/parser/templates-general';

interface Props {
  disabled?: boolean,
  initialValues?: {
    value: string;
  };

  onChange?(template: string): void;
}

/** RequiredScenario functional component */
const RequiredScenario = (props: Props) => {
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState<string>(props?.initialValues?.value ?? 'the_long_march');
  const [checked, setChecked] = React.useState<boolean>(!(props?.disabled ?? true));

  const reduxState = useAppSelector(({scenario}) => scenario?.values?.requiredScenario) as null | string | undefined;

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setValue('the_long_march');
      dispatch(clearProperty('requiredScenario'));
    } else if ('string' === typeof reduxState) {
      setChecked(true);
      setValue(reduxState);
      dispatch(clearProperty('requiredScenario'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    props?.onChange?.(toRequiredScenarioTemplate(value, checked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, checked]);

  return (
    <div className={cn('mb-2', {'text-muted-deep': !checked}, 'checkbox-align')}>
      <PanelToolbar
        checked={checked}
        heading="Required Scenario"
        checkboxPosition="right"
        description="Specifies another scenario the user has to complete before playing this one."
        onCheckboxChange={isChecked => setChecked(isChecked)}
        value=""
        disabled={!checked}/>
      <div className="w-75">
        <TextInput
          caseType="SNAKE_CASE"
          disabled={!checked}
          value={value}
          maxLength={80}
          placeholder="e.g., the_long_march"
          onChange={changedValue => setValue(String(changedValue))}/>
      </div>
    </div>
  );
};

// Properties validation
RequiredScenario.propTypes = {
  disabled: PropTypes.bool,
  initialValues: PropTypes.exact({
    value: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

export default RequiredScenario;
