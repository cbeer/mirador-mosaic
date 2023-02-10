import { useDrop } from 'react-dnd'

const DropTarget = ({ box, dir, size, style, ...props }) => {
  const [{ isOver, dropAreaStyles }, drop] = useDrop(
    () => ({
      accept: 'mirador.window',
      drop(item, monitor) {
        return { dir }
      },
      hover(item, monitor) {
        return { dir }
      },
      collect: (monitor) => ({
        isOver: monitor.getItem()?.id != box && monitor.isOver({ shallow: true }) && monitor.canDrop(),
        dropAreaStyles: monitor.getItem()?.id != box && monitor.isOver() && monitor.canDrop() ? { backgroundColor: 'rgba(255, 0,0,0.7)' } : {},
      })
    }),
    [],
  );

  const position = {
    "top": { bottom: `calc(100% - ${size})` },
    "bottom": { top: `calc(100% - ${size})` },
    "left": { right: `calc(100% - ${size})` },
    "right": { left: `calc(100% - ${size})` },
  }

  return (
    <div ref={drop} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, ...(position[dir] || {}), ...style, ...dropAreaStyles }}></div>
  );
};

const DropTargetContainer = ({ isOver = false, padding = 0, size = '30%', style }) => {
  return (
    <div style={{ position: 'absolute', left: padding, right: padding, top: padding, bottom: padding, ...style }}>
      <DropTarget dir="top" size={size} style={{ zIndex: isOver ? 1 : undefined }} />
      <DropTarget dir="bottom" size={size} style={{ zIndex: isOver ? 1 : undefined }} />
      <DropTarget dir="left" size={size} style={{ zIndex: isOver ? 1 : undefined }} />
      <DropTarget dir="right" size={size} style={{ zIndex: isOver ? 1 : undefined }} />
    </div>
  );
}

export default DropTargetContainer;
