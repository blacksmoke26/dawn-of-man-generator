// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';

// Types
import type { Node } from 'react';
import { Dispatch } from 'redux';

// Redux
import { setEnvironment } from './../../redux/actions';

// Components
import XmlImporter from './XmlImporter';

// Utils
import { labels, environments } from './../../data/environments/builtin';

// Styles
import * as reactSelect from './../../blocks/react-select';

/**
 * Presets functional component
 */
const Presets = (): Node => {
	const dispatch: Dispatch = useDispatch();
	
	return (
		<div className="mb-2">
			<Select
				getOptionLabel={option => (
					<div>
						<div className="text-info">{option.label}</div>
						<div className="text-size-xxs text-muted">{option.desc}</div>
					</div>
				)}
				isClearable={true}
				getOptionValue={option => option.value}
				theme={reactSelect.theme}
				styles={{
					...reactSelect.styles,
					control: styles => ({...styles, paddingTop: '5px', paddingBottom: '5px'}),
				}}
				menuPortalTarget={document.body}
				options={labels}
				placeholder="Choose preset..."
				onChange={( selected: ?Object, {action}: Object ) => {
					if ( action === 'select-option' && selected ) {
						const envName: string = selected.value;
						if ( environments.hasOwnProperty(envName) ) {
							const envData = environments[envName]();
							dispatch(setEnvironment(envData));
						}
					}
				}}
			/>
			<XmlImporter/>
		</div>
	);
};

export default Presets;
