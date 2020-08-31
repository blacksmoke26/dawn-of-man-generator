// @flow

import React from 'react';
import * as PropTypes from 'prop-types';
import { ButtonGroup, Button, Tabs, Tab, Card } from 'react-bootstrap';

// Types
import type { Node } from 'react';
import type { LocationProps } from './../../../../utils/location';

// Components
import Location from './Location';

// Utils
import * as location from './../../../../utils/location';

/** Maximum limit of locations tabs */
const LOCATIONS_MAX_COUNT: number = 12;

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
			addLocation();
		}
	}, [init]);
	
	/** Add new location */
	const addLocation = (): void => {
		const randLocation: LocationProps = location.randomizeLocation();
		setLocations(( current: Array<LocationProps> ) => ([
			...current,
			randLocation,
		]));
		setActiveKey(randLocation._id);
	};
	
	/** Remove location */
	const removeLocation = ( id: string ): void => {
		const lastIndex: string = locations.findIndex(v => v._id === id);
		const lastId: string = locations[lastIndex-1]._id;
		const newLocations = locations.filter(v => v._id !== id);
		setLocations(newLocations);
		setActiveKey(lastId);
	};
	
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
			<div className="mb-3">
				<ButtonGroup>
					<Button variant="secondary" size="sm"
						disabled={total >= LOCATIONS_MAX_COUNT} onClick={() => {
						if ( total <= LOCATIONS_MAX_COUNT  ) {
							addLocation();
						}
					}}>New Location</Button>
					<Button variant="danger" size="sm" disabled={total <= 1} onClick={() => {
						setLocations([]); addLocation();
					}}>Remove All</Button>
				</ButtonGroup>
			</div>
			<Tabs activeKey={activeKey} id="locations-tab" className="nav-tabs-bottom" onSelect={k => setActiveKey(k)}>
				{locations.map((location, i: number) => (
					<Tab eventKey={location._id} key={location._id} as={'div'}
						title={
							<>
								<span className="text-size-sm pr-2">{location.name}</span>
								<Button hidden={i === 0} variant="link"
									className="text-color-default text-decoration-none p-0" style={{
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
							<Location values={location} onChange={updated => {
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
