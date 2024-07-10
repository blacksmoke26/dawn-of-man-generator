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
import {toCustomSettlementNameAllowedTemplate} from '~/utils/parser/templates-general';

interface Props {
  disabled?: boolean,
  initialValues?: {
    value: boolean;
  };

  onChange?(template: string): void;
}

/** CustomSettlementNameAllowed functional component */
const CustomSettlementNameAllowed = (props: Props) => {
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState<boolean>(props?.initialValues?.value ?? false);
  const [checked, setChecked] = React.useState<boolean>(!(props?.disabled ?? true));

  const reduxState = useAppSelector(({scenario}) => scenario?.values?.customSettlementNameAllowed) as null | boolean | undefined;

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setValue(false);
      dispatch(clearProperty('customSettlementNameAllowed'));
    } else if ('boolean' === typeof reduxState) {
      setChecked(true);
      setValue(reduxState);
      dispatch(clearProperty('customSettlementNameAllowed'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    props?.onChange?.(toCustomSettlementNameAllowedTemplate(value, checked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, checked]);

  return (
    <div className={cn('mb-2', {'text-muted': !checked}, 'checkbox-align')}>
      <PanelToolbar
        checked={checked}
        heading="Custom Settlement Name"
				checkboxPosition="right"
        description="Determines if naming the settlement is an option on game start - unknown default name, where to set the name"
        onCheckboxChange={isChecked => setChecked(isChecked)}
				value={<span className={cn({'text-line-through': !checked})}>{value ? 'Yes' : 'No'}</span>}
        disabled={!checked}/>
      <Form.Check
        type="switch"
        className="pull-right"
        disabled={!checked}
        id="custom_settlement_name_allowed"
        label="Allowed?"
        checked={value}
        onChange={e => setValue(e.target.checked)}
      />
    </div>
  );
};

// Properties validation
CustomSettlementNameAllowed.propTypes = {
  disabled: PropTypes.bool,
  initialValues: PropTypes.exact({
    value: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

export default CustomSettlementNameAllowed;
