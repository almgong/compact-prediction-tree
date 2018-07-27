import { CompactPredictionTreeNode } from './CompactPredictionTree';

interface CountTableInterface {
  [key: string]: number
};

export interface OccurrenceTableInterface {
  [key: string]: number
};

/**
 * The Count Table (CT) is a map structure (e.g. JS object) in the form:
 * {
 *   <sequenceValue>: number
 * }
 */
export default class CountTable {
  table: CountTableInterface
  occurrencesPerValue: OccurrenceTableInterface

  constructor() {
    this.table = {};
    this.occurrencesPerValue = {};
  }

  /**
   * Adds an entry to the count table
   * @param {[type]} sequenceValue a sequence value
   */
  add(sequenceValues: Array<string>) : void {
    sequenceValues.forEach((sequenceValue) => {
      this.table[sequenceValue] = this.table[sequenceValue] ? this.table[sequenceValue] + 1 : 1
    });

    console.log(this.table)
  }

  getConfidenceScores(): CountTableInterface {
    const confidenceScores = {...this.getSupportScores()};
    Object.keys(confidenceScores).forEach((value) => {
      confidenceScores[value] = confidenceScores[value] / this.occurrencesPerValue[value];
    });

    return confidenceScores;
  }

  getSupportScores(): CountTableInterface {
    return this.table;
  }

  getValues(): Array<string> {
    return Object.keys(this.table);
  }

  setOccurrencesPerValue(occurrencesPerValue: OccurrenceTableInterface) {
    this.occurrencesPerValue = occurrencesPerValue;
  }
}
