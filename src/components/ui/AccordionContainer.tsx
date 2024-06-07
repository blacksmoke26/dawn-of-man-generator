/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import {AccordionProps as AccordionProp, Card} from 'react-bootstrap';
import {Accordion as AccordionBootstrap} from 'react-bootstrap';
import AccordionHeader from '~/components/ui/AccordionHeader';

export interface AccordionProps extends AccordionProp {
  heading?: string;
}

const AccordionContainer = (props: AccordionProps) => (
  <AccordionBootstrap {...props}>
    <Card>
      <Card.Header><AccordionHeader eventKey="">{props?.heading}</AccordionHeader></Card.Header>
      <Card.Body>
        {props?.children}
      </Card.Body>
    </Card>
  </AccordionBootstrap>
);

export default AccordionContainer;
