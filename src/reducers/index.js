import * as operations from '../utils/grid';

const gridReducer = (state, action) => {
  switch (action.type) {
    case 'update_windows': {
      const layoutAreaNames = operations.getAreaNames(state);
      const added = action.childIds.filter((id) => !layoutAreaNames.has(id));
      const removed = Array.from(layoutAreaNames).filter((id) => !action.childIds.includes(id));

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
    case 'move': {
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
        const newSize = dir === 'right' || dir === 'left' ? bounds.right - bounds.left : bounds.bottom - bounds.top;

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

        const { rows, columns, areas } = ((last - first) % 2 === 1) ? split(state, Math.floor(first + (last - first) / 2)) : state;
        const midpoint = Math.floor((first + last + (((last - first) % 2 === 1) ? 1 : 0)) / 2);
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
      if (value[dir] === 0) return state;

      const widthFrs = columns.reduce((a, b) => a + b, 0);
      const heightFrs = rows.reduce((a, b) => a + b, 0);

      const size = (dir === 'right' || dir === 'left') ? value[dir] * widthFrs : value[dir] * heightFrs;
      const result = operations.resizeBox(state, id, dir, size);

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

export default gridReducer;
