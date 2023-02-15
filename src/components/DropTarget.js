import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';

/**
 * Specific drop area within a window; handles drop events and
 *   makes the drop area metadata ("dir") available to the
 *   upstream drop handler
 * @private
 */
function DropTarget({
  box, dir = 'left', size = '30%', style = {}, ...props
}) {
  const [{ dropAreaStyles }, drop] = useDrop(
    () => ({
      accept: 'mirador.window',
      drop() {
        return { dir };
      },
      collect: (monitor) => ({
        dropAreaStyles: (
          monitor.getItem()?.id !== box
            && monitor.isOver()
            && monitor.canDrop() ? { backgroundColor: 'rgba(255, 0,0,0.7)' } : {}
        ),
      }),
    }),
    [],
  );

  const position = {
    top: { bottom: `calc(100% - ${size})` },
    bottom: { top: `calc(100% - ${size})` },
    left: { right: `calc(100% - ${size})` },
    right: { left: `calc(100% - ${size})` },
  };

  return (
    <div
      {...props}
      ref={drop}
      style={{
        position: 'absolute', inset: 0, ...(position[dir] || {}), ...style, ...dropAreaStyles,
      }}
    />
  );
}

DropTarget.propTypes = {
  box: PropTypes.string,
  dir: PropTypes.string,
  size: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Container for the various drop targets (top, bottom, left, right)
 * within a window.
 */
function DropTargetContainer({
  isOver = false, padding = 0, size = '30%', style, ...props
}) {
  return (
    <div
      style={{
        position: 'absolute', inset: padding, ...style,
      }}
      {...props}
    >
      <DropTarget dir="top" size={size} style={{ zIndex: isOver ? 1 : undefined }} />
      <DropTarget dir="bottom" size={size} style={{ zIndex: isOver ? 1 : undefined }} />
      <DropTarget dir="left" size={size} style={{ zIndex: isOver ? 1 : undefined }} />
      <DropTarget dir="right" size={size} style={{ zIndex: isOver ? 1 : undefined }} />
    </div>
  );
}

DropTargetContainer.propTypes = {
  isOver: PropTypes.bool,
  padding: PropTypes.number,
  size: PropTypes.string,
  style: PropTypes.object,
};

export default DropTargetContainer;
