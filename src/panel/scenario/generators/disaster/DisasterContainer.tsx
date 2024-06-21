/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// types
import React from 'react';
import * as PropTypes from 'prop-types';
import {Button, Col, Form, Row} from 'react-bootstrap';
import cn from 'classname';
import {nanoid} from 'nanoid';
import merge from 'deepmerge';

// components
import Slider from '~/components/ui/Slider';
import Select, {Option} from '~/components/ui/Select';
import Accordion from '~/components/ui/Accordion';

// utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';
import {isObject} from '~/helpers/object';

// icons
import {COLOR_DISABLED, COLOR_REDDISH, IconClear, IconShuffle, IconStorm} from '~/components/icons/app';

// redux
import {useAppSelector} from '~redux/hooks';

// types
import type {Json} from '~/types/json.types';
import {DisasterNode, toDisastersTemplate} from '~/utils/parser/templates-general';
import {Disasters} from '~/types/scenario.types';

export interface Attributes {
  enabled?: boolean;
  period?: string;
  variance?: string;
}

export interface Registry {
  [p: string]: Attributes;
}

/** Get randomized initial values */
const getInitialValues = (): Attributes => {
  return {
    enabled: true,
    period: random.randomPeriod(),
    variance: random.randomPeriod(),
  };
};

/** Transform extended value into a selection object */
const extValueToSelection = (data: Json = {}): Registry => {
  const selection: Registry = {};

  for (const [name, attr] of Object.entries(data)) {
    selection[name] = {
      enabled: true,
      period: attr?.period,
      variance: attr?.variance,
    } as Attributes;
  }

  return selection;
};

/** DisasterContainer `props` type */
export interface Props {
  enabled?: boolean;
  attributes?: Registry;

  onChange?(template: string, values?: Registry): void;
}

/** DisasterContainer functional component */
const DisasterContainer = (props: Props) => {
  props = merge({
    enabled: true,
    attributes: {},
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);
  const [selection, setSelection] = React.useState<Registry>(props.attributes as Registry);

  const disastersAttribute = useAppSelector(({scenario}) => scenario?.values?.disasters);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = disastersAttribute ?? null;
    if (isObject(extValue)) {
      setEnabled(true);
      setSelection(extValueToSelection(extValue as Json));
    } else {
      setEnabled(false);
    }
  }, [disastersAttribute]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), selection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, enabled]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    if (!enabled) {
      return '';
    }

    const disasters: DisasterNode[] = [];

    for (const [name, attr] of Object.entries(selection)) {
      disasters.push({
        name: name as unknown as Disasters,
        period: attr?.period || '',
        variance: attr?.variance || '',
        allowRender: attr.enabled,
      });
    }
    
    return toDisastersTemplate(disasters);
  }, [enabled, selection]);

  /** Get react-select options */
  const renderSelectOptions = React.useCallback((): Json[] => {
    const excludes: string[] = Object.keys(selection);

    return random.disasters
      .filter(v => !excludes.includes(v))
      .map(v => ({label: v, value: v}));
  }, [selection]);

  /** Update given selection data */
  const modifySelection = (name: string, attr: Attributes): void => {
    setSelection(current => ({
      ...current,
      [name]: {...(current[name] ?? {}), ...attr},
    }));
  };

  /** Remove existing selection */
  const removeFromSelection = (name: string): void => {
    setSelection(current => {
      name in current && (delete current[name]);
      return {...current};
    });
  };

  /** Generate selection based nodes */
  const selectionNodes = React.useCallback((): React.ReactElement[] => {
    const nodes: React.ReactElement[] = [];

    for (const [name, attr] of Object.entries(selection)) {
      const isEnabled = attr.enabled && enabled;
      const eventKey = `disaster_${name}`;

      nodes.push(
        <div className="pb-2">
          <Accordion
            noCard={true}
            key={eventKey}
            defaultActiveKey={eventKey}
            eventKey={eventKey}
            accordion={{'aria-disabled': !isEnabled, flush: true}}
            headerProps={{className: 'pb-1'}}
            header={
              <div className="float-left">
                <IconStorm width="17" height="17"/> {name}
              </div>
            }
            headerAfter={
              <>
                <div className="float-right text-right position-relative" style={{height: 15, top: -4}}>
                  <Button
                    variant="link"
                    disabled={!isEnabled}
                    title="Randomize all values"
                    style={{fontSize: '1.6rem', top: -9}}
                    className={cn('p-0 text-decoration-none position-relative', {'text-white': isEnabled})} size="sm"
                    onClick={() => {
                      attr.enabled && modifySelection(name, {
                        period: random.randomPeriod(), variance: random.randomPeriod(),
                      });
                    }}>
                    <IconShuffle width="14" height="14"/>
                  </Button>
                  <Form.Check
                    disabled={!enabled}
                    className="d-inline-block position-relative"
                    style={{top: -4, marginRight: 2}}
                    type="switch"
                    id={`enable-disaster-${name}`}
                    label=""
                    checked={attr.enabled}
                    onChange={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      modifySelection(name, {enabled: e.target.checked});
                    }}
                  />
                  {' '}
                  <Button
                    variant="link" disabled={!enabled}
                    onClick={() => removeFromSelection(name)}
                    style={{fontSize: '1.2rem', top: -8, color: !enabled ? COLOR_DISABLED : COLOR_REDDISH}}
                    className="p-0 text-decoration-none position-relative" size="sm">
                    <IconClear width="18" height="18"/>
                  </Button>
                </div>
                <div className="clearfix"></div>
              </>
            }>
            <div className="panel-border ml-1">
              <Form.Group as={Row} className={cn('mb-2', {'text-muted': !isEnabled})}>
                <Form.Label column={true} sm="2">
                <span style={{textDecoration: 'underline dotted'}}
                      title="How long this disater lasts (year)">
                  Period
                </span>
                </Form.Label>
                <Col sm="10">
									<span className="text-size-xs font-family-code">
										Value: <code className={cn({'text-muted': !isEnabled})}>{attr.period}y</code>
									</span>
                  <Button
                    disabled={!isEnabled}
                    className="button-reset-sm" variant="link"
                    onClick={() => modifySelection(name, {period: random.randomPeriod()})}>
                    Random
                  </Button>
                  <Slider
                    disabled={!isEnabled}
                    step={0.1} min={Defaults.PERIOD_MIN} max={Defaults.PERIOD_MAX}
                    value={parseFloat(attr?.period ?? '0')}
                    onChange={(value: any) => modifySelection(name, {period: value})}/>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className={cn('mb-2', {'text-muted': !isEnabled})}>
                <Form.Label column={true} sm="2">
                <span style={{textDecoration: 'underline dotted'}}
                      title="How long this variance lasts (year)">
                  Variance
                </span>
                </Form.Label>
                <Col sm="10">
									<span className="text-size-xs font-family-code">
										Value: <code className={cn({'text-muted': !isEnabled})}>{attr.variance}y</code>
									</span>
                  <Button disabled={!isEnabled}
                          className="button-reset-sm" variant="link"
                          onClick={() => modifySelection(name, {variance: random.randomPeriod()})}>
                    Random
                  </Button>
                  <Slider disabled={!isEnabled}
                          step={0.1} min={Defaults.PERIOD_MIN} max={Defaults.PERIOD_MAX}
                          value={parseFloat(attr?.variance ?? '0')}
                          onChange={(value: any) => modifySelection(name, {variance: value})}/>
                </Col>
              </Form.Group>
            </div>
          </Accordion>
        </div>,
      );
    }

    return nodes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, selection]);

  return (
    <div className="mt-0 checkbox-align ">
      <Form.Check
        className="pull-right"
        type="switch"
        id={`allow_disasters-switch-${nanoid(5)}`}
        label="Allow disasters throughout the gameplay"
        checked={enabled}
        onChange={e => setEnabled(e.target.checked)}
      />
      <div className="mt-2 mb-3">
        <Select
          isDisabled={!enabled}
          value={null}
          menuPortalTarget={document.body}
          options={renderSelectOptions()}
          placeholder="Choose disaster..."
          onChange={(option: Option | any, {action}): void => {
            if (action === 'select-option' && option) {
              modifySelection(option.value, getInitialValues());
            }
          }}
        />
      </div>
      {selectionNodes()}
    </div>
  );
};

// Properties validation
DisasterContainer.propTypes = {
  enabled: PropTypes.bool,
  attributes: PropTypes.object,
  onChange: PropTypes.func,
};

export default DisasterContainer;
