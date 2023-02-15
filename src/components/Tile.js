import { cloneElement, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import DropTargetContainer from './DropTarget';
import DragHandles from './DragHandles';

function Tile({
  children, id, onDropFailed = () => {}, gridArea = id,
}) {
  const [{ isDragging, opacity }, dragHandle, preview] = useDrag(() => ({
    type: 'mirador.window',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) onDropFailed({ id });
    },
  }));

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'mirador.window',
      drop(item, monitor) {
        return { ...monitor.getDropResult(), box: id };
      },
      hover(item, monitor) {
        return { ...monitor.getDropResult(), box: id };
      },
      collect: (monitor) => ({
        isOver: monitor.getItem()?.id !== id && monitor.isOver(),
      }),
    }),
    [],
  );

  const tileStyle = {
    gridArea,
    display: isDragging ? 'none' : 'block',
    position: isDragging ? 'absolute' : 'relative',
  };

  const windowStyle = {
    position: 'relative',
    opacity,
    width: '100%',
    height: '100%',
  };

  const child = useMemo(() => cloneElement(children, { dragHandle }), [children, dragHandle]);

  return (
    <div ref={drop} style={tileStyle}>
      <DropTargetContainer isOver={isOver} box={id} padding={4} />

      <div ref={preview} style={windowStyle}>
        {child}
      </div>

      <DragHandles box={id} />
    </div>
  );
}

Tile.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  onDropFailed: PropTypes.func,
  gridArea: PropTypes.string,
};

export default Tile;
