/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import merge from 'deepmerge';
import {capitalCase} from 'change-case';
import {Row, Col, Button} from 'react-bootstrap';

// elemental components
import AttributeSelect, {Option} from '~/components/ui/elements/AttributeSelect';

// icons
import {IconChevronSimpleDown, IconChevronSimpleUp, IconFlag} from '~/components/icons/app';

// utils
import {EVENT_FLAGS_OPTIONS} from '~/utils/event';

// types
import type {Required} from 'utility-types';
import cn from 'classname';
import {RemoveButton} from '~/components/scenario/conditions/elements/condition-logical';

export interface Props {
  disabled?: boolean;
  expanded?: boolean;
  value?: string[];

  onChange?(items: string[]): void;

  onCaptionClick?(): void;
}

/** FlagsDropdown functional component */
const FlagsDropdown = (props: Props = {}) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    expanded: true,
    value: [],
    onChange() {
    },
    onCaptionClick() {
    },
  }, props);
  const [expanded, setExpanded] = React.useState<boolean>(newProps.expanded);


  React.useEffect(() => {
    props?.expanded !== undefined && setExpanded(props.expanded);
  }, [props?.expanded]);

  return (
    <div className="mb-3">
      <Row>
        <Col sm="6" className="cursor-pointer" onClick={() => newProps.onCaptionClick()}>
          <div>
            <IconFlag width="16" height="16"/> {' '} Flags
          </div>
        </Col>
        <Col col="6" className="text-right" style={{top: 3}}>
          <div className="d-inline-block">
            <strong
              style={{color: '#ebeaea'}}
              className={cn('text-size-sm', {'text-muted': newProps.disabled})}>
              <span className="position-relative" style={{top: '0.01rem'}}>
                {newProps.value.length || <>&nbsp;</>}
              </span>
            </strong>
          </div>
          <div className="d-inline-block ml-2">
            <Button
              variant="link" className="p-0" style={{top: '-0.080rem'}}
              disabled={newProps.disabled}
              onClick={() => {
                newProps.onCaptionClick();
              }}>
              {!expanded
                ? <IconChevronSimpleUp width="16" height="16"/>
                : <IconChevronSimpleDown width="16" height="16"/>}
            </Button>
          </div>
          <RemoveButton
            disabled={newProps.disabled}
            buttonProps={{
              title: 'Remove all flags',
            }}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              newProps?.onChange([]);
            }}/>
        </Col>
      </Row>
      {expanded && (
        <Row className="mt-2">
          <AttributeSelect
            className="w-75"
            colProps={{sm: '10'}}
            disabled={newProps.disabled}
            options={EVENT_FLAGS_OPTIONS}
            value={newProps?.value?.map(value => ({value, label: capitalCase(value)})) || []}
            selectProps={{
              isSearchable: true, isMulti: true,
              placeholder: 'Choose flags...',
              formatOptionLabel: (option: Option | any) => (
                <><IconFlag width="17" height="17"/>{' '} {option?.label}</>
              ),
            }}
            onChange={(option, {action}) => {
              if (['select-option', 'remove-value', 'clear'].includes(action) && Array.isArray(option)) {
                newProps?.onChange(option?.map(({value}) => value) || []);
              }
            }}
            allowClear
            onClear={() => newProps?.onChange([])}
          />
        </Row>
      )}
    </div>
  );
};

export default FlagsDropdown;
