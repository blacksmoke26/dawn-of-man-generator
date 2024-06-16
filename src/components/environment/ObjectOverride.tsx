/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-14
 * @version 2.1.1
 */

import React from 'react';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Form} from 'react-bootstrap';
import {capitalCase} from 'change-case';
import cn from 'classname';

// elemental components
import Accordion from '~/components/ui/Accordion';
import Select, {Option} from '~/components/ui/Select';

// relative components
import ObjectOverridePrototype from './ObjectOverridePrototype';

// utils
import {
  propTypes,
  defaultValues,
  optionsByType,
  toTemplateText,
  valuesToTemplates,
  Props,
} from './utils/object-override';

// types
import type {Required} from 'utility-types';
import type {KVDocument} from '~/types/json.types';

/** ObjectOverride functional component */
const ObjectOverride = (props: Props) => {
  const newProps = merge<Required<Props>>(defaultValues, props);

  const [checked, setChecked] = React.useState<boolean>(newProps.checked);
  const [isInit, setIsInit] = React.useState<boolean>(false);
  const [templates, setTemplates] = React.useState<KVDocument<string>>(
    valuesToTemplates(newProps.values),
  );

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(newProps.type, templates));
    !isInit && setIsInit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates, isInit]);

  return (
    <Accordion
      noCard={newProps.noCard}
      eventKey={`${newProps.type}_override_panel`}
      header={(
        <div
          className="float-left">
          {newProps?.optionIcon} {' '}
          {`Override ${capitalCase(newProps.type)} Prototypes`}
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
      <div className={cn({'panel-border ml-1': newProps?.noCard})}>
      <div className="mt-2 mb-3">
        <Select
          formatOptionLabel={(option: Option | any) => (
            <span>
              {newProps?.optionIcon}
              {' '} {option?.label}
            </span>
          )}
          isDisabled={!checked}
          menuPortalTarget={document.body}
          value={null}
          options={optionsByType(newProps.type, Object.keys(templates))}
          placeholder={`Choose ${props.type} to override`}
          onChange={(option: Option | any, {action}): void => {
            if (action === 'select-option' && option) {
              setTemplates(current => ({...current, [option.value]: ''}));
            }
          }}
        />
      </div>

      {Object.keys(templates).map(id => {
        const componentProps: Props = !isInit
          ? newProps?.values?.[id] as Props
          : {} as Props;

        return (
          <ObjectOverridePrototype
            {...componentProps}
            key={id}
              noCard={newProps.objectNoCard}
            name={id}
            type={newProps.type}
            disabled={!checked}
            icon={newProps?.optionIcon}
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
ObjectOverride.propTypes = propTypes;

export default ObjectOverride;
