/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import {Button, useAccordionButton} from 'react-bootstrap';

export type EventHandler = React.EventHandler<React.SyntheticEvent>;

export interface AccordionHeaderProps {
  children?: React.ReactElement | any;
  eventKey?: string;

  onClick?: (event: EventHandler | undefined) => void;
}

const AccordionHeader = ({children, eventKey, onClick}: AccordionHeaderProps) => {
  const eventHandler = 'function' === typeof onClick ? onClick : () => {
  };
  const decoratedOnClick = useAccordionButton(eventKey as string, eventHandler as any);

  return (
    <Button variant="link p-0" onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      decoratedOnClick(e);
    }}>
      {children}
    </Button>
  );
};

export default AccordionHeader;
