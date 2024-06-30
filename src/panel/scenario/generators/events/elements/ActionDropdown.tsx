/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import merge from 'deepmerge';
import cn from 'classname';
import {Button, Col, Row} from 'react-bootstrap';

// elemental components
import AttributeSelect from '~/components/ui/elements/AttributeSelect';
import {RemoveButton} from '~/components/scenario/conditions/elements/condition-logical';

// icons
import {
  COLOR_DISABLED,
  COLOR_ORANGE,
  COLOR_PINK,
  COLOR_SUCCESS,
  IconAction,
  IconChevronSimpleUp,
  IconChevronSimpleDown,
} from '~/components/icons/app';

// utils
import {ACTIONS_CREATE_MAX} from '~/utils/defaults';
import {actionsNameOptionsGrouped, PROMINENT_ACTIONS_NAME} from '~/utils/action';

// types
import type {Required} from 'utility-types';
import type {Option} from '~/components/ui/Select';
import type {MapDocument} from '~/types/json.types';
import type {ActionName} from '~/types/action.types';

export interface Props {
  disabled?: boolean;
  expanded?: boolean;
  caption?: React.ReactNode;
  countMap?: MapDocument<ActionName>;

  onChange?(name: string): void;

  onCaptionClick?(): void;

  onRemoveClick?(): void;
}

/** ActionDropdown functional component */
const ActionDropdown = (props: Props = {}) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    expanded: true,
    caption: 'Action',
    countMap: {},
    onChange() {
    },
    onCaptionClick() {
    },
    onRemoveClick() {
    },
  }, props);

  const [countMap, setCountMap] = React.useState<MapDocument<ActionName>>(newProps.countMap);
  const [expanded, setExpanded] = React.useState<boolean>(newProps.expanded);

  const totalActions = Object.values(countMap).reduce((accum, current) => accum + current, 0);

  React.useEffect(() => {
    props?.countMap && setCountMap(props.countMap);
    props?.expanded !== undefined && setExpanded(props.expanded);
  }, [props?.countMap, props?.expanded]);

  return (
    <div className="mb-1">
      <div className="mb-2 cursor-pointer">
        <Row>
          <Col sm="6" onClick={() => newProps.onCaptionClick()}>
            <IconAction
              color={newProps?.disabled ? COLOR_DISABLED : COLOR_PINK}
              width="17" height="17"/> {' '} {newProps.caption}
          </Col>
          <Col col="6" className="text-right" style={{top: 3}}>
            <div className="d-inline-block">
              <span
                style={{color: '#ebeaea'}}
                className={cn({'text-muted': newProps.disabled})}>
                <span className="position-relative" style={{top: '0.01rem'}}>
                  {!totalActions ? <>&nbsp;</>: <>{totalActions} / {ACTIONS_CREATE_MAX}</>}
                </span>
              </span>
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
                title: 'Remove all actions',
              }}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                newProps?.onRemoveClick();
              }}/>
          </Col>
        </Row>
      </div>
      <Row>
        {expanded && (
          <AttributeSelect
            className="w-75"
            colProps={{sm: '10'}}
            disabled={newProps.disabled}
            options={actionsNameOptionsGrouped(Object.keys(countMap) as unknown as ActionName[]) as unknown as Option[]}
            value={null}
            selectProps={{
              isSearchable: true,
              placeholder: 'Choose action to insert...',
              formatOptionLabel: (option: Option | any) => {
                const count = countMap?.[option?.value as ActionName];
                const isProminent = (PROMINENT_ACTIONS_NAME as string[]).includes(option?.value);
                return (
                  <>
                    <IconAction
                      width="17" height="17"
                      color={count ? COLOR_PINK : (isProminent ? COLOR_SUCCESS : COLOR_ORANGE)}/> {' '} {option?.label}
                    {!!count && <code className="p-0 ml-2 font-weight-black bg-transparent">[{count}]</code>}
                  </>
                );
              },
            }}
            onSelect={option => newProps.onChange(option.value)}
          />
        )}
      </Row>
    </div>
  );
};

export default ActionDropdown;
