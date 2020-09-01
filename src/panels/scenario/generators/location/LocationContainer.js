// @flow

import React from 'react';
import * as PropTypes from 'prop-types';
import { ButtonGroup, Button, Tabs, Tab, Card, Form } from 'react-bootstrap';
import { nanoid } from 'nanoid';
import cn from 'classname';

// Types
import type { Node } from 'react';
import type { LocationProps } from './../../../../utils/location';

// Components
import Location from './Location';

// Utils
import * as location from './../../../../utils/location';

/** Maximum limit of locations tabs */
const LOCATIONS_MAX_COUNT: number = 19;

/** Tab contents wrapper */
const TabContentWrapper = ( props: Object ): Node => {
	return (
		<div style={{marginTop: '1rem'}}>
			<Card className="rounded-0">
				<Card.Body>
					{props.children}
				</Card.Body>
			</Card>
		</div>
	);
};

/**
 * LocationContainer `props` type
 * @type {Object}
 */
type Props = {
	enabled: boolean,
	onChange ( template: string, list: Array<LocationProps> ): void,
};

/** LocationContainer functional component */
function LocationContainer ( props: Props ): Node {
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled);
	const [locations, setLocations] = React.useState<LocationProps[]>([]);
	const [init, setInit] = React.useState<boolean>(false);
	const [activeKey, setActiveKey] = React.useState<string>('');

	React.useEffect(() => {
		if ( !init ) {
			setInit(true);
			newLocation();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [init]);
	
	/** Add new location */
	const newLocation = React.useCallback((): void => {
		const randLocation: LocationProps = location.randomizeLocation();
		setLocations(( current: Array<LocationProps> ) => ([
			...current,
			randLocation,
		]));
		setActiveKey(randLocation._id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	/** Remove location */
	const removeLocation = React.useCallback(( tabId: string ): void => {
		if ( locations.length === 1 ) {
			return;
		}
		
		let tabIdIndex: number = 0;
		
		const tabs: Array<LocationProps> = locations.filter(( tab: LocationProps, index: number ) => {
			tab._id === tabId && (tabIdIndex = index);
			return tab._id !== tabId;
		});
		
		let curValue: string = activeKey;
		
		if ( curValue === tabId ) {
			curValue = tabIdIndex === 0
				? locations[tabIdIndex + 1]._id
				: locations[tabIdIndex - 1]._id;
		}
		
		setLocations(tabs);
		setActiveKey(curValue);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locations, activeKey]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), locations);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locations, enabled]);
	
	/** Generate xml code */
	const toTemplateText = (): string => {
		return enabled
			? `<locations>${locations.map(n => location.nodeToTemplate(n)).join('')}</locations>`
			: '';
	};
	
	/** Total locations count */
	const total: number = locations.length;

	return (
		<>
			<div className="mt-2 mb-2">
				<Form.Check
					className="pull-right"
					type="switch"
					id={`seasons_override-switch-${nanoid(5)}`}
					label="Enable locations"
					checked={enabled}
					onChange={e => setEnabled(e.target.checked)}
				/>
			</div>
			<div className="mb-3">
				<ButtonGroup>
					<Button variant="secondary" size="sm"
						disabled={!enabled || total >= LOCATIONS_MAX_COUNT} onClick={() => {
						if ( total <= LOCATIONS_MAX_COUNT  ) {
							newLocation();
						}
					}}>New Location</Button>
					<Button variant="danger" size="sm" disabled={!enabled || total <= 1} onClick={() => {
						setLocations([]); newLocation();
					}}>Remove All</Button>
				</ButtonGroup>
			</div>
			<Tabs activeKey={activeKey} id="locations-tab"
				className="nav-tabs-bottom" onSelect={k => setActiveKey(k)}>
				{locations.map((location, i: number) => (
					<Tab disabled={!enabled} eventKey={location._id} key={location._id} as={'div'}
						title={
							<>
								<span className={cn('text-size-sm pr-2', {'text-muted': !enabled})}>{location.name}</span>
								<Button disabled={!enabled} hidden={i === 0} variant="link"
									className="text-color-default text-decoration-none p-0"
									style={{
									lineHeight: '10px',
									position: 'relative',
									top: '-2px',
								}} onClick={e => {
									e.preventDefault();
									e.stopPropagation();
									removeLocation(location._id);
								}}>&times;</Button>
							</>
						}>
						<TabContentWrapper>
							<Location enabled={enabled} values={location} onChange={updated => {
								setLocations(current => {
									const list: Array<LocationProps> = [...current];
									const index: number = list.findIndex(loc => loc._id === updated._id);
									list[index] = updated;
									return list;
								});
							}}/>
						</TabContentWrapper>
					</Tab>
				))}
			</Tabs>
		</>
	);
}

// Properties validation
LocationContainer.propTypes = {
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

// Default properties
LocationContainer.defaultProps = {
	enabled: true,
	onChange: () => {},
};

export default LocationContainer;
