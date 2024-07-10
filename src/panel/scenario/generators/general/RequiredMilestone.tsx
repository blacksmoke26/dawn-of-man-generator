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
import NumberInput from '~/components/ui/NumberInput';
import PanelToolbar from '~/components/environment/PanelToolbar';

// utils
import {randomMilestone} from '~/utils/random';
import * as Defaults from '~/utils/scenario/defaults';

// parsers
import {toRequiredMilestoneTemplate} from '~/utils/parser/templates-general';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/scenario/reducers';

/** RequiredMilestone `props` type */
interface Props {
  disabled?: boolean,
  initialValues?: {
    value: number;
  };

  onChange?(template: string): void;
}

/** RequiredMilestone functional component */
const RequiredMilestone = (props: Props) => {
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState<number>(props?.initialValues?.value ?? Defaults.MILESTONES_DEFAULT);
  const [checked, setChecked] = React.useState<boolean>(!(props?.disabled ?? true));

  const reduxState = useAppSelector(({scenario}) => scenario.values?.requiredMilestones) as null | number | undefined;

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setValue(Defaults.MILESTONES_DEFAULT);
      dispatch(clearProperty('requiredMilestones'));
    } else if ('number' === typeof reduxState) {
      setChecked(true);
      setValue(reduxState);
      dispatch(clearProperty('requiredMilestones'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    props?.onChange?.(toRequiredMilestoneTemplate(value, checked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, checked]);

  return (
    <div className={cn('mb-2', {'text-muted-deep': !checked}, 'checkbox-align')}>
      <PanelToolbar
        checked={checked}
        heading="Required Milestones"
        checkboxPosition="right"
        description="Milestones needed for the scenario to count as
        completed, so that depending scenarios can be started."
        onCheckboxChange={isChecked => setChecked(isChecked)}
        value=""
        disabled={!checked}/>

      <div className="w-50">
        <NumberInput
          disabled={!checked}
          value={value}
          min={1}
          max={20}
          maxLength={2}
          placeholder="3"
          shuffle
          onShuffle={() => setValue(randomMilestone())}
          onChange={num => {
            num = +num;
            setValue(!num ? 0 : (num > 20 ? 20 : num));
          }}
        />
      </div>
    </div>
  );
};

// Properties validation
RequiredMilestone.propTypes = {
  disabled: PropTypes.bool,
  initialValues: PropTypes.exact({
    value: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

export default RequiredMilestone;
