/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import {Form} from 'react-bootstrap';

// elemental components
import PanelToolbar from '~/components/environment/PanelToolbar';

// icons
import {COLOR_WHITISH} from '~/components/icons/app';

// utils
import * as random from '~/utils/random';

// parsers
import {toTreesTemplate} from '~/utils/parser/environment/templates';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/environment/reducers';

// types
import type {Json} from '~/types/json.types';

export interface Props {
  checked?: boolean,

  onChange(template: string, values?: Json): void,
}

/** Trees functional component */
const Trees = (props: Props) => {
  const dispatch = useAppDispatch();

  const [checked, setChecked] = React.useState<boolean>(props?.checked ?? false);
  const [trees, setTrees] = React.useState<string[]>(random.randomTrees());

  const reduxState = useAppSelector(({environment}) => environment.values?.trees);

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setTrees(random.trees);
      dispatch(clearProperty('trees'));
    } else if (Array.isArray(reduxState)) {
      setChecked(true);
      setTrees(reduxState);
      dispatch(clearProperty('trees'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);
  React.useEffect(() => {
    typeof props.onChange === 'function'
    && props.onChange(toTreesTemplate(trees, !checked), trees);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trees, checked]);

  return (
    <div className={cn('mb-2', {'text-muted': !checked})}>
      <PanelToolbar
        checked={checked}
        checkboxPosition="right"
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
        {random.trees.map(name => (
          <li key={name} className="list-inline-item mb-1">
            <Form.Check
              disabled={!checked}
              type="switch"
              data-value={name}
              checked={trees.findIndex(val => name === val) !== -1}
              id={`trees_${name}`}
              label={name}
              onChange={(e) => {
                const list = trees.filter(val => val !== e.target.getAttribute('data-value'));
                e.target.checked && list.push(name);
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
