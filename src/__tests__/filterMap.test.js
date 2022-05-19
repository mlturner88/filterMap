import { expect, test } from 'vitest';
import { filterMap } from '../main.ts';

test('should filter and map arrays', () => {
  expect(
    filterMap(
      [2, 3, 7, 1, 9, 10, 0, -2],
      n => n > 3,
      n => n * 2
    )
  ).to.eql([14, 18, 20]);
});

test('should filter and map Map collections', () => {
  const map = new Map();
  map.set(Symbol(1), 'お元気ですか？');
  map.set(Symbol(2), 'はい');
  map.set(Symbol(3), '天気がどう？');
  map.set(Symbol(4), 'さぁ');
  map.set(Symbol(5), 'そうですか');

  expect(
    filterMap(
      map,
      str => str.length > 2,
      str => str[0]
    )
  ).to.eql(['お', '天', 'そ']);
});

test('should filter and map objects', () => {
  const obj = {};
  obj.a = { x: 9 };
  obj.b = { x: 11 };
  obj.c = { x: -100 };
  obj.d = { y: 100 };

  expect(
    filterMap(
      obj,
      o => o.x >= 9,
      o => o.x
    )
  ).to.eql([9, 11]);
});

test('should filter and map Set collections', () => {
  const set = new Set();
  set.add(4);
  set.add('かわいい');
  set.add({ x: 3 });
  set.add('電話');

  expect(
    filterMap(
      set,
      v => typeof v === 'string',
      str => `[${str}]`
    )
  ).to.eql(['[かわいい]', '[電話]']);
});

test('should filter and map over generator function', () => {
  const array = [3, 0, -18, -100, 5];

  expect(
    filterMap(
      generator(),
      n => n < 0,
      n => n / 2
    )
  ).to.eql([-9, -50]);

  function* generator() {
    for (const x of array) {
      yield x;
    }
  }
});

test('should filter and map over TypedArrays', () => {
  const typedArray = new Int32Array([1, 2, 3, 4, 5]);

  expect(
    filterMap(
      typedArray,
      n => n % 2 === 0,
      n => n * 100
    )
  ).to.eql([200, 400]);
});

test('should return empty array if no input received', () => {
  expect(filterMap()).to.eql([]);
});

test.each([
  [
    new Map([
      ['a', 1],
      ['b', 2]
    ]),
    ['a', 'b'],
    'Map'
  ],
  [[9, 10, 11], [0, 1, 2], 'Array'],
  [new Set([101, 102, 103]), [101, 102, 103], 'Set'],
  [{ x1: 5, x2: 6, x3: 10 }, ['x1', 'x2', 'x3'], 'Object'],
  [
    (function* (arr) {
      for (const e of arr) {
        yield e;
      }
    })([5, 4, 7]),
    [0, 1, 2],
    'Generator'
  ],
  [new Int8Array([0, 1]), [0, 1], 'TypedArray']
])(
  'should provide current key/index and iterable to predicate function',
  (iterable, expectedKeys, type) => {
    const keys = [];
    filterMap(
      iterable,
      // push each key predicate function receives to keys array
      (_, k, iter) => {
        // iterable received should be reference to input iterable
        expect(iter).to.equal(iterable);
        return keys.push(k);
      },
      v => v
    );

    // collected keys should match expected keys
    expect(keys).to.eql(expectedKeys, `${type} failed`);
  }
);

test.each([
  [
    new Map([
      ['a', 1],
      ['b', 2]
    ]),
    ['a', 'b'],
    'Map'
  ],
  [[9, 10, 11], [0, 1, 2], 'Array'],
  [new Set([101, 102, 103]), [101, 102, 103], 'Set'],
  [{ x1: 5, x2: 6, x3: 10 }, ['x1', 'x2', 'x3'], 'Object'],
  [
    (function* (arr) {
      for (const e of arr) {
        yield e;
      }
    })([5, 4, 7]),
    [0, 1, 2],
    'Generator'
  ],
  [new Int8Array([10, 120]), [0, 1], 'TypedArray']
])(
  'should provide current key/index and iterable to map function',
  (iterable, expectedKeys, type) => {
    const keys = [];
    filterMap(
      iterable,
      () => true,
      // push each key map function receives to keys array
      (_, k, iter) => {
        // iterable received should be reference to input iterable
        expect(iter).to.equal(iterable);
        return keys.push(k);
      }
    );

    expect(keys).to.eql(expectedKeys, `${type} failed`);
  }
);
