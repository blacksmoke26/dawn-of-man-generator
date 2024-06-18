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
import {Button, Col, Row} from 'react-bootstrap';

// elemental components
import Slider from '~/components/ui/Slider';
import Select, {Option} from '~/components/ui/Select';
import ConditionHeader from './../elements/ConditionHeader';

// utils
import * as random from '~/utils/random';
import {capitalCase} from 'change-case';
import {toString} from '~/helpers/string';
import {toInteger} from '~/helpers/number';
import {toEntityCount} from '~/utils/units';
import {ENTITIES, ENTITIES_OPTIONS} from '~/utils/entities';
import {toEntityNearMarkerTemplate} from '~/utils/parser/templates';
import {defaultsParams, DISTANCE_MAX, DISTANCE_MIN} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {EntityType} from '~/types/entity.types';
import type {ConditionEntityNearMarker as ConditionAttributes} from '~/types/condition.types';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
  disabledCheckbox?: boolean;
  expanded?: boolean;
}

interface Props extends Attributes {
  removeIcon?: boolean;
  showCheckbox?: boolean,

  onRemoveClick?(): void,

  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'EntityNearMarker';

const EntityNearMarker = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: true,
    disabledCheckbox: false,
    removeIcon: false,
    showCheckbox: true,
    expanded: true,
    onChange: () => {
    },
    onRemoveClick: () => {
    },
  }, defaultsParams.entityNearMarker as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean,
    entityType: toString<EntityType>(newProps.entityType),
    distance: toInteger(newProps.distance),
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  // Reflect state changes
  React.useEffect(() => {
    const args: [string, Attributes] = !attributes.enabled
      ? ['', {} as Attributes]
      : [toEntityNearMarkerTemplate(attributes), attributes];

    typeof newProps.onChange === 'function' && newProps.onChange.apply(null, args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    props?.enabled !== undefined && setAttribute('enabled', props.enabled);
    props?.disabledCheckbox !== undefined && setAttribute('disabledCheckbox', props.disabledCheckbox);
    props?.expanded !== undefined && setAttribute('expanded', props.expanded);

    if (props?.enabled) {
      props?.entityType !== undefined && setAttribute('entityType', props.entityType);
      props?.distance !== undefined && setAttribute('distance', toEntityCount(props.distance));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const isDisabled = attributes.disabledCheckbox || !attributes.enabled;

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <ConditionHeader
        caption={CONDITION_NAME} showCheckbox={newProps.showCheckbox}
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
              <div className="position-relative pl-3" style={{top: 7}}>
                Entity Type
              </div>
            </Col>
            <Col xs="5">
              <Select
                isDisabled={isDisabled}
                menuPortalTarget={document.body}
                options={ENTITIES_OPTIONS}
                defaultValue={newProps?.entityType
                  ? {label: capitalCase(newProps.entityType), value: newProps.entityType}
                  : null
                }
                placeholder="Choose..."
                onChange={(option: Option | any, {action}): void => {
                  if (action === 'select-option' && option) {
                    setAttribute('entityType', option.value);
                  }
                }}
              />
            </Col>
          </Row>
          <Row className="mb-1 mt-3">
            <Col xs="2">
              <div className="position-relative pl-3" style={{top: 7}}>
                Distance
              </div>
            </Col>
            <Col xs="6">
              <span className="text-size-xs font-family-code">
                Value: <code className={cn({'text-muted': isDisabled})}>{attributes.distance}</code>
              </span>
              <Button
                disabled={isDisabled}
                className="button-reset-sm" variant="link"
                onClick={() => setAttribute('distance', random.randomDistance())}>
                Random
              </Button>
              <Slider
                min={DISTANCE_MIN}
                max={DISTANCE_MAX}
                step={1} disabled={isDisabled}
                value={toInteger(attributes.distance)}
                onChange={value => setAttribute('distance', Number(value))}/>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
EntityNearMarker.propTypes = {
  enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  entityType: PropTypes.oneOf(ENTITIES),
  distance: PropTypes.number,
};

export default EntityNearMarker;
