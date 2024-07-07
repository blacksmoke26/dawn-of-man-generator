// noinspection com.intellij.reactbuddy.ExhaustiveDepsInspection

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import {Button, ButtonGroup, Modal} from 'react-bootstrap';

// elemental components
import XmlEditorInput from '~/components/ui/XmlEditorInput';

// icons
import {IconCheck, IconCodeXml} from '~/components/icons/app';

// utils
import {validate, ValidationError} from '~/helpers/xml';
import {xmlToReduxJson} from '~/data/environments/loader';

// redux
import {useAppDispatch} from '~redux/hooks';
import {overwriteValues} from '~redux/slices/environment/reducers';

/** XmlTextLoader functional component */
function XmlTextLoader() {
  const dispatch = useAppDispatch();

  const [showModel, setShowModel] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');

  const xmlValidated: boolean | ValidationError = validate(value.trim());
  const isXmlValid: boolean = xmlValidated === true;

  /** Import button click handler */
  const onImportClick = () => {
    try {
      const json = xmlToReduxJson(value)?.environment ?? {};
      dispatch(overwriteValues(json));
      setShowModel(false);
    } catch (e: any) {
    }
  };

  return (
    <>
      <Button
        title="Import environment from XML string"
        variant="secondary" onClick={() => setShowModel(true)}>
        <IconCodeXml/> Import XML
      </Button>
      <Modal
        size="xl"
        dialogClassName="mw-85"
        show={showModel}
        fullscreen
        onHide={() => setShowModel(false)}
        backdrop="static"
        keyboard={false}>
        <Modal.Header>
          <Modal.Title>
            <IconCodeXml width="20" height="20"/> Import Environment XML
          </Modal.Title>
          <button
            onClick={() => setShowModel(false)}
            type="button"
            className="close">
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close</span>
          </button>
        </Modal.Header>
        <Modal.Body className="pb-0">
          <XmlEditorInput
            value={value}
            editorProps={{focus: true}}
            onChange={setValue} />
        </Modal.Body>
        <Modal.Footer className="d-block">
          <div className="text-right">
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
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default XmlTextLoader;
