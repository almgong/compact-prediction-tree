import { CompactPredictionTreeNode } from './CompactPredictionTree';

interface LookupTableInterface {
  [key: string]: CompactPredictionTreeNode
};

/**
 * The Lookup Table (LT) is a map structure (e.g. JS object) in the form:
 * {
 *   sequenceId: <last node in sequence>,
 *   ...
 * }
 */
export default class LookupTable {
  table: LookupTableInterface

  constructor() {
    this.table = {};
  }

  /**
   * Adds a sequence-node entry to the lookup table (LT)
   * @param  {string}                    sequenceId the sequence identifier
   * @param  {CompactPredictionTreeNode} node       the last node in the CPT for this sequence
   */
  add(sequenceId: string, node: CompactPredictionTreeNode) : void {
    this.table[sequenceId] = node;
  }

  /**
   * Returns the last node for each of the specified sequence IDs
   * @param  {Array<string>}                    sequenceIds array of sequence IDs
   * @return {Array<CompactPredictionTreeNode>}             the last node for each sequence ID in the CPT
   */
  endNodesFor(sequenceIds: Array<string>) : Array<CompactPredictionTreeNode> {
    return sequenceIds.map((sequenceId) => this.table[sequenceId]);
  }
}
