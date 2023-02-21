import {
  Children, useCallback, useRef, useContext, useReducer, useMemo, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch'; // or any other pipeline
import { useDrop } from 'react-dnd';
import mergeRefs from '../utils/mergeRefs';
import DropTargetContainer from './DropTarget';
import Tile from './Tile';
import { GridContext, GridDispatchContext, GridProvider } from '../context/GridProvider';
import gridReducer from '../reducers';

const calculateGridStyles = (gridTemplate) => ({
  gridTemplateRows: (gridTemplate.rows.map((row) => `${row}fr`)).join(' '),
  gridTemplateColumns: gridTemplate.columns.map((col) => `minmax(20px, ${col}fr)`).join(' '),
  gridTemplateAreas: gridTemplate.areas.map((row) => `"${row.join(' ')}"`).join('\n'),
  gridAutoRows: '0px',
});

export function Container({
  children, style, ...props
}) {
  const ref = useRef(null);

  const gridTemplate = useContext(GridContext);
  const dispatch = useContext(GridDispatchContext);

  // we use interally managed state for "temporary" layout while
  // the user is e.g. actively resizing the window. This is especially
  // important if the context state is managed through e.g. redux.
  const [temporaryLayoutData, dispatchTemporaryLayout] = useReducer(gridReducer, gridTemplate);

  // when the gridTemplate changes, keep the temporary layout in sync
  useEffect(() => {
    dispatchTemporaryLayout({ type: 'set', layout: gridTemplate })
  }, [gridTemplate]);

  const gridStyle = useMemo(() => ({
    position: 'absolute',
    inset: 0,
    display: 'grid',
    gap: '16px',
    justifyItems: 'stretch',
    alignItems: 'stretch',
    ...style,
    ...(calculateGridStyles(temporaryLayoutData.temporaryLayout || gridTemplate)),
  }), [temporaryLayoutData, gridTemplate]);

  const resizeWindow = useCallback((item, diff, final) => {
    const cb = final ? dispatch : dispatchTemporaryLayout;

    const { width, height } = ref.current?.getBoundingClientRect() || { width: Infinity, height: Infinity };

    cb({
      final,
      type: 'resize',
      id: item.box,
      dir: item.dir,
      value: {
        top: item.dir === 'top' ? diff.y / height : 0,
        bottom: item.dir === 'bottom' ? diff.y / height : 0,
        left: item.dir === 'left' ? diff.x / width : 0,
        right: item.dir === 'right' ? diff.x / width : 0,
      },
    });
  }, [dispatch, dispatchTemporaryLayout, ref]);

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
    [resizeWindow],
  );

  const onDropFailed = useCallback(() => {
    dispatchTemporaryLayout({ type: 'end_drag' });
  }, [dispatchTemporaryLayout]);

  const [{ isOver }, windowDrop] = useDrop(() => ({
    accept: 'mirador.window',
    drop(item, monitor) {
      const result = monitor.getDropResult();
      if (!result) return onDropFailed();

      dispatch({
        type: 'drop',
        id: item.id,
        box: result.box,
        dir: result.dir,
      });

      return undefined;
    },
    hover({ id }) {
      dispatchTemporaryLayout({ type: 'move', id });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [dispatch, dispatchTemporaryLayout]);

  return (
    <div ref={mergeRefs(ref, windowDrop, borderDrop)} style={gridStyle} {...props}>
      <DropTargetContainer isOver={isOver} box="root" size="25px" hoverSize="30%" />
      {Children.map(children, (child) => <Tile id={child.props.id} onDropFailed={onDropFailed}>{child}</Tile>)}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

function Grid({
  children, dragAndDropManager, initialLayout, ...props
}) {
  return (
    <DndProvider options={HTML5toTouch} {...(dragAndDropManager && { manager: dragAndDropManager })}>
      <GridProvider value={initialLayout} childIds={Children.toArray(children).map((c) => c.props.id)}>
        <Container {...props}>{children}</Container>
      </GridProvider>
    </DndProvider>
  );
}

Grid.propTypes = {
  children: PropTypes.node.isRequired,
  initialLayout: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.number),
    columns: PropTypes.arrayOf(PropTypes.number),
    areas: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  }),
  dragAndDropManager: PropTypes.object,
};

export default Grid;
