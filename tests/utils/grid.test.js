const grid = require('../../src/utils/grid');

test('calculateDefaultLayout', () => {
  expect(grid.calculateDefaultLayout(['a', 'b', 'c', 'd'])).toEqual(
    {
      rows: [1],
      columns: [1, 1, 1, 1],
      areas: [['a', 'b', 'c', 'd']],
    },
  );
});

test('getBounds', () => {
  const areas = [['a', 'a', 'b'], ['c', 'c', 'd']];
  expect(grid.getBounds({ areas }, 'a')).toEqual(
    {
      top: 0,
      left: 0,
      right: 1,
      bottom: 0,
    },
  );

  expect(grid.getBounds({ areas }, 'b')).toEqual(
    {
      top: 0,
      left: 2,
      right: 2,
      bottom: 0,
    },
  );

  expect(grid.getBounds({ areas }, 'd')).toEqual(
    {
      top: 1,
      left: 2,
      right: 2,
      bottom: 1,
    },
  );
});

test('resizeRow', () => {
  const layout = {
    rows: [1, 1, 1],
    columns: [1, 1, 1],
    areas: [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']],
  };

  expect(grid.resizeRow(layout, (v, i) => i + 1)).toEqual(
    {
      ...layout,
      rows: [1, 2, 3],
    },
  );
});

test('resizeColumn', () => {
  const layout = {
    rows: [1, 1, 1],
    columns: [1, 1, 1],
    areas: [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']],
  };

  expect(grid.resizeColumn(layout, (v, i) => i + 1)).toEqual(
    {
      ...layout,
      columns: [1, 2, 3],
    },
  );
});

test('splitRow', () => {
  const layout = {
    rows: [1, 1, 1],
    columns: [1, 1, 1],
    areas: [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']],
  };

  expect(grid.splitRow(layout, 0)).toEqual(
    {
      ...layout,
      rows: [0.5, 0.5, 1, 1],
      areas: [['a', 'b', 'c'], ['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']],
    },
  );

  expect(grid.splitRow(layout, 2)).toEqual(
    {
      ...layout,
      rows: [1, 1, 0.5, 0.5],
      areas: [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i'], ['g', 'h', 'i']],
    },
  );
});

test('splitColumn', () => {
  const layout = {
    rows: [1, 1, 1],
    columns: [1, 1, 1],
    areas: [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']],
  };

  expect(grid.splitColumn(layout, 0)).toEqual(
    {
      ...layout,
      columns: [0.5, 0.5, 1, 1],
      areas: [['a', 'a', 'b', 'c'], ['d', 'd', 'e', 'f'], ['g', 'g', 'h', 'i']],
    },
  );

  expect(grid.splitColumn(layout, 2)).toEqual(
    {
      ...layout,
      columns: [1, 1, 0.5, 0.5],
      areas: [['a', 'b', 'c', 'c'], ['d', 'e', 'f', 'f'], ['g', 'h', 'i', 'i']],
    },
  );
});

test('insertRow', () => {
  const layout = {
    rows: [1, 1, 1],
    columns: [1, 1, 1],
    areas: [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']],
  };

  expect(grid.insertRow(layout, 0, 0.75)).toEqual(
    {
      ...layout,
      rows: [0.75, 1, 1, 1],
      areas: [['a', 'b', 'c'], ['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']],
    },
  );

  expect(grid.insertRow(layout, 4, 1)).toEqual(
    {
      ...layout,
      rows: [1, 1, 1, 1],
      areas: [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i'], ['g', 'h', 'i']],
    },
  );

  expect(grid.insertRow(layout, 0, 1.5, { resize: true })).toEqual(
    {
      ...layout,
      rows: [1.5, 0.5, 0.5, 0.5],
      areas: [['a', 'b', 'c'], ['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']],
    },
  );

  expect(grid.insertRow(layout, 0, 1, { fill: ['z', 'z', 'z'] })).toEqual(
    {
      ...layout,
      rows: [1, 1, 1, 1],
      areas: [['z', 'z', 'z'], ['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']],
    },
  );

  expect(grid.insertRow(layout, 2, 1, { fill: ['z', 'z', 'z'] })).toEqual(
    {
      ...layout,
      rows: [1, 1, 1, 1],
      areas: [['a', 'b', 'c'], ['d', 'e', 'f'], ['z', 'z', 'z'], ['g', 'h', 'i']],
    },
  );
});

test('insertColumn', () => {
  const layout = {
    rows: [1, 1, 1],
    columns: [1, 1, 1],
    areas: [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']],
  };

  expect(grid.insertColumn(layout, 0, 0.75)).toEqual(
    {
      ...layout,
      columns: [0.75, 1, 1, 1],
      areas: [['a', 'a', 'b', 'c'], ['d', 'd', 'e', 'f'], ['g', 'g', 'h', 'i']],
    },
  );

  expect(grid.insertColumn(layout, 4, 1)).toEqual(
    {
      ...layout,
      columns: [1, 1, 1, 1],
      areas: [['a', 'b', 'c', 'c'], ['d', 'e', 'f', 'f'], ['g', 'h', 'i', 'i']],
    },
  );

  expect(grid.insertColumn(layout, 0, 1.5, { resize: true })).toEqual(
    {
      ...layout,
      columns: [1.5, 0.5, 0.5, 0.5],
      areas: [['a', 'a', 'b', 'c'], ['d', 'd', 'e', 'f'], ['g', 'g', 'h', 'i']],
    },
  );

  expect(grid.insertColumn(layout, 0, 1, { fill: 'z' })).toEqual(
    {
      ...layout,
      columns: [1, 1, 1, 1],
      areas: [['z', 'a', 'b', 'c'], ['z', 'd', 'e', 'f'], ['z', 'g', 'h', 'i']],
    },
  );

  expect(grid.insertColumn(layout, 2, 1, { fill: 'z' })).toEqual(
    {
      ...layout,
      columns: [1, 1, 1, 1],
      areas: [['a', 'b', 'z', 'c'], ['d', 'e', 'z', 'f'], ['g', 'h', 'z', 'i']],
    },
  );
});

test('cleanupGrid', () => {
  const layout = {
    rows: [1, 1, 1, 1],
    columns: [1, 1, 1],
    areas: [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i'],
      ['j', 'k', 'l'],
    ],
  };

  const emptyColumn = [
    ['a', '.', 'c'],
    ['d', '.', 'f'],
    ['g', '.', 'i'],
    ['j', '.', 'l'],
  ];

  expect(grid.cleanupGrid({ ...layout, areas: emptyColumn })).toEqual(
    {
      rows: [1, 1, 1, 1],
      columns: [1.5, 1.5],
      areas: [
        ['a', 'c'],
        ['d', 'f'],
        ['g', 'i'],
        ['j', 'l'],
      ],
    },
  );

  const emptyRow = [
    ['a', 'b', 'c'],
    ['.', '.', '.'],
    ['d', 'e', 'f'],
    ['g', 'h', 'i'],
  ];

  expect(grid.cleanupGrid({ ...layout, areas: emptyRow })).toEqual(
    {
      rows: [4 / 3, 4 / 3, 4 / 3],
      columns: [1, 1, 1],
      areas: [
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h', 'i'],
      ],
    },
  );

  expect(grid.cleanupGrid({ ...layout, rows: [0, 1, 1, 1], columns: [1, 1, 0] })).toEqual(
    {
      rows: [1, 1, 1],
      columns: [1, 1],
      areas: [
        ['d', 'e'],
        ['g', 'h'],
        ['j', 'k'],
      ],
    },
  );

  const duplicateRow = [
    ['a', 'b', 'c'],
    ['a', 'b', 'c'],
    ['d', 'e', 'f'],
    ['g', 'h', 'i'],
  ];

  expect(grid.cleanupGrid({ ...layout, areas: duplicateRow })).toEqual(
    {
      rows: [2, 1, 1],
      columns: [1, 1, 1],
      areas: [
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h', 'i'],
      ],
    },
  );

  const duplicateColumn = [
    ['a', 'a', 'c'],
    ['d', 'd', 'f'],
    ['g', 'g', 'i'],
    ['j', 'j', 'l'],
  ];

  expect(grid.cleanupGrid({ ...layout, areas: duplicateColumn })).toEqual(
    {
      rows: [1, 1, 1, 1],
      columns: [2, 1],
      areas: [
        ['a', 'c'],
        ['d', 'f'],
        ['g', 'i'],
        ['j', 'l'],
      ],
    },
  );

  const emptyCells = [
    ['a', 'b', 'c'],
    ['d', '.', '.'],
    ['e', '.', '.'],
    ['e', 'f', 'f'],
  ];

  expect(grid.cleanupGrid({ ...layout, areas: emptyCells, dir: 'left' })).toEqual(
    {
      rows: [1, 1, 1, 1],
      columns: [1, 1, 1],
      areas: [
        ['a', 'b', 'c'],
        ['d', 'b', 'c'],
        ['e', 'b', 'c'],
        ['e', 'f', 'f'],
      ],
    },
  );

  expect(grid.cleanupGrid({ ...layout, areas: emptyCells, dir: 'top' })).toEqual(
    {
      rows: [1, 1, 1, 1],
      columns: [1, 1, 1],
      areas: [
        ['a', 'b', 'c'],
        ['d', 'b', 'c'],
        ['e', 'b', 'c'],
        ['e', 'f', 'f'],
      ],
    },
  );
});
