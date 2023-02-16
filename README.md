# mirador-mosaic

[![Node.js CI](https://github.com/cbeer/mirador-mosaic/actions/workflows/node.js.yml/badge.svg)](https://github.com/cbeer/mirador-mosaic/actions/workflows/node.js.yml)

mirador-mosaic provides a tiling window manager for organizing a workspace of windows.  mirador-mosaic is built around CSS Grids and provides flexible layout options
for the end-user and developer.

The storybook is available on the [**demo site**](https://blog.cbeer.info/mirador-mosaic/).

## Usage

### 2-up image viewer
```javascript
import { Grid } from 'mirador-mosaic';
import Window from './Window';

export default const App = () => (
  <Grid><Window id="a">A</Window><Window id="b">B</Window></Grid>
);
```

### Using a pre-defined layout
```javascript
import { Grid } from 'mirador-mosaic';
import Window from './Window';

export default const App = () => (
  <Grid initialLayout={{ rows: [1, 1], columns: [1, 1], areas: [["a","a"], ["b", "c"]] }}><Window id="a">A</Window><Window id="b">B</Window></Grid>
);
```
