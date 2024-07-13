/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import {Accordion as AccordionBootstrap, Card} from 'react-bootstrap';
import type {AccordionProps as AccordionProp, AccordionItemProps, AccordionBodyProps} from 'react-bootstrap';

// elemental components
import AccordionHeader, {AccordionHeaderProps, EventHandler} from '~/components/ui/AccordionHeader';
import cn from 'classname';

export interface AccordionProps {
  eventKey: string;
  activeKey?: string | string[];
  defaultActiveKey?: string;
  header: any;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
  headerAfter?: any;
  children?: any;
  noCard?: boolean;
  darkHeader?: boolean;
  noEndPadding?: boolean;
  noBodyPad?: boolean;
  accordion?: Partial<AccordionProp>;
  toggle?: Partial<AccordionHeaderProps>;
  item?: Partial<AccordionItemProps>;
  body?: Partial<AccordionBodyProps>;
  onHeaderClick?(eventKey: string): void;
  onStateChange?(isCollapsed: boolean): void;
}

export type {EventHandler};

const Div = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const _props: any = {...props, bsPrefix: ''};
  'bsPrefix' in _props && delete _props.bsPrefix;
  return <div {..._props}>{_props.children}</div>;
};

const Accordion = (props: AccordionProps) => {
  props = {
    noCard: false,
    ...props,
  }
  const [activeKey, setActiveKey] = React.useState<string>(props.activeKey as string);

  const CartComponent = !props?.noCard ? Card : Div;
  const CardHeaderComponent = !props?.noCard ? Card.Header : Div;
  const CardBodyComponent = !props?.noCard ? Card.Body : Div;

  React.useEffect(() => {
    props?.activeKey !== undefined && setActiveKey(String(props.activeKey) as string);
  }, [props.activeKey]);

  return (
    <AccordionBootstrap defaultActiveKey={props?.defaultActiveKey} activeKey={activeKey} {...props.accordion}>
      <CartComponent className={cn({'no-padding': !!props?.darkHeader})}>
        <AccordionBootstrap.Item eventKey={props.eventKey} {...props.item}>
          <CardHeaderComponent {...(props?.headerProps || {})}
            bsPrefix={cn('card-header', {'card-header-dark': !!props?.darkHeader}, props?.headerProps?.className)}>
              <AccordionHeader onClick={() => props?.onHeaderClick?.(props.eventKey)} eventKey={props.eventKey} {...props.toggle}>
                {props.header}
              </AccordionHeader>
              {props.headerAfter}
          </CardHeaderComponent>
          <AccordionBootstrap.Body
            onExited={() => props?.onStateChange?.(true)}
            onEntered={() => props?.onStateChange?.(false)}
            {...props.body}>
            <CardBodyComponent className={cn('pt-0', {'p-0': !!props?.noBodyPad})}>
              {props?.children}
            </CardBodyComponent>
          </AccordionBootstrap.Body>
        </AccordionBootstrap.Item>
      </CartComponent>
    </AccordionBootstrap>
  );
};

export default Accordion;
