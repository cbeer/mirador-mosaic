import React from 'react';

import { Grid } from '../mirador-mosaic';

export default {
  title: 'Grid',
  component: Grid
};

const Window = ({children, dragHandle = undefined, style, ...props}) => {
  return (
    <div {...props} style={{ height: '100%', border: '1px solid rgba(0,0,0,0.3)', ...style}}>
      <div ref={dragHandle} style={{backgroundColor: 'rgba(0,0,0,0.3)', cursor: 'pointer'}}>
        Drag handle
      </div>
      {children}
    </div>
  )
}

export const OneUp = () => <Grid><Window id="a">A</Window></Grid>;
export const TwoUp = () => <Grid><Window id="a">A</Window><Window id="b">B</Window></Grid>;
export const ThreeUp = () => <Grid><Window id="a">A</Window><Window id="b">B</Window><Window id="c">C</Window></Grid>;
export const InitialGrid = () => <Grid initialLayout={{ rows: [1, 1], columns: [1, 1], areas: [["a","a"], ["b", "c"]] }}><Window id="a">A</Window><Window id="b">B</Window><Window id="c">C</Window></Grid>;
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
