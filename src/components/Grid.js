import {
  Children, useCallback, useLayoutEffect, useState, useRef, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch'; // or any other pipeline
import { useDrop } from 'react-dnd';
import mergeRefs from '../utils/mergeRefs';
import DropTargetContainer from './DropTarget';
import Tile from './Tile';
import * as grid from '../utils/grid';
import { GridContext } from '../context/GridContext';

const calculateGridStyles = (gridTemplate) => ({
  gridTemplateRows: (gridTemplate.rows.map((row) => `${row}fr`)).join(' '),
  gridTemplateColumns: gridTemplate.columns.map((col) => `minmax(max-content, ${col}fr)`).join(' '),
  gridTemplateAreas: gridTemplate.areas.map((row) => `"${row.join(' ')}"`).join('\n'),
  gridAutoRows: '0px',
});

const resizeWindowAction = (gridTemplate, item, dir, size) => {
  const { rows, columns } = gridTemplate;
  const bounds = grid.getBounds(gridTemplate, item.box);

  const blah = {
    right: [0, 1],
    left: [-1, 0],
    top: [-1, 0],
    bottom: [0, 1],
  };

  if (size === 0) return undefined;
  if (dir === 'right' && bounds.right === (columns.length - 1)) return undefined;
  if (dir === 'left' && bounds.left === 0) return undefined;
  if (dir === 'top' && bounds.top === 0) return undefined;
  if (dir === 'bottom' && bounds.bottom === (rows.length - 1)) return undefined;

  if (dir === 'right' || dir === 'left') {
    const [colToDuplicate, colToStealSizeFrom] = size > 0 ? blah[dir] : blah[dir].reverse();
    const colToUpdate = bounds[dir] + colToStealSizeFrom + (colToDuplicate <= colToStealSizeFrom ? 1 : 0);
    return grid.resizeColumn(
      grid.insertColumn(gridTemplate, bounds[dir] + colToDuplicate, Math.abs(size), { source: item.box }),
      (v, i) => (i === colToUpdate ? Math.max(0, v - Math.abs(size)) : v),
    );
  } if (dir === 'top' || dir === 'bottom') {
    const [rowToDuplicate, rowToStealSizeFrom] = size > 0 ? blah[dir] : blah[dir].reverse();
    const rowToUpdate = bounds[dir] + rowToStealSizeFrom + (rowToDuplicate <= rowToStealSizeFrom ? 1 : 0);

    return grid.resizeRow(
      grid.insertRow(gridTemplate, bounds[dir] + rowToDuplicate, Math.abs(size), { source: item.box }),
      (v, i) => (i === rowToUpdate ? Math.max(0, v - Math.abs(size)) : v),
    );
  }

  return undefined;
};
function Container({
  children, initialLayout = undefined, style, ...props
}) {
  const ref = useRef(null);
  const chArray = Children.toArray(children);
  const [gridTemplate, setGridTemplate] = useState(grid.cleanupGrid(initialLayout || grid.calculateDefaultLayout(chArray.map((c) => c.props.id))));
  const [temporaryGridTemplate, setTemporaryGridTemplate] = useState(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const gridStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'grid',
    gap: '16px',
    justifyItems: 'stretch',
    alignItems: 'stretch',
    ...style,
    ...calculateGridStyles(temporaryGridTemplate || gridTemplate),
  };

  const resizeWindow = useCallback((item, diff, final) => {
    const cb = final ? (p) => { setTemporaryGridTemplate(null); setGridTemplate(grid.cleanupGrid(p)); } : setTemporaryGridTemplate;

    const { rows, columns } = gridTemplate;
    const widthFrs = columns.reduce((a, b) => a + b);
    const heightFrs = rows.reduce((a, b) => a + b);
    const size = item.dir === 'right' || item.dir === 'left' ? (diff.x / width) * widthFrs : (diff.y / height) * heightFrs;
    cb(resizeWindowAction(gridTemplate, item, item.dir, size) || gridTemplate);
  }, [gridTemplate, width, height]);

  const moveWindow = useCallback(({ id }, { box = 'root', dir }, final) => {
    const cb = final ? (p) => { setTemporaryGridTemplate(null); setGridTemplate(grid.cleanupGrid({ ...p, dir })); } : setTemporaryGridTemplate;

    if (box === 'root') {
      const { rows, columns, areas } = gridTemplate;
      const bounds = grid.getBounds(gridTemplate, id);
      const newSize = dir === 'right' || dir === 'left' ? 1 + bounds.right - bounds.left : 1 + bounds.bottom - bounds.top;

      const newAreas = areas.map((data) => {
        const adjRow = data.map((v) => {
          if (v === id) {
            return '.';
          }
          return v;
        });
        return adjRow;
      });

      if (dir === 'top' || dir === 'bottom') {
        const fill = columns.map(() => id);

        cb(grid.insertRow({ rows, columns, areas: newAreas }, dir === 'top' ? 0 : rows.length, newSize, { fill, resize: true }));
      } else if (dir === 'left' || dir === 'right') {
        // insert a new column to the left for the current box
        cb(grid.insertColumn({ rows, columns, areas: newAreas }, dir === 'left' ? 0 : columns.length, newSize, { fill: id, resize: true }));
      }
      return undefined;
    }
    // figure out how much space the dropped-on box already occupies
    const split = dir === 'left' || dir === 'right' ? grid.splitColumn : grid.splitRow;
    const {
      left, right, top, bottom,
    } = grid.getBounds(gridTemplate, box);
    const first = dir === 'left' || dir === 'right' ? left : top;
    const last = dir === 'left' || dir === 'right' ? right : bottom;
    const { rows, columns, areas } = ((last - first) % 2 === 0) ? split(gridTemplate, first + (last - first) / 2) : gridTemplate;

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

    cb({ rows, columns, areas: newAreas });
    return undefined;
  }, [gridTemplate, temporaryGridTemplate]);

  const [, borderDrop] = useDrop(
    () => ({
      accept: 'mirador.handle',
      drop(item, monitor) {
        resizeWindow(item, monitor.getDifferenceFromInitialOffset(), true);
        return undefined;
      },
      hover(item, monitor) {
        if (monitor.canDrop()) {
          resizeWindow(item, monitor.getDifferenceFromInitialOffset(), false);
        }
        return undefined;
      },
    }),
    [resizeWindow, width, height],
  );

  const [{ isOver }, windowDrop] = useDrop(() => ({
    accept: 'mirador.window',
    drop(item, monitor) {
      if (monitor.getDropResult()) {
        moveWindow(item, monitor.getDropResult(), true);
      } else {
        setTemporaryGridTemplate(null);
      }
      return undefined;
    },
    hover({ id }) {
      setTemporaryGridTemplate(grid.cleanupGrid(grid.removeBox(gridTemplate, id)));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [moveWindow, setTemporaryGridTemplate, gridTemplate]);

  const onDropFailed = useCallback(() => {
    setTemporaryGridTemplate(null);
  }, [setTemporaryGridTemplate]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    setWidth(ref.current.getBoundingClientRect().width);
    setHeight(ref.current.getBoundingClientRect().height);
  }, []);

  const gridContext = useMemo(() => (
    {
      gridTemplate,
      setGridTemplate: (g) => setGridTemplate(grid.cleanupGrid(g)),
    }
  ), [gridTemplate, setGridTemplate]);

  return (
    <GridContext.Provider value={gridContext}>
      <div ref={mergeRefs(ref, windowDrop, borderDrop)} style={gridStyle} {...props}>
        <DropTargetContainer isOver={isOver} box="root" size="25px" />
        {Children.map(children, (child) => <Tile id={child.props.id} onDropFailed={onDropFailed}>{child}</Tile>)}
      </div>
    </GridContext.Provider>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  initialLayout: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.number),
    columns: PropTypes.arrayOf(PropTypes.number),
    areas: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  }),
  style: PropTypes.object,
};

function Grid({ children, dragAndDropManager, ...props }) {
  return (
    <DndProvider options={HTML5toTouch} {...(dragAndDropManager && { manager: dragAndDropManager })}>
      <Container {...props}>{children}</Container>
    </DndProvider>
  );
}

Grid.propTypes = {
  children: PropTypes.node.isRequired,
  dragAndDropManager: PropTypes.object,
};

export default Grid;
