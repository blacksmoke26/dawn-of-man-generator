// noinspection HtmlUnknownAttribute

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {capitalCase} from 'change-case';
import {Col, Form, Row} from 'react-bootstrap';

// elemental components
import Select, {Option} from '~/components/ui/Select';

// utils
import {techEntities} from '~/utils/entities';

// icons
import {COLOR_DISABLED, COLOR_REDDISH, IconCondition} from '~/components/icons/app';

// utils
import {defaultsParams} from '~/utils/condition';

// types
import type {$Keys} from 'utility-types';
import type {TechEntityType} from '~/types/entity.types';
import type {ConditionTechUnlocked as ConditionAttributes,} from '~/types/condition.types';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
}

interface Props extends Attributes {
  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'TechUnlocked';

const TechUnlocked = (props: Partial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: false,
    onChange: () => {
    },
  }, defaultsParams.techUnlocked as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    tech: newProps.tech as TechEntityType,
    techs: newProps.techs as TechEntityType[],
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const toTemplateText = (): string => {
    if (!attributes.enabled) {
      return '';
    }

    const techProp = attributes?.tech?.trim()
      ? ` tech="${attributes?.tech}"`
      : '';

    const techsProp = attributes?.techs?.length
      ? ` techs="${attributes?.techs.join(' ')}"`
      : '';

    return !techProp.trim() && !techsProp.trim()
      ? ''
      : `<condition type="${CONDITION_NAME}"${techProp}${techsProp}/>`;
  };

  // Reflect state changes
  React.useEffect(() => {
    typeof newProps.onChange === 'function' && newProps.onChange(toTemplateText(), attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    'enabled' in props && setAttribute('enabled', props.enabled);

    if (attributes.enabled) {
      props?.tech?.length && setAttribute('tech', props.tech);
      props?.techs?.length && setAttribute('techs', props.techs);
    }
  }, [props, attributes.enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !attributes.enabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10">
          <IconCondition width="17" height="17"
                         color={!attributes.enabled ? COLOR_DISABLED : COLOR_REDDISH}/>
          {' '} <strong>Condition</strong>: TechUnlocked
        </Col>
        <Col xs="2" className="text-right">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`condition-switch-${nanoid(5)}`}
            label=""
            checked={attributes.enabled}
            onChange={e => setAttribute('enabled', e.target.checked)}
          />
        </Col>
      </Row>
      <Row className="mb-1 mt-2">
        <Col xs="2">
          <div className="position-relative pl-3" style={{top: 7}}>Tech</div>
        </Col>
        <Col xs="6">
          <Select
            isDisabled={!attributes.enabled}
            isClearable={true}
            defaultValue={attributes?.tech ? {label: attributes.tech, value: attributes.tech} : null}
            menuPortalTarget={document.body}
            options={techEntities.map(value => ({label: capitalCase(value), value}))}
            placeholder="Choose..."
            onChange={(option: Option | any, {action}): void => {
              setAttribute('tech', option?.value || '');
            }}
          />
        </Col>
      </Row>
      <Row className="mb-1 mt-2">
        <Col xs="2">
          <div className="position-relative pl-3" style={{top: 7}}>Techs</div>
        </Col>
        <Col xs="8">
          <Select
            isClearable={true}
            isDisabled={!attributes.enabled}
            isMulti={true}
            menuPortalTarget={document.body}
            defaultValue={newProps?.techs?.map(value => ({label: capitalCase(value), value}) || [])}
            options={techEntities.map(value => ({label: capitalCase(value), value}))}
            placeholder="Choose..."
            onChange={(option: Option[] | any, {action}): void => {
              if (['select-option', 'remove-value', 'clear'].includes(action) && Array.isArray(option)) {
                setAttribute('techs', option?.map(({value}) => value) || []);
              }
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

// Properties validation
TechUnlocked.propTypes = {
  enabled: PropTypes.bool,
  tech: PropTypes.oneOf(techEntities),
  techs: PropTypes.arrayOf(PropTypes.oneOf(techEntities)),
  onChange: PropTypes.func,
};

export default TechUnlocked;
