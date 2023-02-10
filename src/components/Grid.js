import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch' // or any other pipeline
import { useDrop } from 'react-dnd'
import { Children, useCallback, useLayoutEffect, useState, useRef, cloneElement } from "react";
import mergeRefs from '../utils/mergeRefs';
import DropTargetContainer from './DropTarget';
import Tile from './Tile';

const calculateGridStyles = (gridTemplate) => {
  return {
    gridTemplateRows: (gridTemplate.rows.map(row => `${row}fr`).concat(['0px'])).join(' '),
    gridTemplateColumns: gridTemplate.columns.map(col => `minmax(max-content, ${col}fr)`).join(' '),
    gridTemplateAreas: gridTemplate.areas.map(row => `"${row.join(" ")}"`).join("\n"),
    gridAutoRows: '0px'
  }
}

const removeEmptyGridRowCols = ({ rows, columns, areas, ...other }) => {
  return {
    rows: rows.filter(row => row > 0),
    columns: columns.filter(col => col > 0),
    areas: areas.filter((row, i) => rows[i] > 0).map(rows => rows.filter((v, i) => columns[i] > 0)),
    ...other
  }
}

const cleanupRedundantRows = ({ rows, columns, areas, ...other }) => {
  // select the rows that are the same as the row above them
  const rowsToCompact = areas.map((row, i) => areas[i - 1] && row.every((v, j) => v == areas[i - 1][j]) ? i : null).filter(v => v != null);
  const newRows = rows.map((c, i) => rowsToCompact.includes(i + 1) ? c + rows[i + 1] : c).filter((v, i) => !rowsToCompact.includes(i))

  return ({
    rows: newRows,
    columns,
    areas: areas.filter((row, i) => !rowsToCompact.includes(i)),
    ...other
  })
};

const cleanupRedundantColumns = ({ rows, columns, areas, ...other }) => {
  const columnsToCompact = columns.map((_c, i) => {
    if (i == 0) return null;

    const prevCol = areas.map(row => row[i - 1]);
    const thisCol = areas.map(row => row[i]);

    return thisCol.every((v, j) => v == prevCol[j]) ? i : null;
  });

  const newColumns = columns.map((c, i) => columnsToCompact.includes(i + 1) ? c + columns[i + 1] : c).filter((v, i) => !columnsToCompact.includes(i))

  return ({
    rows,
    columns: newColumns,
    areas: areas.map(row => row.filter((v, i) => !columnsToCompact.includes(i))),
    ...other
  })
};

const cleanupPlaceholderColumns = ({ rows, columns, areas, ...other }) => {
  const columnsToRemove = columns.map((c, i) => areas.every((row) => row[i] == '.') ? i : null).filter(v => v != null);
  const newColumns = columns.filter((v, i) => !columnsToRemove.includes(i));

  const adj = columns.reduce((a, b) => a + b) / newColumns.reduce((a, b) => a + b);
  return ({
    rows,
    columns: newColumns.map(c => c * adj),
    areas: areas.map(row => row.filter((v, i) => !columnsToRemove.includes(i))),
    ...other
  })
};

const cleanupPlaceholderRows = ({ rows, columns, areas, ...other }) => {
  const rowsToRemove = rows.map((c, i) => areas[i].every((v) => v == '.') ? i : null).filter(v => v != null);
  const newRows = rows.filter((v, i) => !rowsToRemove.includes(i));

  const adj = rows.reduce((a, b) => a + b) / newRows.reduce((a, b) => a + b);
  return ({
    rows: newRows.map(c => c * adj),
    columns,
    areas: areas.filter((row, i) => !rowsToRemove.includes(i)),
    ...other
  });
};

const calculateSpans = (areas) => {
  const spans = new Map();

  areas.forEach((row, i) => {
    row.forEach((v, j) => {
      if (!spans.has(v)) spans.set(v, { id: v, top: Number.MAX_SAFE_INTEGER, left: Number.MAX_SAFE_INTEGER, bottom: -1, right: -1 });

      const obj = spans.get(v);

      obj.top = Math.min(obj.top, i);
      obj.left = Math.min(obj.left, j);
      obj.bottom = Math.max(obj.bottom, i);
      obj.right = Math.max(obj.right, j);
    })
  });

  return spans;
}

const attemptBinPacking = ({ rows, columns, areas, dir = "left", ...other }) => {
  if (areas.reduce((sum, row) => sum + row.filter(v => v == '.').length) == 0) return { rows, columns, areas }

  const spans = calculateSpans(areas);
  const horizontal = [
    areas.map((row, i) => {
      return row.map((v, j) => {
        if (v != '.') return v;

        const span = spans.get(v);
        const neighbor = spans.get(row[j - 1]);

        if (neighbor && neighbor.top >= span.top && neighbor.bottom <= span.bottom) return row[j - 1];

        return '.';
      });
    }),
    areas.map((row, i) => {
      return row.map((v, j) => {
        if (v != '.') return v;

        const span = spans.get(v);
        const neighbor = spans.get(row[j + 1]);

        if (neighbor && neighbor.top >= span.top && neighbor.bottom <= span.bottom) return row[j + 1];

        return '.';
      })
    })
  ]

  const vertical = [
    areas.map((row, i) => {
      return row.map((v, j) => {
        if (v != '.' || i == 0) return v;

        const span = spans.get(v);
        const neighbor = spans.get(areas[i - 1][j]);

        if (neighbor && neighbor.left >= span.left && neighbor.right <= span.right) return areas[i - 1][j];

        return '.';
      });
    }),
    areas.map((row, i) => {
      return row.map((v, j) => {
        if (v != '.' || i == (areas.length - 1)) return v;

        const span = spans.get(v);
        const neighbor = spans.get(areas[i + 1][j]);

        if (neighbor && neighbor.left >= span.left && neighbor.right <= span.right) return areas[i + 1][j];

        return '.';
      });
    })
  ]
  const attempts = dir == 'left' || dir == 'right' ? [areas, ...horizontal, ...vertical] : [areas, ...vertical, ...horizontal];

  const newAreas = attempts.reduce((best, next) => {
    const bestScore = best.reduce((sum, row) => sum + row.filter(v => v == '.').length, 0);
    const nextScore = next.reduce((sum, row) => sum + row.filter(v => v == '.').length, 0);

    return nextScore < bestScore ? next : best;
  });

  return { rows, columns, areas: newAreas, ...other };
}

const iterativeBinPacking = (grid) => {
  const iterations = Math.max(grid.columns.length, grid.rows.length);
  return Array(iterations).fill(0).reduce((g, i) => attemptBinPacking(g), grid);
};

const cleanupGrid = (grid) => {
  const steps = [
    removeEmptyGridRowCols,
    cleanupRedundantRows,
    cleanupRedundantColumns,
    cleanupPlaceholderColumns,
    cleanupPlaceholderRows,
    iterativeBinPacking
  ];

  return steps.reduce((grid, step) => step(grid) || grid, grid);
}

const insertColumn = ({ rows, columns, areas, ...other }, index, size, { fill = undefined, resize = false } = {}) => {
  const colSize = columns.reduce((a, b) => a + b);
  const adj = resize ? 1 - (size / colSize) : 1;

  return {
    rows,
    columns: [...columns.slice(0, index).map(i => i * adj), size, ...columns.slice(index).map(i => i * adj)],
    areas: areas.map(row => [...row.slice(0, index), fill || row[index], ...row.slice(index)]),
    ...other
  }
}

const splitColumn = (gridTemplate, index) => {
  const { rows, columns, areas, ...other } = insertColumn(gridTemplate, index, gridTemplate.columns[index]);

  return {
    rows,
    columns: [...columns.slice(0, index), columns[index] / 2, columns[index] / 2, ...columns.slice(index + 2)],
    areas,
    ...other
  }
}

const insertRow = ({ rows, columns, areas, ...other }, index, size, { fill = undefined, resize = false } = {}) => {
  const rowSize = rows.reduce((a, b) => a + b);
  const adj = resize && size != rowSize ? 1 - (size / rowSize) : 1;

  return {
    rows: [...rows.slice(0, index).map(i => i * adj), size, ...rows.slice(index).map(i => i * adj)],
    columns,
    areas: [...areas.slice(0, index), fill || areas[index], ...areas.slice(index)],
    ...other
  }
}

const splitRow = (gridTemplate, index) => {
  const { rows, columns, areas, ...other } = insertRow(gridTemplate, index, gridTemplate.rows[index]);

  return {
    rows: [...rows.slice(0, index), rows[index] / 2, rows[index] / 2, ...rows.slice(index + 2)],
    columns,
    areas,
    ...other
  }
}

const resizeColumn = ({ rows, columns, areas, ...other }, func) => {
  return {
    rows,
    columns: columns.map(func),
    areas,
    ...other
  }
}

const resizeRow = ({ rows, columns, areas, ...other }, func) => {
  return {
    rows: rows.map(func),
    columns,
    areas,
    ...other
  }
}

const getBounds = ({ areas }, id) => {
  const row = areas.find(row => row.includes(id));
  return { right: row.lastIndexOf(id), left: row.indexOf(id), top: areas.findIndex(row => row.includes(id)), bottom: areas.findLastIndex(row => row.includes(id)) };
}

const Container = ({ children, initialLayout = undefined, style, ...props }) => {
  const ref = useRef(null);
  const chArray = Children.toArray(children);
  const [gridTemplate, setGridTemplate] = useState(cleanupGrid(initialLayout || { rows: [1], columns: chArray.map((_child) => 1), areas: [chArray.map((child) => child.props.id)]}));
  const [temporaryGridTemplate, setTemporaryGridTemplate] = useState(gridTemplate);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const gridStyle = {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    display: 'grid',
    gap: '16px',
    justifyItems: 'stretch',
    alignItems: 'stretch',
    ...style,
    ...calculateGridStyles(temporaryGridTemplate || gridTemplate)
  }

  const resizeWindowAction = (gridTemplate, item, dir, size) => {
    const { rows, columns } = gridTemplate;
    const bounds = getBounds(gridTemplate, item.box);

    const blah = {
      right: [0, 1],
      left: [-1, 0],
      top: [-1, 0],
      bottom: [0, 1]
    };

    if (size == 0) return;
    if (dir == "right" && bounds.right == (columns.length - 1)) return;
    if (dir == "left" && bounds.left == 0) return;
    if (dir == "top" && bounds.top == 0) return;
    if (dir == "bottom" && bounds.bottom == (rows.length - 1)) return;

    if (dir == "right" || dir == "left") {
      const [colToDuplicate, colToStealSizeFrom] = size > 0 ? blah[dir] : blah[dir].reverse();
      return resizeColumn(
        insertColumn(gridTemplate, bounds[dir] + colToDuplicate, Math.abs(size), { source: item.box }),
        (v, i) => i == bounds[dir] + colToStealSizeFrom + (colToDuplicate <= colToStealSizeFrom ? 1 : 0) ? Math.max(0, v - Math.abs(size)) : v
      )
    } else if (dir == "top" || dir == "bottom") {
      const [rowToDuplicate, rowToStealSizeFrom] = size > 0 ? blah[dir] : blah[dir].reverse();
      return resizeRow(
        insertRow(gridTemplate, bounds[dir] + rowToDuplicate, Math.abs(size), { source: item.box }),
        (v, i) => i == bounds[dir] + rowToStealSizeFrom + (rowToDuplicate <= rowToStealSizeFrom ? 1 : 0) ? Math.max(0, v - Math.abs(size)) : v
      )
    }
  }

  const resizeWindow = useCallback((item, diff, final) => {
    const cb = final ? (props) => { setTemporaryGridTemplate(null); setGridTemplate(cleanupGrid(props)) } : (props) => setTemporaryGridTemplate(props)

    const { rows, columns } = gridTemplate;
    const widthFrs = columns.reduce((a, b) => a + b);
    const heightFrs = rows.reduce((a, b) => a + b);

    cb(resizeWindowAction(gridTemplate, item, item.dir, item.dir == 'right' || item.dir == 'left' ? (diff.x / width) * widthFrs : (diff.y / height) * heightFrs) || gridTemplate);
  }, [gridTemplate, width, height]);

  const moveWindow = useCallback(({ id }, { box = 'root', dir }, final) => {
    const cb = final ? (props) => { setTemporaryGridTemplate(null); setGridTemplate(cleanupGrid({ ...props, dir })) } : setTemporaryGridTemplate;

    if (box == 'root') {
      const { rows, columns, areas } = gridTemplate;
      const bounds = getBounds(gridTemplate, id);
      const newSize = dir == 'right' || dir == 'left' ? 1 + bounds.right - bounds.left : 1 + bounds.bottom - bounds.top;

      const newAreas = areas.map(data => {
        const adjRow = data.map(v => {
          if (v == id) {
            return '.';
          } else {
            return v;
          }
        });
        return adjRow;
      });

      if (dir == 'top' || dir == 'bottom') {
        cb(insertRow({ rows: rows, columns: columns, areas: newAreas }, dir == 'top' ? 0 : rows.length, newSize, { fill: columns.map(_v => id), resize: true }))
      } else if (dir == 'left' || dir == 'right') {
        // insert a new column to the left for the current box
        cb(insertColumn({ rows: rows, columns: columns, areas: newAreas }, dir == 'left' ? 0 : columns.length, newSize, { fill: id, resize: true }));
      }
      return undefined;
    } else {
      // figure out how much space the dropped-on box already occupies
      const split = dir == 'left' || dir == 'right' ? splitColumn : splitRow;
      const { left, right, top, bottom } = getBounds(gridTemplate, box);
      const first = dir == 'left' || dir == 'right' ? left : top;
      const last = dir == 'left' || dir == 'right' ? right : bottom;
      const { rows, columns, areas } = ((last - first) % 2 == 0) ? split(gridTemplate, first + (last - first) / 2) : gridTemplate;

      const midpoint = Math.ceil((first + last + (((last - first) % 2 == 0) ? 1 : 0)) / 2);

      // split the current column and divide it before/after
      const newAreas = areas.map((data, row) => {
        const adjRow = data.map((v, col) => {
          const bound = dir == 'left' || dir == 'right' ? col : row;

          if (v == id) {
            return '.'
          }

          if (dir == 'left' || dir == 'top') {
            if (v == box && bound < midpoint) {
              return id;
            } else {
              return v;
            }
          } else if (dir == 'right' || dir == 'bottom') {
            if (v == box && bound >= midpoint) {
              return id;
            } else {
              return v;
            }
          }
        });
        return adjRow;
      });

      cb({ rows: rows, columns: columns, areas: newAreas })
    }
  }, [gridTemplate, temporaryGridTemplate]);

  const [, borderDrop] = useDrop(
    () => ({
      accept: 'mirador.handle',
      drop(item, monitor) {
        resizeWindow(item, monitor.getDifferenceFromInitialOffset(), true)
        return undefined
      },
      hover(item, monitor) {
        if (monitor.canDrop()) {
          resizeWindow(item, monitor.getDifferenceFromInitialOffset(), false)
        }
        return undefined
      }
    }),
    [resizeWindow, width, height],
  )

  const [{ isOver }, windowDrop] = useDrop(
    () => ({
      accept: 'mirador.window',
      drop(item, monitor) {
        if (monitor.getDropResult()) {
          moveWindow(item, monitor.getDropResult(), true)
        } else {
          setTemporaryGridTemplate(null);
        }
        return undefined
      },
      hover({ id }, monitor) {
        // split the current column and divide it before/after
        const newAreas = gridTemplate.areas.map(row => {
          const adjRow = row.map((v, i) => {
            if (v == id) {
              return '.'
            } else {
              return v;
            }
          });
          return adjRow;
        });
        setTemporaryGridTemplate(cleanupGrid({ ...gridTemplate, areas: newAreas }));
        return undefined
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      })
    }), [moveWindow, setTemporaryGridTemplate, gridTemplate]
  );

  const onDropFailed = useCallback(() => {
    setTemporaryGridTemplate(null);
  }, [setTemporaryGridTemplate]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    setWidth(ref.current.getBoundingClientRect().width);
    setHeight(ref.current.getBoundingClientRect().height);
  }, []);

  return (
    <div ref={mergeRefs(ref, windowDrop, borderDrop)} style={gridStyle} {...props}>
      <DropTargetContainer isOver={isOver} box='root' size='25px' />
      {Children.map(children, child => <Tile id={child.props.id} onDropFailed={onDropFailed}>{child}</Tile>)}
    </div>
  );
}

const Grid = ({ children, ...props }) => {
  return <DndProvider options={HTML5toTouch} {...(props.dragAndDropManager && { manager: props.dragAndDropManager })}>
    <Container {...props}>{children}</Container>
  </DndProvider>
};

export default Grid
