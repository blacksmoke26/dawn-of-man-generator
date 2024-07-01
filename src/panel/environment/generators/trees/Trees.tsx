/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {Form} from 'react-bootstrap';

// elemental components
import PanelToolbar from '~/components/environment/PanelToolbar';

// utils
import * as random from '~/utils/random';

// redux
import {useAppSelector} from '~redux/hooks';
import {COLOR_WHITISH} from '~/components/icons/app';

// types
import {Json} from '~/types/json.types';

export interface Props {
	checked?: boolean,
	onChange(template: string, values?: Json): void,
}

/** Trees functional component */
const Trees = ( props: Props ) => {
	props = merge({
		checked: false,
		onChange: () => {},
	}, props);

	const [checked, setChecked] = React.useState<boolean>(props.checked as boolean);
	const [trees, setTrees] = React.useState<string[]>(random.randomTrees());

	const treesAttribute = useAppSelector(({environment}) => environment.values?.trees);

	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = treesAttribute ?? null;

		if ( typeof extValue === 'boolean' ) {
			setChecked(extValue);
		} else if ( Array.isArray(extValue) ) {
			setChecked(true);
			setTrees(extValue);
		}
	}, [treesAttribute]);

	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), trees);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [trees, checked]);

	const toTemplateText = (): string => {
		return !trees.length || !checked
			? ''
			: `<trees values="${trees.join(' ')}"/>`;
	}

	return (
		<div className={cn('mb-2', {'text-muted': !checked})}>

			<PanelToolbar
        checked={checked}
        heading="Present Trees"
        description="What trees are present in the level."
        onCheckboxChange={state => setChecked(state)}
        value={(
          <>
            {!!trees.length && <>{trees.length}
              <strong style={{marginLeft: 3, marginRight: 3, color: COLOR_WHITISH}}>/</strong>
              <span style={{color: COLOR_WHITISH}}>{random.trees.length}</span>
            </>}
          </>
        )}
        allowShuffle
        onShuffle={() => setTrees(random.randomTrees())}
        allowClear
        onClear={() => setTrees([])}
        allowAll
        onAll={() => setTrees([...random.trees])}
        disabled={!checked}/>

			<ul className="list-unstyled list-inline fixed-width mb-0 checkbox-align">
				{random.trees.map(v => (
					<li key={v} className="list-inline-item mb-1">
						<Form.Check
							disabled={!checked}
							type="switch"
							data-value={v}
							checked={trees.findIndex(val => v === val) !== -1}
							id={`trees_${v}`}
							label={v}
							onChange={(e) => {
								const list = trees.filter(val => val !== e.target.getAttribute('data-value'));
								e.target.checked && list.push(v);
								setTrees([...list]);
							}}
						/>
					</li>
				))}
			</ul>
		</div>
	);
};

// Properties validation
Trees.propTypes = {
	checked: PropTypes.bool,
	onChange: PropTypes.func,
};

export default Trees;
