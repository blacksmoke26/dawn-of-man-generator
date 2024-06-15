/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-14
 * @version 2.1.1
 */

import React from 'react';
import PropTypes from 'prop-types';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Form} from 'react-bootstrap';
import {capitalCase} from 'change-case';
import xmlFormatter from 'xml-formatter';

// elemental components
import Accordion from '~/components/ui/Accordion';
import Select, {Option} from '~/components/ui/Select';

// relative components
import ObjectOverridePrototype from './ObjectOverridePrototype';

// utils
import * as objects from '~/utils/objects';

// types
import type {Required} from 'utility-types';
import type {KVDocument} from '~/types/json.types';
import type {ObjectAttributes, ObjectType} from '~/utils/objects';

type ObjectsList = KVDocument<ObjectAttributes>;

export interface Props {
  type: ObjectType;
  checked?: boolean;
  optionIcon?: React.ReactElement;
  values?: ObjectsList;

  onChange?(template: string): void;
}

const defaultValues: Partial<Props> = {
  checked: true,
  values: {},
};

const typeToList = (type: ObjectType) => {
  switch (type) {
    case 'deposit':
      return objects.deposits;
    case 'prop':
      return objects.props;
    case 'tree':
      return objects.trees;
    case 'detail':
      return objects.details;
  }
};

const optionsByType = (type: ObjectType, excluded: string[] = []): Option[] => {
  const options: Option[] = [];

  const list = typeToList(type) as unknown as string[];
  const excludedCount = excluded.length;

  for (const value of list) {
    if (excludedCount && excluded.includes(value)) {
      continue;
    }

    options.push({label: value, value});
  }

  return options;
};

const toTemplateText = (type: ObjectType, values: KVDocument<string>): string => {
  if (!Object.keys(values).length) {
    return '';
  }

  const template: string = Object.values(values).join('').trim();

  if (!template) {
    return '';
  }

  return xmlFormatter(
    `<${type}_override_prototypes>
      ${template}
    </${type}_override_prototypes>`,
  );
};

const valuesToTemplates = (values: ObjectsList | undefined): KVDocument<string> => {
  const templates: KVDocument<string> = {};
  Object.keys(values || {}).forEach(id => {
    templates[id] = id;
  });
  return templates;
};

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
      eventKey={`${newProps.type}_override_panel`}
      header={(
        <div
          className="float-left">
          {`Override ${capitalCase(newProps.type)} Prototypes`}
        </div>
      )}
      headerProps={{className: 'pb-1'}}
      headerAfter={(
      <>
        <div className="float-right text-right position-relative" style={{height: 30, top: -4}}>
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
    </Accordion>
  );
};

ObjectOverride.propTypes = {
  type: PropTypes.oneOf(objects.objects).isRequired,
  checked: PropTypes.bool,
  values: PropTypes.object,
  optionIcon: PropTypes.element,
};

export default ObjectOverride;
