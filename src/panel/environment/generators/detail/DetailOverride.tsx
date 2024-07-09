/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import {nanoid} from 'nanoid';
import {capitalCase} from 'change-case';
import {Form, Tab, Tabs} from 'react-bootstrap';

// elemental components
import TabTitle from '~/components/ui/TabTitle';
import Accordion from '~/components/ui/Accordion';
import Select, {Option} from '~/components/ui/Select';
import ObjectOverridePrototype from '~/components/environment/ObjectOverridePrototype';

// icons
import {IconPlant} from '~/components/icons/app';

// utils
import {isObject} from '~/helpers/object';
import {optionsByType, Props} from '~/components/environment/utils/object-override';

// parsers
import {toOverridePrototypesTemplate} from '~/utils/parser/environment/templates';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/environment/reducers';

// types
import type {environment} from '~/data/environments/parser/types';

const OBJECT_TYPE: environment.prototypes.ObjectType = 'detail';
const OPTION_ICON: React.ReactElement = <IconPlant width="16" height="16"/>;

/** DetailOverride functional component */
const DetailOverride = (props: Props) => {
  const dispatch = useAppDispatch();

  const [checked, setChecked] = React.useState<boolean>(true);
  const [records, setRecords] = React.useState<environment.prototypes.OverridePrototypes>({});
  const [activeKey, setActiveKey] = React.useState<string>('');

  const reduxState = useAppSelector(({environment}) => environment?.values?.treeOverridePrototypes);

  const reflectValues = (values: environment.prototypes.OverridePrototypes) => {
    const names: string[] = Object.keys(values);
    setRecords({...values});
    setActiveKey(names[0]);
  };

  // Reflect redux-specific changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(true);
      setRecords({});
      setActiveKey('');
      dispatch(clearProperty('detailOverridePrototypes'));
    } else if (isObject(reduxState)) {
      setChecked(true);
      reflectValues(reduxState as environment.prototypes.OverridePrototypes);
      dispatch(clearProperty('detailOverridePrototypes'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    props?.onTemplate?.(toOverridePrototypesTemplate(OBJECT_TYPE, records));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);

  const tabsList = Object.keys(records);

  const removeTab = (tabId: string): void => {
    const ids: string[] = Object.keys(records);

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
  };

  const total = tabsList.length;

  return (
    <Accordion
      noCard={true}
      eventKey={`${OBJECT_TYPE}_override_panel`}
      header={(
        <div
          className="float-left">
          {OPTION_ICON} {' '}
          {`Override ${capitalCase(OBJECT_TYPE)} Prototypes`}
        </div>
      )}
      headerProps={{className: 'pb-1'}}
      headerAfter={(
        <>
          <div className="float-right text-right position-relative" style={{height: 15, top: -4}}>
            <Form.Check
              className="d-inline-block position-relative ml-2 p-0"
              type="switch"
              id={`prop-${nanoid(5)}`}
              label=""
              checked={checked}
              onChange={e => setChecked(e.currentTarget.checked)}
            />
          </div>
          <div className="clearfix"></div>
        </>
      )}>
      <div>
        <div className="mt-2 mb-1">
          <Select
            formatOptionLabel={(option: Option | any) => (
              <span>{OPTION_ICON} {' '} {option?.label}</span>
            )}
            isDisabled={!checked}
            menuPortalTarget={document.body}
            value={null}
            options={optionsByType(OBJECT_TYPE, Object.keys(records))}
            placeholder={`Choose ${OBJECT_TYPE} to override`}
            onChange={(option: Option | any, {action}): void => {
              if (action === 'select-option' && option) {
                setRecords(current => ({...current, [option.value]: {}}));
                setActiveKey(option.value);
              }
            }}
          />
        </div>
        {total > 0 && (
          <Tabs
            id="detail-override-tab"
            activeKey={activeKey}
            className={cn('nav-tabs-bottom mt-1 mb-0', {'border-0': !total})}
            onSelect={k => setActiveKey(k as string)}>
            {Object.entries(records).map(([id, initialValues]) => (
              <Tab
                eventKey={id}
                key={id}
                disabled={!checked}
                title={<TabTitle title={id} disabled={!checked} onRemove={() => removeTab(id)}/>}>
                <ObjectOverridePrototype
                  name={id}
                  initialValues={initialValues}
                  type={OBJECT_TYPE}
                  disabled={!checked}
                  onValuesChange={(values) => {
                    setRecords(current => ({...current, [id]: {...values}}));
                  }}
                />
              </Tab>
            ))}
          </Tabs>
        )}
      </div>
    </Accordion>
  );
};

// Properties validation
DetailOverride.propTypes = {
  onTemplate: PropTypes.func,
};

export default DetailOverride;
