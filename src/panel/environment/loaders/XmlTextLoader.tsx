// noinspection com.intellij.reactbuddy.ExhaustiveDepsInspection

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import xmlFormatter from 'xml-formatter';
import {ButtonGroup, Button, Modal, Form, Alert, Row, Col} from 'react-bootstrap';

// icons
import {IconCheck, IconCodeXml, IconEraser, IconImport, IconWandSparkles} from '~/components/icons/app';

// utils
import {validate, ValidationError} from '~/helpers/xml';
import {xmlToReduxJson} from '~/data/environments/loader';

// redux
import {useAppDispatch} from '~redux/hooks';
import {updateEnvironmentRaw} from '~redux/reducers';

/** XmlTextLoader functional component */
function XmlTextLoader() {
  const dispatch = useAppDispatch();
  const inputRef = React.createRef<HTMLTextAreaElement>();

  const [showModel, setShowModel] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [value, setValue] = React.useState<string>('');

  const xmlValidated: boolean | ValidationError = validate(value.trim());
  const xmlError: string = typeof xmlValidated !== 'boolean' ? xmlValidated.err.msg : '';
  const isXmlValid: boolean = xmlValidated === true;

  /** Focus input field */
  const focusInput = (): void => {
    inputRef.current && inputRef.current.focus();
  };

  /** Import button click handler */
  const onImportClick = React.useCallback(async () => {
    try {
      const json = xmlToReduxJson(value);
      dispatch(updateEnvironmentRaw(json?.environment ?? {}));
      setShowModel(false);
    } catch (e: any) {
      setError(e.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /** Prettify button click handler */
  const onPrettifyClick = React.useCallback((): void => {
    setValue(
      xmlFormatter(value, {indentation: '  '}),
    );
    focusInput();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /** Clear button click handler */
  const onClearClick = React.useCallback((): void => {
    setValue('');
    focusInput();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <Button variant="secondary" onClick={() => setShowModel(true)}>
        <IconImport/> Import from XML
      </Button>
      <Modal
        size="xl"
        show={showModel}
        onShow={() => focusInput()}
        onHide={() => setShowModel(false)}
        backdrop="static"
        keyboard={false}>
        <Modal.Header>
          <Modal.Title><IconCodeXml width="20" height="20"/> Import Environment XML</Modal.Title>
          <button
            onClick={() => setShowModel(false)} type="button" className="close"><span aria-hidden="true">×</span><span
            className="sr-only">Close</span></button>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            ref={inputRef}
            value={value}
            placeholder="Paste environment xml text here..."
            as="textarea" className="font-family-code"
            style={{height: 500}}
            onChange={(e) => {
              const val: string = String(e.currentTarget.value).trim();
              setValue(val);
              setTimeout(() => setError(''), 50);
            }}/>
          {value.trim() && (error || xmlError.trim()) && (
            <Alert className="mt-3 mb-0" variant="danger">
              <strong>Error</strong>: {error || xmlError.trim()}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer className="d-block">
          <Row>
            <Col sm="6">
              <ButtonGroup size="sm">
                <Button
                  variant=""
                  disabled={!isXmlValid}
                  onClick={() => onPrettifyClick()}>
                  <IconWandSparkles/> Prettify</Button>
                <Button
                  variant=""
                  disabled={!value.trim()}
                  onClick={() => onClearClick()}>
                  <IconEraser/> Clear</Button>
              </ButtonGroup>
            </Col>
            <Col sm="6" className="text-right">
              <ButtonGroup size="sm">
                <Button
                  className="pl-2 pr-2"
                  variant="success"
                  disabled={!isXmlValid}
                  onClick={() => onImportClick()}>
                  <IconCheck/> Import
                </Button>
                <Button
                  className="pl-3 pr-3"
                  variant="secondary"
                  onClick={() => setShowModel(false)}>
                  Discard
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default XmlTextLoader;
