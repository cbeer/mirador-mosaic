import {
  useState, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { GridContext, GridDispatchContext } from '../context/GridProvider';
import { getBounds } from '../utils/grid';

function DragHandle({
  box, dir, style,
}) {
  const grid = useContext(GridContext);
  const dispatch = useContext(GridDispatchContext);
  const [hasFocus, setFocus] = useState(false);

  const [{}, drag, preview] = useDrag(() => ({ // eslint-disable-line no-empty-pattern
    type: 'mirador.handle',
    item: { box, dir },
  }), []);

  const bounds = getBounds(grid, box);
  const { rows, columns } = grid;

  if (dir === 'top' && bounds.top === 0) return null;
  if (dir === 'bottom' && bounds.bottom === rows.length) return null;
  if (dir === 'left' && bounds.left === 0) return null;
  if (dir === 'right' && bounds.right === columns.length) return null;

  const handleStyles = {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    opacity: 0,
    ...(hasFocus && { backgroundColor: 'rgba(0,0,0,0.8)', opacity: 0.5, transition: 'opacity 0.2s ease-in-out' }),
  };

  const onKeyDown = ({ shiftKey, key }) => {
    const size = shiftKey ? 0.001 : 0.05;

    switch (key) {
      case 'Down':
      case 'ArrowDown':
        if (dir === 'bottom') {
          dispatch({
            type: 'resize', final: true, id: box, dir, value: { bottom: size },
          });
        } else if (dir === 'top') {
          dispatch({
            type: 'resize', final: true, id: box, dir, value: { top: size },
          });
        }
        break;
      case 'Up':
      case 'ArrowUp':
        if (dir === 'bottom') {
          dispatch({
            type: 'resize', final: true, id: box, dir, value: { bottom: -1 * size },
          });
        } else if (dir === 'top') {
          dispatch({
            type: 'resize', final: true, id: box, dir, value: { top: -1 * size },
          });
        }
        break;
      case 'Left':
      case 'ArrowLeft':
        if (dir === 'left') {
          dispatch({
            type: 'resize', final: true, id: box, dir, value: { left: -1 * size },
          });
        } else if (dir === 'right') {
          dispatch({
            type: 'resize', final: true, id: box, dir, value: { right: -1 * size },
          });
        }
        break;
      case 'Right':
      case 'ArrowRight':
        if (dir === 'left') {
          dispatch({
            type: 'resize', final: true, id: box, dir, value: { left: size },
          });
        } else if (dir === 'right') {
          dispatch({
            type: 'resize', final: true, id: box, dir, value: { right: size },
          });
        }
        break;
      case 'Home':
        dispatch({
          type: 'resize', final: true, id: box, dir, value: { [dir]: -1 },
        });
        break;
      case 'End':
        dispatch({
          type: 'resize', final: true, id: box, dir, value: { [dir]: 1 },
        });
        break;
      default:
        break;
    }
  };

  return (
    <div // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions
      ref={preview}
      role="separator"
      onKeyDown={onKeyDown}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onDragStart={() => setFocus(false)}
      onDragEnd={() => setFocus(true)}
      tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
      style={{ ...handleStyles, ...style }}
    >
      <div
        ref={drag}
        style={{
          position: 'absolute', inset: 0, opacity: 0,
        }}
      />
    </div>
  );
}

DragHandle.propTypes = {
  box: PropTypes.string,
  dir: PropTypes.string,
  style: PropTypes.object,
};

export default function DragHandles({ size = 5, style = {}, ...props }) {
  return (
    <>
      <DragHandle
        {...props}
        dir="left"
        style={{
          ...style,
          left: -1 * Math.floor(size / 2),
          width: size,
          top: 0,
          bottom: 0,
          cursor: 'ew-resize',
        }}
      />
      <DragHandle
        {...props}
        dir="top"
        style={{
          ...style,
          top: -1 * Math.floor(size / 2),
          height: size,
          left: 0,
          right: 0,
          cursor: 'ns-resize',
        }}
      />
      <DragHandle
        {...props}
        dir="right"
        style={{
          ...style,
          right: -1 * Math.floor(size / 2),
          width: size,
          top: 0,
          bottom: 0,
          cursor: 'ew-resize',
        }}
      />
      <DragHandle
        {...props}
        dir="bottom"
        style={{
          ...style,
          bottom: -1 * Math.floor(size / 2),
          height: size,
          left: 0,
          right: 0,
          cursor: 'ns-resize',
        }}
      />
    </>
  );
}

DragHandles.propTypes = {
  box: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object,
};
