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

export interface AccordionProps {
  eventKey: string;
  activeKey?: string | string[];
  defaultActiveKey?: string;
  header: any;
  headerAfter?: any;
  children?: any;
  accordion?: Partial<AccordionProp>;
  toggle?: Partial<AccordionHeaderProps>;
  item?: Partial<AccordionItemProps>;
  body?: Partial<AccordionBodyProps>;
}

export type {EventHandler};

const Accordion = (props: AccordionProps) => {
  const [activeKey, setActiveKey] = React.useState<string>(props.activeKey as string);

  React.useEffect(() => {
    props.activeKey && setActiveKey(props.activeKey as string);
  }, [props.activeKey]);

  return (
    <AccordionBootstrap defaultActiveKey={props?.defaultActiveKey} activeKey={activeKey} {...props.accordion}>
      <Card>
        <AccordionBootstrap.Item eventKey={props.eventKey} {...props.item}>
          <Card.Header>
            <div className="clearfix">
              <AccordionHeader eventKey={props.eventKey} {...props.toggle}>
                {props.header}
              </AccordionHeader>
              {props.headerAfter}
            </div>
          </Card.Header>
          <AccordionBootstrap.Body {...props.body}>
            <Card.Body className="pt-0">
              {props?.children}
            </Card.Body>
          </AccordionBootstrap.Body>
        </AccordionBootstrap.Item>
      </Card>
    </AccordionBootstrap>
  );
};

export default Accordion;
