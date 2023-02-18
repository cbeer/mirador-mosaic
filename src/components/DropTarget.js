import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';

/**
 * Specific drop area within a window; handles drop events and
 *   makes the drop area metadata ("dir") available to the
 *   upstream drop handler
 * @private
 */
function DropTarget({
  dir = 'left', size = '30%', hoverSize = '50%', style = {}, ...props
}) {
  const [{ dropAreaStyles, isOver }, drop] = useDrop(
    () => ({
      accept: 'mirador.window',
      drop() {
        return { dir };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        dropAreaStyles: (
          monitor.isOver()
            && monitor.canDrop() ? { backgroundColor: 'rgba(0,0,0,0.3)', border: '2px solid #000' } : {}
        ),
      }),
    }),
    [],
  );

  const position = {
    top: { bottom: `calc(100% - ${isOver ? hoverSize : size})` },
    bottom: { top: `calc(100% - ${isOver ? hoverSize : size})` },
    left: { right: `calc(100% - ${isOver ? hoverSize : size})` },
    right: { left: `calc(100% - ${isOver ? hoverSize : size})` },
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
  dir: PropTypes.string,
  hoverSize: PropTypes.string,
  size: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Container for the various drop targets (top, bottom, left, right)
 * within a window.
 */
function DropTargetContainer({
  isOver = false, padding = 0, size = '30%', hoverSize = '50%', style, targetStyle, ...props
}) {
  return (
    <div
      style={{
        position: 'absolute', inset: padding, ...style,
      }}
      {...props}
    >
      <DropTarget dir="top" size={size} hoverSize={hoverSize} style={{ ...targetStyle, zIndex: isOver ? 9998 : undefined }} />
      <DropTarget dir="bottom" size={size} hoverSize={hoverSize} style={{ ...targetStyle, zIndex: isOver ? 9998 : undefined }} />
      <DropTarget dir="left" size={size} hoverSize={hoverSize} style={{ ...targetStyle, zIndex: isOver ? 9998 : undefined }} />
      <DropTarget dir="right" size={size} hoverSize={hoverSize} style={{ ...targetStyle, zIndex: isOver ? 9998 : undefined }} />
    </div>
  );
}

DropTargetContainer.propTypes = {
  isOver: PropTypes.bool,
  hoverSize: PropTypes.string,
  padding: PropTypes.number,
  size: PropTypes.string,
  style: PropTypes.object,
  targetStyle: PropTypes.object,
};

export default DropTargetContainer;
