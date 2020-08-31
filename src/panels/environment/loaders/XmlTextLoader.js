// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-31
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import xmlFormatter from 'xml-formatter';

// Types
import type { Node } from 'react';
import type { Dispatch } from 'redux';

// Redux
import { setParsedEnvironment } from './../../../redux/actions';

// Utils
import { xmlToReduxJson, validateXml } from './../../../data/environments/loader/index';

/**
 * XmlTextLoader functional component
 */
const XmlTextLoader = (): Node => {
	const dispatch: Dispatch = useDispatch();
	const [showModel, setShowModel] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string>('');
	const [value, setValue] = React.useState<string>('');
	const isValidXml: boolean = validateXml(value);
	
	const onImportClick = async (): void => {
		try {
			const json = xmlToReduxJson(value);
			await dispatch(setParsedEnvironment(json));
			setShowModel(false);
		} catch ( e ) {
			setError(e.message);
		}
	};

	return (
		<>
			<Button variant="light" onClick={() => setShowModel(true)}>Paste Text</Button>
			<Modal size="xl"
				show={showModel}
				onHide={() => setShowModel(false)}
				backdrop="static"
				keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Paste XML Text</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Control value={value} onChange={(e) => {
						const val: string = String(e.currentTarget.value).trim();
						setValue(val);
						setTimeout(() => setError(''), 50);
					}} as="textarea" className="font-family-code" style={{height: 500}} />
					{error && (
						<Alert className="mt-2 mb-0" variant="danger">
							<strong>Error</strong>: {error}
						</Alert>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant=""
						disabled={!isValidXml}
						onClick={() => {
							const formatted = xmlFormatter(value, {indentation: '  '})
							setValue(formatted);
						}}>Format XML</Button>
					<Button variant="primary"
						disabled={!isValidXml}
						onClick={() => onImportClick()}>Import</Button>
					<Button
						variant="secondary"
						onClick={() => setShowModel(false)}>
						Discard
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default XmlTextLoader;
