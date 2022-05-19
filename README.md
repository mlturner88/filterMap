# filterMap

Filter and map a collection (array-like, Map, Set, Generator or plain object) at the same time.
This is done simultaneously versus filtering and then mapping.
If collection is `null` or `undefined` then an empty array is returned so no need to check for these beforehand.

- [Installation](#installation)
- [Usage](#usage)
  - [Array](#array)
  - [Map](#map)
  - [Plain Object](#plain-object)
  - [Set](#set)
  - [Generator Function](#generator-function)
- [Type Declarations](#type-declarations)

## Installation

```
npm i --save-dev filter-map

yarn add filter-map

pnpm i filter-map
```

## Usage

### Array

Note: this also works with TypedArrays (e.g., `Int32Array`, etc.)

```javascript
import { filterMap } from 'filter-map';

const array = [2, 3, 7, 1, 9, 10, 0, -2];

const results = filterMap(
  array,
  n => n > 3,
  n => n * 2
);
// [14, 18, 20]
```

### Map

```javascript
import { filterMap } from 'filter-map';

const map = new Map();
map.set(Symbol(1), 'kangaroo');
map.set(Symbol(2), 'cat');
map.set(Symbol(3), 'elephant');
map.set(Symbol(4), 'dog');
map.set(Symbol(5), 'parrot');

const results = filterMap(
  map,
  str => str.length > 2,
  str => str[0]
);
// ['k', 'e', 'p']
```

### Plain Object

```javascript
import { filterMap } from 'filter-map';

const obj = {};
obj.a = { x: 9 };
obj.b = { x: 11 };
obj.c = { x: -100 };
obj.d = { y: 100 };

const results = filterMap(
  obj,
  o => o.x >= 9,
  o => o.x
);
// [9, 11]
```

### Set

```javascript
import { filterMap } from 'filter-map';

const set = new Set();
set.add(4);
set.add('fruit');
set.add({ x: 3 });
set.add('fish');

const results = filterMap(
  set,
  v => typeof v === 'string',
  str => `[${str}]`
);
// ['[fruit]', '[fish]']
```

### Generator Function

```javascript
import { filterMap } from 'filter-map';

function* generator(array) {
  for (const x of array) {
    yield x;
  }
}

const results = filterMap(
  generator([3, 0, -18, -100, 5]),
  n => n < 0,
  n => n / 2
);
// [-9, -50]
```

## Type Declarations

```typescript
export type FilterMapCollection<T> =
  | ArrayLike<T>
  | Map<string, T>
  | Set<T>
  | Record<string, T>
  | Generator<T>;

/**
 * Simultaneously filters and maps a collection
 * @param collection Collection to be filtered and mapped
 * @param predicateFn Predicate function to use for filtering
 * @param mapFn Mapping function used to transform input
 * @returns Filtered and transformed/mapped array
 */
export declare function filterMap<T, O>(
  collection: FilterMapCollection<T> | undefined | null,
  predicateFn: (current: T, keyIndex: number | string | T, collection: FilterMapCollection<T> ) => boolean,
  mapFn: (current: T, keyIndex: number | string | T, collection: FilterMapCollection<T>) => O
): O[];
```
