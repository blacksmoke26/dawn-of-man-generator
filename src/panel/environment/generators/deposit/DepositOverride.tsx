/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import {nanoid} from 'nanoid';
import {Form} from 'react-bootstrap';
import {capitalCase} from 'change-case';

// elemental components
import Accordion from '~/components/ui/Accordion';
import Select, {Option} from '~/components/ui/Select';
import ObjectOverridePrototype from '~/components/environment/ObjectOverridePrototype';

// icons
import {IconMountain} from '~/components/icons/app';

// utils
import {
  optionsByType,
  toTemplateText,
  valuesToTemplates,
  extValueToSelection,
  type ObjectsList,
  type Props as BaseProp,
} from '~/components/environment/utils/object-override';

// redux
import {useAppSelector} from '~redux/hooks';
import {isObject} from '~/helpers/object';

// types
import type {ObjectType} from '~/utils/objects';
import type {Json, KVDocument} from '~/types/json.types';

export type Props = Omit<BaseProp, 'type' | 'checked' | 'noCard' | 'objectNoCard' | 'optionIcon' | 'values'>;

const OBJECT_TYPE: ObjectType = 'deposit';
const OPTION_ICON: React.ReactElement = <IconMountain width="16" height="16"/>;

/** DepositOverride functional component */
const DepositOverride = (props: Props) => {
  const [checked, setChecked] = React.useState<boolean>(true);
  const [values, setValues] = React.useState<ObjectsList>({});
  const [isInit, setIsInit] = React.useState<boolean>(false);
  const [templates, setTemplates] = React.useState<KVDocument<string>>({});

  const depositOverridePrototypesAttribute = useAppSelector(({environment}) => environment?.values?.depositOverridePrototypes);

  const reflectValues = (values: ObjectsList) => {
    setTemplates(valuesToTemplates(values));
    setValues(values);
    setIsInit(false);
  };

  // Reflect redux specific changes
  React.useEffect(() => {
    const extValue = depositOverridePrototypesAttribute ?? null;

    if (typeof extValue === 'boolean') {
      setChecked(extValue);
    }

    if (isObject(extValue)) {
      console.log('extValue:', extValue);
      setChecked(true);
      reflectValues(extValueToSelection(extValue as Json));
    }
  }, [depositOverridePrototypesAttribute]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(OBJECT_TYPE, templates));
    !isInit && setIsInit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates, isInit]);

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
      <div className="panel-border ml-1">
        <div className="mt-2 mb-1">
          <Select
            formatOptionLabel={(option: Option | any) => (
              <span>
              {OPTION_ICON}
                {' '} {option?.label}
            </span>
            )}
            isDisabled={!checked}
            menuPortalTarget={document.body}
            value={null}
            options={optionsByType(OBJECT_TYPE, Object.keys(templates))}
            placeholder={`Choose ${OBJECT_TYPE} to override`}
            onChange={(option: Option | any, {action}): void => {
              if (action === 'select-option' && option) {
                setTemplates(current => ({...current, [option.value]: ''}));
              }
            }}
          />
        </div>

        {Object.keys(templates).map(id => {
          const componentProps: Props = !isInit
            ? values?.[id] as Props
            : {} as Props;

          return (
            <ObjectOverridePrototype
              {...componentProps}
              key={id}
              noCard={true}
              name={id}
              type={OBJECT_TYPE}
              disabled={!checked}
              icon={OPTION_ICON}
              onChange={(template: string) => {
                setTemplates(current => ({...current, [id]: template}));
              }}
              onRemove={() => setTemplates(current => {
                const _current = {...current};
                delete _current[id];
                return _current;
              })}
            />
          );
        })}
      </div>
    </Accordion>
  );
};

// Properties validation
DepositOverride.propTypes = {
  onChange: PropTypes.func,
};

export default DepositOverride;
