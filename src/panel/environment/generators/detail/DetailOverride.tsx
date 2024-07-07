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
import ObjectOverridePrototype, {InitialValues} from '~/components/environment/ObjectOverridePrototype';

// icons
import {IconPlant} from '~/components/icons/app';

// utils
import {isObject} from '~/helpers/object';
import {findNextTabKey} from '~/helpers/ui';
import {
  optionsByType,
  toTemplateText,
  valuesToTemplates,
  extValueToSelection,
  type ObjectsList,
  type Props as BaseProp,
} from '~/components/environment/utils/object-override';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/environment/reducers';

// types
import type {ObjectType} from '~/utils/objects';
import type {Json, KVDocument} from '~/types/json.types';

export type Props = Omit<BaseProp, 'type' | 'checked' | 'noCard' | 'objectNoCard' | 'optionIcon' | 'values'>;

const OBJECT_TYPE: ObjectType = 'detail';
const OPTION_ICON: React.ReactElement = <IconPlant width="16" height="16"/>;

/** DetailOverride functional component */
const DetailOverride = (props: Props) => {
  const dispatch = useAppDispatch();

  const [checked, setChecked] = React.useState<boolean>(true);
  const [values, setValues] = React.useState<ObjectsList>({});
  const [templates, setTemplates] = React.useState<KVDocument<string>>({});
  const [activeKey, setActiveKey] = React.useState<string>('');

  const reduxState = useAppSelector(({environment}) => environment?.values?.detailOverridePrototypes);

  const reflectValues = (values: ObjectsList) => {
    setTemplates(valuesToTemplates(values));
    setValues(values);
    setActiveKey(Object.keys(values)[0]);
  };

  // Reflect redux-specific changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(true);
      setValues({});
      setTemplates({});
      setActiveKey('');
      dispatch(clearProperty('detailOverridePrototypes'));
    } else if (isObject(reduxState)) {
      setChecked(true);
      reflectValues(extValueToSelection(reduxState as Json));
      dispatch(clearProperty('detailOverridePrototypes'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(OBJECT_TYPE, templates));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates]);

  const removeObject = (name: string) => {
    setTemplates(current => {
      const _current = {...current};
      delete _current[name];
      return _current;
    });
  };

  const tabsList = Object.keys(templates);

  const removeTab = (tabId: string): void => {
    setActiveKey(findNextTabKey(tabsList, activeKey, tabId));
    removeObject(tabId);
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
            options={optionsByType(OBJECT_TYPE, Object.keys(templates))}
            placeholder={`Choose ${OBJECT_TYPE} to override`}
            onChange={(option: Option | any, {action}): void => {
              if (action === 'select-option' && option) {
                setTemplates(current => ({...current, [option.value]: ''}));
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
            {Object.keys(templates).map(id => (
              <Tab
                eventKey={id}
                key={id}
                disabled={!checked}
                title={<TabTitle title={id} disabled={!checked} onRemove={() => removeTab(id)}/>}>
                <ObjectOverridePrototype
                  name={id}
                  initialValues={(values?.[id] ?? {}) as InitialValues}
                  type={OBJECT_TYPE}
                  disabled={!checked}
                  onTemplate={(template: string) => {
                    setTemplates(current => ({...current, [id]: template}));
                  }}
                  onRemove={() => removeTab(id)}
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
  onChange: PropTypes.func,
};

export default DetailOverride;
