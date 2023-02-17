/**
 * @typedef {Object} GridTemplate
 * @property {number[]} rows row heights
 * @property {number[]} columns column widths
 * @property {string[][]} areas grid area assignments
 */

/**
 * Get the list of area names from a grid template
 *
 * @param {GridTemplate}
 */
export const getAreaNames = ({ areas }) => {
  const names = new Set();

  areas.forEach((row) => {
    row.forEach((name) => {
      if (name !== '.') {
        names.add(name);
      }
    });
  });

  return names;
};

const removeEmptyGridRowCols = ({
  rows, columns, areas, ...other
}) => {
  const newAreas = areas.filter((row, i) => rows[i] > 0).map((r) => r.filter((v, i) => columns[i] > 0));

  const before = Array.from(getAreaNames({ areas }));
  const after = getAreaNames({ areas: newAreas });

  // as long as we have the same elements, the empty rows/cols are redundant
  if (before.every((item) => after.has(item))) {
    return {
      rows: rows.filter((row) => row > 0),
      columns: columns.filter((col) => col > 0),
      areas: newAreas,
      ...other,
    };
  }

  return {
    rows, columns, areas, ...other,
  };
};

const cleanupRedundantRows = ({
  rows, columns, areas, ...other
}) => {
  // select the rows that are the same as the row above them
  const rowsToCompact = areas.map((row, i) => (areas[i - 1] && row.every((v, j) => v === areas[i - 1][j]) ? i : null)).filter((v) => v !== null);
  const newRows = rows.map((c, i) => (rowsToCompact.includes(i + 1) ? c + rows[i + 1] : c)).filter((v, i) => !rowsToCompact.includes(i));

  return ({
    rows: newRows,
    columns,
    areas: areas.filter((row, i) => !rowsToCompact.includes(i)),
    ...other,
  });
};

const cleanupRedundantColumns = ({
  rows, columns, areas, ...other
}) => {
  const columnsToCompact = columns.map((_c, i) => {
    if (i === 0) return null;

    const prevCol = areas.map((row) => row[i - 1]);
    const thisCol = areas.map((row) => row[i]);

    return thisCol.every((v, j) => v === prevCol[j]) ? i : null;
  });

  const newColumns = columns.map((c, i) => (columnsToCompact.includes(i + 1) ? c + columns[i + 1] : c)).filter((v, i) => !columnsToCompact.includes(i));

  return ({
    rows,
    columns: newColumns,
    areas: areas.map((row) => row.filter((v, i) => !columnsToCompact.includes(i))),
    ...other,
  });
};

const cleanupPlaceholderColumns = ({
  rows, columns, areas, ...other
}) => {
  const columnsToRemove = columns.map((c, i) => (areas.every((row) => row[i] === '.') ? i : null)).filter((v) => v !== null);
  const newColumns = columns.filter((v, i) => !columnsToRemove.includes(i));

  const adj = columns.reduce((a, b) => a + b, 0) / newColumns.reduce((a, b) => a + b, 0);
  return ({
    rows,
    columns: newColumns.map((c) => c * adj),
    areas: areas.map((row) => row.filter((v, i) => !columnsToRemove.includes(i))),
    ...other,
  });
};

const cleanupPlaceholderRows = ({
  rows, columns, areas, ...other
}) => {
  const rowsToRemove = rows.map((c, i) => (areas[i].every((v) => v === '.') ? i : null)).filter((v) => v !== null);
  const newRows = rows.filter((v, i) => !rowsToRemove.includes(i));

  const adj = rows.reduce((a, b) => a + b, 0) / newRows.reduce((a, b) => a + b, 0);
  return ({
    rows: newRows.map((c) => c * adj),
    columns,
    areas: areas.filter((row, i) => !rowsToRemove.includes(i)),
    ...other,
  });
};

const calculateSpans = (areas) => {
  const spans = new Map();

  areas.forEach((row, i) => {
    row.forEach((v, j) => {
      if (!spans.has(v)) {
        spans.set(v, {
          id: v, top: Number.MAX_SAFE_INTEGER, left: Number.MAX_SAFE_INTEGER, bottom: -1, right: -1,
        });
      }

      const obj = spans.get(v);

      obj.top = Math.min(obj.top, i);
      obj.left = Math.min(obj.left, j);
      obj.bottom = Math.max(obj.bottom, i);
      obj.right = Math.max(obj.right, j);
    });
  });

  return spans;
};

const attemptBinPacking = ({
  rows, columns, areas, dir = 'left', ...other
}) => {
  if (areas.reduce((sum, row) => sum + row.filter((v) => v === '.').length) === 0) return { rows, columns, areas };

  const spans = calculateSpans(areas);
  const horizontal = [
    areas.map((row) => row.map((v, j) => {
      if (v !== '.') return v;

      const span = spans.get(v);
      const neighbor = spans.get(row[j - 1]);

      if (neighbor && neighbor.top >= span.top && neighbor.bottom <= span.bottom) return row[j - 1];

      return '.';
    })),
    areas.map((row) => row.map((v, j) => {
      if (v !== '.') return v;

      const span = spans.get(v);
      const neighbor = spans.get(row[j + 1]);

      if (neighbor && neighbor.top >= span.top && neighbor.bottom <= span.bottom) return row[j + 1];

      return '.';
    })),
  ];

  const vertical = [
    areas.map((row, i) => row.map((v, j) => {
      if (v !== '.' || i === 0) return v;

      const span = spans.get(v);
      const neighbor = spans.get(areas[i - 1][j]);

      if (neighbor && neighbor.left >= span.left && neighbor.right <= span.right) return areas[i - 1][j];

      return '.';
    })),
    areas.map((row, i) => row.map((v, j) => {
      if (v !== '.' || i === (areas.length - 1)) return v;

      const span = spans.get(v);
      const neighbor = spans.get(areas[i + 1][j]);

      if (neighbor && neighbor.left >= span.left && neighbor.right <= span.right) return areas[i + 1][j];

      return '.';
    })),
  ];
  const attempts = dir === 'left' || dir === 'right' ? [areas, ...horizontal, ...vertical] : [areas, ...vertical, ...horizontal];

  const newAreas = attempts.reduce((best, next) => {
    const bestScore = best.reduce((sum, row) => sum + row.filter((v) => v === '.').length, 0);
    const nextScore = next.reduce((sum, row) => sum + row.filter((v) => v === '.').length, 0);

    return nextScore < bestScore ? next : best;
  });

  return {
    rows, columns, areas: newAreas, ...other,
  };
};

const iterativeBinPacking = (grid) => {
  const iterations = Math.max(grid.columns.length, grid.rows.length);
  return Array(iterations).fill(0).reduce((g) => attemptBinPacking(g), grid);
};

const rescaleGrid = ({ rows, columns, ...other }) => {
  const rowSum = rows.reduce((a, b) => a + b, 0);
  const colSum = columns.reduce((a, b) => a + b, 0);

  if (rowSum >= 1 && colSum >= 1) return { rows, columns, ...other };

  const rowScale = rowSum < 1 ? 1 / rowSum : 1;
  const colScale = colSum < 1 ? 1 / colSum : 1;

  return {
    rows: rows.map((r) => r * rowScale),
    columns: columns.map((c) => c * colScale),
    ...other,
  };
};

export const cleanupGrid = (grid) => {
  const steps = [
    removeEmptyGridRowCols,
    cleanupRedundantRows,
    cleanupRedundantColumns,
    cleanupPlaceholderColumns,
    cleanupPlaceholderRows,
    iterativeBinPacking,
    rescaleGrid,
  ];

  return steps.reduce((g, step) => step(g) || grid, grid);
};

/**
 * Insert a new column into the grid
 *
 * @param {GridTemplate} param0
 * @param {Number} index
 * @param {Number} size
 * @param {Object} param3
 * @param {String} param3.fill the value to fill the new column with
 * @param {Boolean} param3.resize whether to resize the existing columns to preserve the overall proportions
 * @returns
 */
export const insertColumn = ({
  rows, columns, areas, ...other
}, index, size, { fill = undefined, resize = false } = {}) => {
  const colSize = columns.reduce((a, b) => a + b, 0);
  const adj = resize ? 1 - (size / colSize) : 1;

  if (rows.length === 0 && columns.length === 0) {
    return {
      rows: [1],
      columns: [1],
      areas: [[fill || '.']],
    };
  }

  return {
    rows,
    columns: [...columns.slice(0, index).map((i) => i * adj), size, ...columns.slice(index).map((i) => i * adj)],
    areas: areas.map((row) => [...row.slice(0, index), fill || row[Math.min(index, row.length - 1)], ...row.slice(index)]),
    ...other,
  };
};

/**
 * Insert a new row into the grid
 *
 * @param {GridTemplate} param0
 * @param {Number} index
 * @param {Number} size
 * @param {Object} param3
 * @param {String} param3.fill the value to fill the new row with
 * @param {Boolean} param3.resize whether to attempt to preserve the overall row proportions when inserting the new row
 * @returns {GridTemplate}
 */
export const insertRow = ({
  rows, columns, areas, ...other
}, index, size, { fill = undefined, resize = false } = {}) => {
  const rowSize = rows.reduce((a, b) => a + b, 0);
  const adj = resize && size !== rowSize ? 1 - (size / rowSize) : 1;

  return {
    rows: [...rows.slice(0, index).map((i) => i * adj), size, ...rows.slice(index).map((i) => i * adj)],
    columns,
    areas: [...areas.slice(0, index), fill || areas[Math.min(index, rows.length - 1)], ...areas.slice(index)],
    ...other,
  };
};

/**
 *
 * Split a row in half, copying data from the original row to the new row
 *
 * @param {GridTemplate} gridTemplate
 * @param {*} index
 * @returns {GridTemplate}
 */
export const splitRow = ({
  rows, columns, areas, ...other
}, index) => ({
  rows: [...rows.slice(0, index), rows[index] / 2, rows[index] / 2, ...rows.slice(index + 1)],
  columns,
  areas: [...areas.slice(0, index), [...areas[index]], ...areas.slice(index)],
  ...other,
});

/**
 *
 * Split a column in half, copying data from the original column to the new column
 *
 * @param {GridTemplate} gridTemplate
 * @param {*} index
 * @returns {GridTemplate}
 */
export const splitColumn = ({
  rows, columns, areas, ...other
}, index) => ({
  rows,
  columns: [...columns.slice(0, index), columns[index] / 2, columns[index] / 2, ...columns.slice(index + 1)],
  areas: areas.map((row) => [...row.slice(0, index), row[index], ...row.slice(index)]),
  ...other,
});

/**
 * Resize the columns using a function
 * @param {GridTemplate} param0
 * @param {*} func
 * @returns {GridTemplate}
 */
export const resizeColumn = ({
  rows, columns, areas, ...other
}, func) => ({
  rows,
  columns: columns.map(func),
  areas,
  ...other,
});

/**
 * Resize the rows using a function
 * @param {GridTemplate} param0
 * @param {*} func
 * @returns {GridTemplate}
 */
export const resizeRow = ({
  rows, columns, areas, ...other
}, func) => ({
  rows: rows.map(func),
  columns,
  areas,
  ...other,
});

/**
 * Calculate the top/left/right/bottom bounds of a given grid item
 *
 * @param {GridTemplate} param0
 * @param {String} id
 * @returns {Object}
 *   @property {Number} top
 *   @property {Number} left
 *   @property {Number} right
 *   @property {Number} bottom
 */
export const getBounds = ({ areas }, id) => {
  const row = areas.find((r) => r.includes(id)) || [];

  return {
    right: row.lastIndexOf(id) + 1,
    left: row.indexOf(id),
    top: areas.findIndex((r) => r.includes(id)),
    bottom: areas.findLastIndex((r) => r.includes(id)) + 1,
  };
};

/**
 * Create a new grid layout with one column per child
 * @returns {GridTemplate}
 */
export const calculateDefaultLayout = (children) => (
  { rows: [1], columns: Array(children.length).fill(1), areas: [children] }
);

export const removeBox = (grid, id) => (
  {
    ...grid,
    areas: grid.areas.map((row) => {
      const adjRow = row.map((v) => {
        if (v === id) {
          return '.';
        }
        return v;
      });
      return adjRow;
    }),
  }
);

export const filter = (grid, fn = () => {}) => (
  {
    ...grid,
    areas: grid.areas.map((row) => {
      const adjRow = row.map((v) => {
        if (fn(v)) {
          return '.';
        }
        return v;
      });
      return adjRow;
    }),
  }
);

export const resizeBox = (grid, id, dir, size) => {
  const { rows, columns } = grid;
  const bounds = getBounds(grid, id);

  if (dir === 'right' && bounds.right === columns.length) return grid;
  if (dir === 'left' && bounds.left === 0) return grid;
  if (dir === 'top' && bounds.top === 0) return grid;
  if (dir === 'bottom' && bounds.bottom === rows.length) return grid;

  const resize = (dir === 'right' || dir === 'left') ? resizeColumn : resizeRow;
  return resize(
    grid,
    (v, i) => {
      if (i === bounds[dir]) {
        return Math.max(0, v - size);
      }

      if (i === bounds[dir] - 1) {
        return Math.max(0, v + size);
      }

      return v;
    },
  );
};
