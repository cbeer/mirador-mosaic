import { cloneElement } from "react";
import { useDrag, useDrop } from 'react-dnd'
import DropTargetContainer from './DropTarget';

function DragHandle({ box, dir, style, ...props }) {
  const [{ isDragging, opacity }, drag, preview] = useDrag(() => ({
    type: 'mirador.handle',
    item: { box, dir },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0 : 1,
    })
  }), [])

  const handleStyles = {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    ...style
  }

  return (
    <div ref={preview} style={{ ...handleStyles, opacity: isDragging ? 1 : 0 }}>
      <div ref={drag} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0 }}></div>
    </div>
  );
}

function Tile({ children, id, onDropFailed = () => {}, gridArea = id,...props }) {
  const [{ isDragging, opacity }, dragHandle, preview] = useDrag(() => ({
    type: 'mirador.window',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) onDropFailed({ id })
    }
  }))

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'mirador.window',
      drop(item, monitor) {
        return { ...monitor.getDropResult(), box: id }
      },
      hover(item, monitor) {
        return { ...monitor.getDropResult(), box: id }
      },
      collect: (monitor) => ({
        isOver: monitor.getItem()?.id != id && monitor.isOver(),
      })
    }),
    [],
  );

  const tileStyle = {
    gridArea,
    display: isDragging ? 'none' : 'block',
    position: isDragging ? 'absolute' : 'relative'
  }

  const windowStyle = {
    position: 'relative',
    opacity,
    width: '100%',
    height: '100%'
  }

  return (
    <div ref={drop} style={tileStyle}>
      <DropTargetContainer isOver={isOver} box={id} padding={4} />

      <div ref={preview} style={windowStyle}>
        {cloneElement(children, { dragHandle })}
      </div>

      <ResizeControls box={id} />
    </div>
  )
}

const ResizeControls = (props) => {
  return (
    <>
      <DragHandle {...props} dir="left" style={{ left: -2, width: 5, top: 0, bottom: 0, cursor: 'ew-resize' }} />
      <DragHandle {...props} dir="top" style={{ top: -2, height: 5, left: 0, right: 0, cursor: 'ns-resize' }} />
      <DragHandle {...props} dir="right" style={{ right: -2, width: 5, top: 0, bottom: 0, cursor: 'ew-resize' }} />
      <DragHandle {...props} dir="bottom" style={{ bottom: -2, height: 5, left: 0, right: 0, cursor: 'ns-resize' }} />
    </>
  )
}

export default Tile;
