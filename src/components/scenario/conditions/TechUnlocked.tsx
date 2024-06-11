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
import {capitalCase} from 'change-case';
import {Col, Row} from 'react-bootstrap';

// elemental components
import Select, {Option} from '~/components/ui/Select';
import ConditionHeader from './../elements/ConditionHeader';

// utils
import {toString} from '~/helpers/string';
import {techEntities} from '~/utils/entities';
import {defaultsParams} from '~/utils/condition';

// types
import type {$Keys} from 'utility-types';
import type {TechEntityType} from '~/types/entity.types';
import type {ConditionTechUnlocked as ConditionAttributes,} from '~/types/condition.types';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
  disabledCheckbox?: boolean;
  expanded?: boolean;
}

interface Props extends Attributes {
  removeIcon?: boolean;

  onRemoveClick?(): void,

  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'TechUnlocked';

const TechUnlocked = (props: Partial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: true,
    disabledCheckbox: false,
    removeIcon: false,
    expanded: true,
    onChange: () => {
    },
    onRemoveClick: () => {
    },
  }, defaultsParams.techUnlocked as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean,
    tech: toString<TechEntityType>(newProps.tech),
    techs: (newProps?.techs || []) as TechEntityType[],
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
    setAttribute('enabled', props.enabled);
    setAttribute('disabledCheckbox', props.disabledCheckbox);
    setAttribute('expanded', props.expanded);

    if (props.enabled) {
      props?.tech?.length && setAttribute('tech', props.tech);
      props?.techs?.length && setAttribute('techs', props.techs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const isDisabled = attributes.disabledCheckbox || !attributes.enabled;

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <ConditionHeader caption={CONDITION_NAME}
                       enabled={attributes.enabled}
                       onEnabled={(isEnabled: boolean) => setAttribute('enabled', isEnabled)}
                       disabledCheckbox={attributes.disabledCheckbox}
                       removeIcon={newProps.removeIcon}
                       onRemoveClick={newProps.onRemoveClick}
                       onExpandedClick={(state: boolean) => setAttribute('expanded', state)}
                       expanded={attributes.expanded}/>
      {attributes?.expanded && (
        <>
          <Row className="mb-1 mt-2">
            <Col xs="2">
              <div className="position-relative pl-3" style={{top: 7}}>Tech</div>
            </Col>
            <Col xs="6">
              <Select
                isDisabled={isDisabled}
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
                isDisabled={isDisabled}
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
        </>
      )}
    </div>
  );
};

// Properties validation
TechUnlocked.propTypes = {
  enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  tech: PropTypes.oneOf(techEntities),
  techs: PropTypes.arrayOf(PropTypes.oneOf(techEntities)),
};

export default TechUnlocked;
