const oShape = {
  0: [
    ['O', 'O'],
    ['O', 'O'],
  ],
  1: [
    ['O', 'O'],
    ['O', 'O'],
  ],
  2: [
    ['O', 'O'],
    ['O', 'O'],
  ],
  3: [
    ['O', 'O'],
    ['O', 'O'],
  ],
};

const tShape = {
  0: [
    [null, 'T', null],
    ['T', 'T', 'T'],
  ],
  1: [
    ['T', null],
    ['T', 'T'],
    ['T', null],
  ],
  2: [
    ['T', 'T', 'T'],
    [null, 'T', null],
  ],
  3: [
    [null, 'T'],
    ['T', 'T'],
    [null, 'T'],
  ],
};

const iShape = {
  0: [['I', 'I', 'I', 'I']],
  1: [['I'], ['I'], ['I'], ['I']],
  2: [['I', 'I', 'I', 'I']],
  3: [['I'], ['I'], ['I'], ['I']],
};

const zShape = {
  0: [
    ['Z', 'Z', null],
    [null, 'Z', 'Z'],
  ],
  1: [
    [null, 'Z'],
    ['Z', 'Z'],
    ['Z', null],
  ],
  2: [
    ['Z', 'Z', null],
    [null, 'Z', 'Z'],
  ],
  3: [
    [null, 'Z'],
    ['Z', 'Z'],
    ['Z', null],
  ],
};

const sShape = {
  0: [
    [null, 'S', 'S'],
    ['S', 'S', null],
  ],
  1: [
    ['S', null],
    ['S', 'S'],
    [null, 'S'],
  ],
  2: [
    [null, 'S', 'S'],
    ['S', 'S', null],
  ],
  3: [
    ['S', null],
    ['S', 'S'],
    [null, 'S'],
  ],
};

const laShape = {
  0: [
    ['J', null, null],
    ['J', 'J', 'J'],
  ],
  1: [
    ['J', 'J'],
    ['J', null],
    ['J', null],
  ],
  2: [
    ['J', 'J', 'J'],
    [null, null, 'J'],
  ],
  3: [
    [null, 'J'],
    [null, 'J'],
    ['J', 'J'],
  ],
};

const lbShape = {
  0: [
    [null, null, 'L'],
    ['L', 'L', 'L'],
  ],
  1: [
    ['L', null],
    ['L', null],
    ['L', 'L'],
  ],
  2: [
    ['L', 'L', 'L'],
    ['L', null, null],
  ],
  3: [
    ['L', 'L'],
    [null, 'L'],
    [null, 'L'],
  ],
};

export const TETRIS_SHAPES = {
  O: oShape,
  T: tShape,
  I: iShape,
  S: sShape,
  Z: zShape,
  J: laShape,
  L: lbShape,
};

export const PIECE_TYPES = ['O', 'T', 'I', 'S', 'Z', 'J', 'L'];

export const TETRIS_COLORS = {
  O: ['#c9a400', '#ffe066'], // żółty
  T: ['#7b3dbf', '#c084fc'], // fiolet
  I: ['#009fbf', '#67e8f9'], // cyan
  S: ['#2f9e44', '#69db7c'], // zielony
  Z: ['#c92a2a', '#ff6b6b'], // czerwony
  J: ['#1c3faa', '#4dabf7'], // niebieski
  L: ['#e67700', '#ffa94d'], // pomarańczowy
};

const createRow = () => Array(10).fill(null);
export const STARTING_BOARD = Array.from({ length: 20 }, createRow);
