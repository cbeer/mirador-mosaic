import {
  useReducer, createContext, useContext, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import * as operations from '../utils/grid';
import gridReducer from '../reducers';

export const GridContext = createContext(undefined);
export const GridDispatchContext = createContext(undefined);


export function GridProvider({ children, childIds, value }) {
  const upstreamContext = useContext(GridContext);
  const upstreamDispatch = useContext(GridDispatchContext);
  const [gridTemplate, dispatch] = useReducer(gridReducer, value, (l) => operations.cleanupGrid(l || operations.calculateDefaultLayout(childIds)));

  useEffect(() => {
    const dispatchFn = upstreamDispatch || dispatch;

    dispatchFn({ type: 'update_windows', childIds });
  }, [childIds]);

  if (upstreamContext) return children;

  return (
    <GridContext.Provider value={gridTemplate}>
      <GridDispatchContext.Provider value={dispatch}>
        {children}
      </GridDispatchContext.Provider>
    </GridContext.Provider>
  );
}

GridProvider.propTypes = {
  children: PropTypes.node.isRequired,
  childIds: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.number),
    columns: PropTypes.arrayOf(PropTypes.number),
    areas: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  }),
};
