// noinspection HtmlUnknownAnchorTarget

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// types
import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {Form, Tab, Tabs} from 'react-bootstrap';

// elemental components
import TabTitle from '~/components/ui/TabTitle';
import Select, {Option} from '~/components/ui/Select';

// components
import Disaster from './Disaster';

// icons
import {IconCheck} from '~/components/icons/app';

// utils
import * as random from '~/utils/random';
import {toDisastersTemplate} from '~/utils/parser/templates-general';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/scenario/reducers';

// types
import type {scenario} from '~/data/scenario/parser/types';

/** DisasterContainer `props` type */
export interface Props {
  onChange?(template: string): void;
}

type DisasterState = Record<string, scenario.Disaster>;

/** DisasterContainer functional component */
const DisasterContainer = (props: Props) => {
  const dispatch = useAppDispatch();

  props = merge({
    enabled: true,
    attributes: {},
    onChange: () => {
    },
  }, props);

  const [checked, setChecked] = React.useState<boolean>(false);
  const [records, setRecords] = React.useState<DisasterState>({});
  const [activeKey, setActiveKey] = React.useState<string>('');

  const reduxState = useAppSelector(({scenario}) => scenario?.values?.disasters);

  // Reflect redux-specific changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(true);
      setRecords({});
      setActiveKey('');
      dispatch(clearProperty('disasters'));
    } else if (Array.isArray(reduxState)) {
      setChecked(true);
      setRecords(reduxState.reduce((accum, current) => {
        accum[current.disasterType] = current;
        return accum;
      }, {} as DisasterState));
      setActiveKey(reduxState[0].disasterType);
      dispatch(clearProperty('disasters'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  React.useEffect(() => {
    props?.onChange?.(toDisastersTemplate(Object.values(records), checked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, records]);
  const removeTab = React.useCallback((tabId: string): void => {
    const ids = Object.keys(records);

    const newRecords = {...records};

    let tabIdIndex: number = ids.findIndex(id => id === tabId) || 0;

    let curValue: string = activeKey;

    if (curValue === tabId) {
      curValue = tabIdIndex === 0
        ? ids[tabIdIndex + 1]
        : ids[tabIdIndex - 1];
    }

    delete newRecords[tabId];

    setRecords(newRecords);
    setActiveKey(curValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, activeKey]);


  /** Total tabs count */
  const total: number = Object.keys(records).length;
  const excludedNames: string[] = Object.keys(records);

  return (
    <div className="mt-0 checkbox-align">
      <Form.Check
        className="pull-right"
        type="switch"
        id={`allow_disasters-switch`}
        label="Allow disasters throughout the gameplay"
        checked={checked}
        onChange={e => setChecked(e.target.checked)}
      />
      <div className="mt-2">
        <Select
          isSearchable={false}
          isDisabled={!checked}
          value={null}
          menuPortalTarget={document.body}
          noOptionsMessage={() => <><IconCheck/> All disasters are added</>}
          options={random.disasters
            .filter(v => !excludedNames.includes(v))
            .map(v => ({label: v, value: v}))}
          placeholder="Choose disaster..."
          onChange={(option: Option | any, {action}): void => {
            if (action === 'select-option' && option) {
              setRecords(current => ({
                ...current, [option.value]: {
                  disasterType: option.value,
                  period: +random.randomPeriod(),
                  variance: +random.randomPeriod(),
                },
              }));
              setActiveKey(option.value);
            }
          }}
        />
      </div>
      {total > 0 && (
        <Tabs
          id="disasters-tab"
          activeKey={activeKey}
          className={cn('nav-tabs-bottom mt-1 mb-1', {'border-0': !total})}
          onSelect={k => setActiveKey(k as string)}>
          {Object.entries(records).map(([id, disaster]) => (
            <Tab
              disabled={!checked} eventKey={id} key={id}
              title={<TabTitle disabled={!checked} title={id} onRemove={() => removeTab(id)}/>}>
              <Disaster
                disabled={!checked}
                initialValues={disaster}
                onValuesChange={values => {
                  setRecords(current => {
                    const newList = {...current};
                    newList[id] = {...values};
                    return newList;
                  });
                }}/>
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
};

// Properties validation
DisasterContainer.propTypes = {
  onChange: PropTypes.func,
};

export default DisasterContainer;
