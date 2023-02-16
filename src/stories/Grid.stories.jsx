import React from 'react';

import { Grid, GridDispatchContext, gridUtils } from '../mirador-mosaic';

export default {
  title: 'Grid',
  component: Grid
};

const Window = ({ id, children, dragHandle = undefined, style, ...props}) => {
  const dispatch = React.useContext(GridDispatchContext);

  return (
    <div id={id} {...props} style={{ height: '100%', border: '1px solid rgba(0,0,0,0.3)', ...style}}>
      <div ref={dragHandle} style={{backgroundColor: 'rgba(0,0,0,0.3)', cursor: 'move', display: 'flex', justifyContent: 'space-between' }}>
        <span>Drag handle</span>
        <button onClick={() => { dispatch({ type: 'remove', id })}}>x</button>
      </div>
      {children}
    </div>
  )
}
const intToPlaceholder = (i) => String.fromCharCode(65 + i);

const Template = ({ howManyWindows = 0, args }) => <Grid {...args}>{Array(howManyWindows).fill().map((v, i) => <Window key={i} id={intToPlaceholder(i)}>{intToPlaceholder(i)}</Window>)}</Grid>;
export const Primary = Template.bind({});
Primary.args = {
  howManyWindows: 1
}

export const TwoUp = () => <Grid><Window id="a">A</Window><Window id="b">B</Window></Grid>;
export const ProvidedGrid = () => <Grid initialLayout={{ rows: [1, 1], columns: [1, 1], areas: [["a","a"], ["b", "c"]] }}><Window id="a">A</Window><Window id="b">B</Window><Window id="c">C</Window></Grid>;
export const ComplexGrid = () => (
  <Grid initialLayout={{ rows: [1, 1, 1, 1], columns: [1, 1, 1, 1, 1], areas: [["a", "a", "a", "a", "a"], ["d", "c", "f", "f", "f"], ["d", "c", "f", "f", "f"], ["d", "b", "e", "e", "e"]] }}>
    <Window id="a">A</Window>
    <Window id="b">B</Window>
    <Window id="c">C</Window>
    <Window id="d">D</Window>
    <Window id="e">E</Window>
    <Window id="f">F</Window>
  </Grid>
);
