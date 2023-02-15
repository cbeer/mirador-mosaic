export const removeEmptyGridRowCols = ({
  rows, columns, areas, ...other
}) => ({
  rows: rows.filter((row) => row > 0),
  columns: columns.filter((col) => col > 0),
  areas: areas.filter((row, i) => rows[i] > 0).map((r) => r.filter((v, i) => columns[i] > 0)),
  ...other,
});

export const cleanupRedundantRows = ({
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

export const cleanupRedundantColumns = ({
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

export const cleanupPlaceholderColumns = ({
  rows, columns, areas, ...other
}) => {
  const columnsToRemove = columns.map((c, i) => (areas.every((row) => row[i] === '.') ? i : null)).filter((v) => v !== null);
  const newColumns = columns.filter((v, i) => !columnsToRemove.includes(i));

  const adj = columns.reduce((a, b) => a + b) / newColumns.reduce((a, b) => a + b);
  return ({
    rows,
    columns: newColumns.map((c) => c * adj),
    areas: areas.map((row) => row.filter((v, i) => !columnsToRemove.includes(i))),
    ...other,
  });
};

export const cleanupPlaceholderRows = ({
  rows, columns, areas, ...other
}) => {
  const rowsToRemove = rows.map((c, i) => (areas[i].every((v) => v === '.') ? i : null)).filter((v) => v !== null);
  const newRows = rows.filter((v, i) => !rowsToRemove.includes(i));

  const adj = rows.reduce((a, b) => a + b) / newRows.reduce((a, b) => a + b);
  return ({
    rows: newRows.map((c) => c * adj),
    columns,
    areas: areas.filter((row, i) => !rowsToRemove.includes(i)),
    ...other,
  });
};

export const calculateSpans = (areas) => {
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

export const attemptBinPacking = ({
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

export const iterativeBinPacking = (grid) => {
  const iterations = Math.max(grid.columns.length, grid.rows.length);
  return Array(iterations).fill(0).reduce((g) => attemptBinPacking(g), grid);
};

export const cleanupGrid = (grid) => {
  const steps = [
    removeEmptyGridRowCols,
    cleanupRedundantRows,
    cleanupRedundantColumns,
    cleanupPlaceholderColumns,
    cleanupPlaceholderRows,
    iterativeBinPacking,
  ];

  return steps.reduce((g, step) => step(g) || grid, grid);
};

export const insertColumn = ({
  rows, columns, areas, ...other
}, index, size, { fill = undefined, resize = false } = {}) => {
  const colSize = columns.reduce((a, b) => a + b);
  const adj = resize ? 1 - (size / colSize) : 1;

  return {
    rows,
    columns: [...columns.slice(0, index).map((i) => i * adj), size, ...columns.slice(index).map((i) => i * adj)],
    areas: areas.map((row) => [...row.slice(0, index), fill || row[index], ...row.slice(index)]),
    ...other,
  };
};

export const splitColumn = (gridTemplate, index) => {
  const {
    rows, columns, areas, ...other
  } = insertColumn(gridTemplate, index, gridTemplate.columns[index]);

  return {
    rows,
    columns: [...columns.slice(0, index), columns[index] / 2, columns[index] / 2, ...columns.slice(index + 2)],
    areas,
    ...other,
  };
};

export const insertRow = ({
  rows, columns, areas, ...other
}, index, size, { fill = undefined, resize = false } = {}) => {
  const rowSize = rows.reduce((a, b) => a + b);
  const adj = resize && size !== rowSize ? 1 - (size / rowSize) : 1;

  return {
    rows: [...rows.slice(0, index).map((i) => i * adj), size, ...rows.slice(index).map((i) => i * adj)],
    columns,
    areas: [...areas.slice(0, index), fill || areas[index], ...areas.slice(index)],
    ...other,
  };
};

export const splitRow = (gridTemplate, index) => {
  const {
    rows, columns, areas, ...other
  } = insertRow(gridTemplate, index, gridTemplate.rows[index]);

  return {
    rows: [...rows.slice(0, index), rows[index] / 2, rows[index] / 2, ...rows.slice(index + 2)],
    columns,
    areas,
    ...other,
  };
};

export const resizeColumn = ({
  rows, columns, areas, ...other
}, func) => ({
  rows,
  columns: columns.map(func),
  areas,
  ...other,
});

export const resizeRow = ({
  rows, columns, areas, ...other
}, func) => ({
  rows: rows.map(func),
  columns,
  areas,
  ...other,
});

export const getBounds = ({ areas }, id) => {
  const row = areas.find((r) => r.includes(id));

  return {
    right: row.lastIndexOf(id),
    left: row.indexOf(id),
    top: areas.findIndex((r) => r.includes(id)),
    bottom: areas.findLastIndex((r) => r.includes(id)),
  };
};

export const calculateDefaultLayout = (children) => (
  { rows: [1], columns: Array(children.length).fill(1), areas: [children] }
);
