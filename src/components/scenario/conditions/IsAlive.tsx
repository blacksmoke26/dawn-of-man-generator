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
import {Col, Form, Row} from 'react-bootstrap';

// elemental components
import ConditionHeader from './../elements/ConditionHeader';

// utils
import {toString} from '~/helpers/string';
import {defaultsParams} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {ConditionIsAlive as ConditionAttributes} from '~/types/condition.types';

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

const CONDITION_NAME: string = 'IsAlive';

const IsAlive = (props: DeepPartial<Props>) => {
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
  }, defaultsParams.isAlive as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean,
    name: toString(newProps.name),
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const toTemplateText = (): string => {
    return !attributes.enabled || !String(attributes?.name || '')?.trim()
      ? ''
      : (
        `<condition type="${CONDITION_NAME}" name="${attributes.name}"/>`
      );
  };

  // Reflect state changes
  React.useEffect(() => {
    typeof newProps.onChange === 'function' && newProps.onChange(toTemplateText(), attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    props?.enabled !== undefined && setAttribute('enabled', props.enabled);
    props?.disabledCheckbox !== undefined && setAttribute('disabledCheckbox', props.disabledCheckbox);
    props?.expanded !== undefined && setAttribute('expanded', props.expanded);

    if (props?.enabled) {
      props?.name !== undefined && setAttribute('name', props.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const isDisabled = attributes.disabledCheckbox || !attributes.enabled;

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <ConditionHeader caption={CONDITION_NAME} showCheckbox={newProps.showCheckbox}
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
              <div className="position-relative pl-3" style={{top: 7}}>Name</div>
            </Col>
            <Col xs="6">
              <Form.Control
                type="text"
                size="sm"
                disabled={isDisabled}
                className="pull-right"
                aria-disabled={isDisabled}
                id={`condition-${nanoid(5)}`}
                placeholder="e.g., deer"
                value={attributes?.name || ''}
                onChange={e => setAttribute('name', e.target.value.replace(/['"]+/ig, ``))}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
IsAlive.propTypes = {
  enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

export default IsAlive;
