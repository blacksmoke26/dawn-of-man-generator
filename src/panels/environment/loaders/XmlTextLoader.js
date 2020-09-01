// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-31
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { ButtonGroup, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import xmlFormatter from 'xml-formatter';

// Types
import type { Node, Ref } from 'react';
import type { Dispatch } from 'redux';

// Redux
import { setParsedEnvironment } from './../../../redux/actions';

// Utils
import { xmlToReduxJson, validateXml } from './../../../data/environments/loader/index';

/** XmlTextLoader functional component */
function XmlTextLoader (): Node {
	const dispatch: Dispatch = useDispatch();
	const inputRef: Ref = React.createRef();
	
	const [showModel, setShowModel] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string>('');
	const [value, setValue] = React.useState<string>('');
	
	const xmlValidated = validateXml(value.trim());
	const isXmlValid: boolean = value.trim() && xmlValidated.valid;
	
	/** Focus input field */
	const focusInput = (): void => {
		inputRef.current && inputRef.current.focus();
	};
	
	/** Import button click handler */
	const onImportClick = React.useCallback(async (): void => {
		try {
			const json = xmlToReduxJson(value);
			await dispatch(setParsedEnvironment(json));
			setShowModel(false);
		} catch ( e ) {
			setError(e.message);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);
	
	/** Prettify button click handler */
	const onPrettifyClick = React.useCallback((): void => {
		setValue(
			xmlFormatter(value, {indentation: '  '})
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
			<Button variant="light" onClick={() => setShowModel(true)}>Paste Text</Button>
			<Modal size="xl"
				show={showModel}
				onShow={() => focusInput()}
				onHide={() => setShowModel(false)}
				backdrop="static"
				keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Paste XML Text</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Control ref={inputRef} value={value} onChange={(e) => {
						const val: string = String(e.currentTarget.value).trim();
						setValue(val);
						setTimeout(() => setError(''), 50);
					}} as="textarea" className="font-family-code" style={{height: 500}} />
					{value.trim() && (error || xmlValidated.error) && (
						<Alert className="mt-3 mb-0" variant="danger">
							<strong>Error</strong>: {error || xmlValidated.error}
						</Alert>
					)}
				</Modal.Body>
				<Modal.Footer className="d-block">
					<Row>
						<Col sm="6">
							<ButtonGroup size="sm">
								<Button variant=""
									disabled={!isXmlValid}
									onClick={() => onPrettifyClick()}>Prettify</Button>
								<Button variant=""
									disabled={!value.trim()}
									onClick={() => onClearClick()}>Clear</Button>
							</ButtonGroup>
						</Col>
						<Col sm="6" className="text-right">
							<ButtonGroup size="sm">
								<Button variant="success"
									disabled={!isXmlValid}
									onClick={() => onImportClick()}>Import</Button>
								<Button
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
