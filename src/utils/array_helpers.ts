/**
 * Returns a number greater than 0 if element1 is greater than element 2, a number
 * less than 0 if element 2 is greater than element 1, or 0 if the two are equal
 */
function defaultElementComparatorFn<T>(element1: T, element2: T): number {
  if (element1 > element2) {
    return 1;
  } else if (element2 > element1) {
    return -1;
  } else {
    return 0;
  }
}

/**
 * Inserts an element into the array with respect to the optional comparison function
 */
export function insertInOrder<T>(array: Array<T>, element: T, comparatorFn = defaultElementComparatorFn ): void {
  if (array.length == 0) {
    array.push(element);
  } else if (array.length == 1) {
    comparatorFn(array[0], element) > 0 ? array.splice(0, 0, element) : array.push(element);  
  } else {
    // otherwise we use binary search to find the right index to insert the element into
    let lower = 0;
    let upper = array.length - 1;
    let correctSpot = null;

    while(!correctSpot) {
      const delta = Math.floor((upper - lower) / 2);

      if (delta === 0) {
        correctSpot = array[upper] > element ? upper : upper + 1;
        break;
      }

      const middle = lower + delta;
      const comparisonResult = comparatorFn(array[middle], element);

      if (comparisonResult > 0) {  // middle element > new element, shift left
        upper = middle;
      } else {  // middle element <= new element, shift right
        lower = middle;
      }
    }

    array.splice(correctSpot, 0, element);
  }
}

export function intersectionOf<T>(array1: Array<T>, array2: Array<T>) {
  return array1.filter((item) => array2.indexOf(item) !== -1);
}
