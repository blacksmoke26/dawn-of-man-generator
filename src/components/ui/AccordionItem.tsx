/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import {Accordion, Card} from 'react-bootstrap';
import type {AccordionItemProps, AccordionBodyProps} from 'react-bootstrap';

// elemental components
import AccordionHeader, {AccordionHeaderProps} from '~/components/ui/AccordionHeader';

export interface AccordionProps {
  eventKey: string;
  header: any;
  children?: any;
  toggle?: Partial<AccordionHeaderProps>;
  item?: Partial<AccordionItemProps>;
  body?: Partial<AccordionBodyProps>;
}

const AccordionItem = (props: AccordionProps) => (
  <Card>
    <Accordion.Item eventKey={props.eventKey} {...props.item}>
      <Card.Header>
        <AccordionHeader eventKey={props.eventKey} {...props.toggle}>
          {props.header}
        </AccordionHeader>
      </Card.Header>
      <Accordion.Body {...props.body}>
        <Card.Body className="pt-0">
          {props?.children}
        </Card.Body>
      </Accordion.Body>
    </Accordion.Item>
  </Card>
);

export default AccordionItem;
