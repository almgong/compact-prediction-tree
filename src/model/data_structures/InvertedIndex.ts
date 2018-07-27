import { CompactPredictionTreeNode } from './CompactPredictionTree';
import { OccurrenceTableInterface } from './CountTable';
import { intersectionOf } from '../../utils/array_helpers';
import Set from '../../utils/Set';

interface InvertedIndexInterface {
  [key: string]: Set
};

/**
 * The InvertedIndex (II) is a map structure (e.g. JS object) in the form:
 * {
 *   <sequence value>: [sequenceId, ...],
 *   ...
 * }
 */
export default class InvertedIndex {
  table: InvertedIndexInterface

  constructor() {
    this.table = {};
  }

  add(sequenceId: string, sequenceValues: Array<string>) : void {
    sequenceValues.forEach((sequenceValue) => {
      if (!this.table[sequenceValue]) {
        this.table[sequenceValue] = new Set();
      }

      this.table[sequenceValue].add(sequenceId);
    });
  }

  getSimilarSequencesFor(sequence: Array<string>) : Array<string> {
    // Similar sequences are defined as all sequences that have every
    // element in the input sequence, in any order.
    // This can be seen as iteratively computing the intersection of one 
    // array and another
    let arraysToFindIntersectionOf: Array<Array<string>> = [];
    sequence.forEach((sequenceValue) => {
      arraysToFindIntersectionOf.push(this.table[sequenceValue].getItems() || []);
    });

    let similarSequences: Array<string> = [];
    if (arraysToFindIntersectionOf.length > 0) {
      let currentArray = arraysToFindIntersectionOf[0];

      for (let i = 1; i < arraysToFindIntersectionOf.length; i++) {
        currentArray = intersectionOf(currentArray, arraysToFindIntersectionOf[i]);
      }

      similarSequences = currentArray;
    }

    return similarSequences;
  }

  getOccurrencesPerValue(values: Array<string>): OccurrenceTableInterface {
    const occurrences: OccurrenceTableInterface = {};

    values.forEach((value) => {
      occurrences[value] = this.table[value].getLength();
    })

    return occurrences;
  }
}
