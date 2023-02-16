import {
  useReducer, createContext, useContext, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import * as operations from '../utils/grid';

export const GridContext = createContext(undefined);
export const GridDispatchContext = createContext(undefined);

const gridReducer = (state, action) => {
  switch (action.type) {
    case 'update_windows': {
      const layoutAreaNames = operations.getAreaNames(state);
      const added = action.childIds.filter((id) => !layoutAreaNames.includes(id));
      const removed = layoutAreaNames.filter((id) => !action.childIds.includes(id));

      if (added.length === 0 && removed.length === 0) return state;

      const { columns } = state;

      const newSize = Math.max(1, columns.reduce((a, b) => a + b, 0) / Math.max(columns.length, 1));

      const newState = added.reduce((acc, id) => operations.insertColumn(acc, columns.length, newSize, { fill: id }), state);
      return operations.cleanupGrid(operations.filter(newState, (v) => removed.includes(v)));
    }
    case 'remove': {
      return operations.cleanupGrid(operations.removeBox(state, action.id));
    }
    case 'add': {
      const { columns } = state;
      const newSize = Math.min(1, columns.reduce((a, b) => a + b, 0) / columns.length);
      return operations.insertColumn(state, columns.length, newSize, { fill: action.id });
    }
    case 'set': {
      return operations.cleanupGrid(action.layout);
    }
    case 'start_drag': {
      return { ...state, temporaryLayout: operations.cleanupGrid(operations.removeBox(state, action.id)) };
    }
    case 'end_drag': {
      return { ...state, temporaryLayout: null };
    }
    case 'drop': {
      const { id, box = 'root', dir } = action;
      let result;

      if (box === 'root') {
        const { rows, columns } = state;
        const bounds = operations.getBounds(state, id);
        const newSize = dir === 'right' || dir === 'left' ? 1 + bounds.right - bounds.left : 1 + bounds.bottom - bounds.top;

        const { areas: newAreas } = operations.removeBox(state, id);

        if (dir === 'top' || dir === 'bottom') {
          const fill = columns.map(() => id);

          result = operations.insertRow({ rows, columns, areas: newAreas }, dir === 'top' ? 0 : rows.length, newSize, { fill, resize: true });
        } else if (dir === 'left' || dir === 'right') {
          // insert a new column to the left for the current box
          result = operations.insertColumn({ rows, columns, areas: newAreas }, dir === 'left' ? 0 : columns.length, newSize, { fill: id, resize: true });
        }
      } else {
        // figure out how much space the dropped-on box already occupies
        const split = dir === 'left' || dir === 'right' ? operations.splitColumn : operations.splitRow;
        const {
          left, right, top, bottom,
        } = operations.getBounds(state, box);
        const first = dir === 'left' || dir === 'right' ? left : top;
        const last = dir === 'left' || dir === 'right' ? right : bottom;
        const { rows, columns, areas } = ((last - first) % 2 === 0) ? split(state, first + (last - first) / 2) : state;
        const midpoint = Math.ceil((first + last + (((last - first) % 2 === 0) ? 1 : 0)) / 2);
        // split the current column and divide it before/after
        const newAreas = areas.map((data, row) => {
          const adjRow = data.map((v, col) => {
            const bound = dir === 'left' || dir === 'right' ? col : row;

            if (v === id) {
              return '.';
            }

            if (dir === 'left' || dir === 'top') {
              if (v === box && bound < midpoint) {
                return id;
              }
              return v;
            } if (dir === 'right' || dir === 'bottom') {
              if (v === box && bound >= midpoint) {
                return id;
              }
              return v;
            }

            return v;
          });
          return adjRow;
        });

        result = {
          ...state, rows, columns, areas: newAreas, dir,
        };
      }

      if (result) {
        return { ...operations.cleanupGrid(result), temporaryLayout: null };
      }
      return state;
    }
    case 'resize': {
      const {
        id, value, dir, final,
      } = action;
      const { rows, columns } = state;
      const bounds = operations.getBounds(state, id);

      if (value[dir] === 0) return state;
      if (dir === 'right' && bounds.right === (columns.length - 1)) return state;
      if (dir === 'left' && bounds.left === 0) return state;
      if (dir === 'top' && bounds.top === 0) return state;
      if (dir === 'bottom' && bounds.bottom === (rows.length - 1)) return state;

      const blah = {
        right: [0, 1],
        left: [-1, 0],
        top: [-1, 0],
        bottom: [0, 1],
      };

      const widthFrs = columns.reduce((a, b) => a + b, 0);
      const heightFrs = rows.reduce((a, b) => a + b, 0);

      let result;
      const size = (dir === 'right' || dir === 'left') ? value[dir] * widthFrs : value[dir] * heightFrs;

      if (dir === 'right' || dir === 'left') {
        const [colToDuplicate, colToStealSizeFrom] = size > 0 ? blah[dir] : blah[dir].reverse();
        const colToUpdate = bounds[dir] + colToStealSizeFrom + (colToDuplicate <= colToStealSizeFrom ? 1 : 0);

        result = operations.resizeColumn(
          operations.insertColumn(state, bounds[dir] + colToDuplicate, Math.abs(size), { source: id }),
          (v, i) => (i === colToUpdate ? Math.max(0.01, v - Math.abs(size)) : v),
        );
      } if (dir === 'top' || dir === 'bottom') {
        const [rowToDuplicate, rowToStealSizeFrom] = size > 0 ? blah[dir] : blah[dir].reverse();
        const rowToUpdate = bounds[dir] + rowToStealSizeFrom + (rowToDuplicate <= rowToStealSizeFrom ? 1 : 0);

        result = operations.resizeRow(
          operations.insertRow(state, bounds[dir] + rowToDuplicate, Math.abs(size), { source: id }),
          (v, i) => (i === rowToUpdate ? Math.max(0.01, v - Math.abs(size)) : v),
        );
      }

      if (final && result) {
        return { ...operations.cleanupGrid(result), temporaryLayout: null };
      }
      return { ...state, temporaryLayout: result };
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
};

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
