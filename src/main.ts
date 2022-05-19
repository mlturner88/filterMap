export type FilterMapCollection<T> =
  | ArrayLike<T>
  | Map<string, T>
  | Set<T>
  | Record<string, T>
  | Generator<T>;

/**
 * Simultaneously filters and maps a collection
 */
export function filterMap<T, O>(
  collection: FilterMapCollection<T> | undefined | null,
  predicateFn: (
    current: T,
    keyIndex: number | string | T,
    collection: FilterMapCollection<T>
  ) => boolean,
  mapFn: (
    current: T,
    keyIndex: number | string | T,
    collection: FilterMapCollection<T>
  ) => O
): O[] {
  const results: O[] = [];
  if (!collection) return results;

  if ((collection as Generator<T>).next) {
    // handle generator function iterator
    let c = 0;

    for (const next of collection as Generator<T>) {
      if (predicateFn(next, c, collection)) {
        results.push(mapFn(next, c, collection));
      }
      c++;
    }

    return results;
  }

  if ((collection as Map<string, T> | Set<T>).entries) {
    // both Map and Set have function to grab entries
    for (const [k, v] of (collection as Map<string, T> | Set<T>).entries()) {
      if (predicateFn(v, k, collection)) {
        results.push(mapFn(v, k, collection));
      }
    }

    return results;
  }

  if (typeof (collection as ArrayLike<T>).length !== 'undefined') {
    for (let i = 0; i < (collection as ArrayLike<T>).length; i++) {
      const c = (collection as ArrayLike<T>)[i];
      if (predicateFn(c, i, collection)) {
        results.push(mapFn(c, i, collection));
      }
    }

    return results;
  }

  for (const c in collection) {
    if (predicateFn((collection as Record<string, T>)[c], c, collection)) {
      results.push(mapFn((collection as Record<string, T>)[c], c, collection));
    }
  }

  return results;
}
