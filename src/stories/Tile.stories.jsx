import { useContext, Children } from 'react';

import Tile from '../components/Tile';
import { DndProvider } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch'; // or any other pipeline
import { GridContext, GridDispatchContext, GridProvider } from '../context/GridProvider';

export default {
  title: 'Tile',
  component: Tile
};

const Wrapper = ({ children }) => {
  return (
    <DndProvider options={HTML5toTouch}>
      <GridProvider childIds={Children.toArray(children).map((c) => c.props.id)}>
        <div style={{ position: 'absolute', inset: '10%', display: 'grid', gridAutoRows: '25%', gridAutoColumns: '25%' }}>
          {children}
        </div>
      </GridProvider>
    </DndProvider>
  )
}

const Window = ({ id, children, dragHandle = undefined, style, ...props}) => {
  const dispatch = useContext(GridDispatchContext);

  return (
    <div id={id} {...props} style={{ height: '100%', border: '1px solid rgba(0,0,0,0.3)', ...style}}>
      <div ref={dragHandle} style={{backgroundColor: 'rgba(0,0,0,0.3)', cursor: 'move'}}>
        Drag handle
        <button onClick={() => { dispatch({ type: 'remove', id })}}>x</button>
      </div>
      {children}
    </div>
  )
}

export const OneUp = () => <Wrapper><Tile id="a" targetStyle={{ backgroundColor: 'red', opacity: 0.3 }}><Window>A</Window></Tile></Wrapper>;
