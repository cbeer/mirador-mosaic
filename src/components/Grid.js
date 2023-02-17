import {
  Children, useCallback, useLayoutEffect, useState, useRef, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch'; // or any other pipeline
import { useDrop } from 'react-dnd';
import mergeRefs from '../utils/mergeRefs';
import DropTargetContainer from './DropTarget';
import Tile from './Tile';
import { GridContext, GridDispatchContext, GridProvider } from '../context/GridProvider';

const calculateGridStyles = (gridTemplate) => ({
  gridTemplateRows: (gridTemplate.rows.map((row) => `${row}fr`)).join(' '),
  gridTemplateColumns: gridTemplate.columns.map((col) => `minmax(max-content, ${col}fr)`).join(' '),
  gridTemplateAreas: gridTemplate.areas.map((row) => `"${row.join(' ')}"`).join('\n'),
  gridAutoRows: '0px',
});

function Container({
  children, style, ...props
}) {
  const ref = useRef(null);
  const gridTemplate = useContext(GridContext);
  const { temporaryLayout } = gridTemplate;
  const dispatch = useContext(GridDispatchContext);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const gridStyle = {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    gap: '16px',
    justifyItems: 'stretch',
    alignItems: 'stretch',
    ...style,
    ...calculateGridStyles(temporaryLayout || gridTemplate),
  };

  const resizeWindow = useCallback((item, diff, final) => {
    dispatch({
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
  }, [dispatch, width, height]);

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

  const [{ isOver }, windowDrop] = useDrop(() => ({
    accept: 'mirador.window',
    drop(item, monitor) {
      const result = monitor.getDropResult();
      if (result) {
        dispatch({
          type: 'drop',
          id: item.id,
          box: result.box,
          dir: result.dir,
        });
      } else {
        dispatch({ type: 'end_drag' });
      }
      return undefined;
    },
    hover({ id }) {
      dispatch({ type: 'start_drag', id });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [dispatch]);

  const onDropFailed = useCallback(() => {
    dispatch({ type: 'end_drag' });
  }, [dispatch]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    setWidth(ref.current.getBoundingClientRect().width);
    setHeight(ref.current.getBoundingClientRect().height);
  }, []);

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
