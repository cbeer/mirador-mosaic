import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';

function DragHandle({
  box, dir, style,
}) {
  const [{}, drag, preview] = useDrag(() => ({ // eslint-disable-line no-empty-pattern
    type: 'mirador.handle',
    item: { box, dir },
  }), []);

  const handleStyles = {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
  };

  return (
    <div ref={preview} style={{ ...handleStyles, ...style, opacity: 0 }}>
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

export default function DragHandles({ size = 5, ...props }) {
  return (
    <>
      <DragHandle
        {...props}
        dir="left"
        style={{
          left: -1 * Math.floor(size / 2), width: size, top: 0, bottom: 0, cursor: 'ew-resize',
        }}
      />
      <DragHandle
        {...props}
        dir="top"
        style={{
          top: -1 * Math.floor(size / 2), height: size, left: 0, right: 0, cursor: 'ns-resize',
        }}
      />
      <DragHandle
        {...props}
        dir="right"
        style={{
          right: -1 * Math.floor(size / 2), width: size, top: 0, bottom: 0, cursor: 'ew-resize',
        }}
      />
      <DragHandle
        {...props}
        dir="bottom"
        style={{
          bottom: -1 * Math.floor(size / 2), height: size, left: 0, right: 0, cursor: 'ns-resize',
        }}
      />
    </>
  );
}

DragHandles.propTypes = {
  box: PropTypes.string,
  size: PropTypes.number,
};
