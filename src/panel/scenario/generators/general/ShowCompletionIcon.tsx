/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import {Form} from 'react-bootstrap';

// elemental components
import PanelToolbar from '~/components/environment/PanelToolbar';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/scenario/reducers';

// parsers
import {toShowCompletionIconTemplate} from '~/utils/parser/templates-general';

/** ShowCompletionIcon `props` type */
interface Props {
  disabled?: boolean,
  initialValues?: {
    value: boolean;
  };

  onChange?(template: string): void;
}

/** ShowCompletionIcon functional component */
const ShowCompletionIcon = (props: Props) => {
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState<boolean>(props?.initialValues?.value ?? false);
  const [checked, setChecked] = React.useState<boolean>(!(props?.disabled ?? true));

  const reduxState = useAppSelector(({scenario}) => scenario.values?.showCompletionIcon) as null | boolean | undefined;

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setValue(false);
      dispatch(clearProperty('showCompletionIcon'));
    } else if ('boolean' === typeof reduxState) {
      setChecked(true);
      setValue(reduxState);
      dispatch(clearProperty('showCompletionIcon'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    props?.onChange?.(toShowCompletionIconTemplate(value, checked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, checked]);

  return (
    <div className={cn('mb-2', {'text-muted-deep': !checked}, 'checkbox-align')}>
      <PanelToolbar
        checked={checked}
        heading="Show Completion Icon"
        checkboxPosition="right"
        description="Defines whether a small icon will appear next to the scenario indicating it's completion status."
        onCheckboxChange={state => setChecked(state)}
        value={<span className={cn({'text-line-through': !checked})}>{value ? 'Yes' : 'No'}</span>}
        disabled={!checked}/>

      <Form.Check
        type="switch"
        className="pull-right"
        disabled={!checked}
        id="show_completion_icon"
        label="Display icon?"
        checked={value}
        onChange={e => setValue(e.target.checked)}
      />
    </div>
  );
};

// Properties validation
ShowCompletionIcon.propTypes = {
  disabled: PropTypes.bool,
  initialValues: PropTypes.exact({
    value: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

export default ShowCompletionIcon;
