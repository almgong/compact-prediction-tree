class CompactPredictionTreeNode {
  parentNode: CompactPredictionTreeNode
  children: Array<CompactPredictionTreeNode>
  value: string

  constructor(parentNode?: CompactPredictionTreeNode, children?: Array<CompactPredictionTreeNode>, value?: string) {
    this.parentNode = parentNode;
    this.children = children || [];
    this.value = value;
  }

  isRootNode(): boolean {
    return !this.parentNode;
  }
}

export { CompactPredictionTreeNode };

/**
 * A Compact Prediction Tree is essentially a customized trie data structure.
 */
export default class CompactPredictionTree {
  rootNode: CompactPredictionTreeNode

  constructor() {
    this.rootNode = new CompactPredictionTreeNode();
  }

  /**
   * Adds a sequence to the tree
   * @param  {Array<string>}             sequence An array of string values, each representing a node
   * @return {CompactPredictionTreeNode}          The last node in the sequence, or null if there is none
   */
  add(sequence: Array<string>): CompactPredictionTreeNode {
    let cursor = 0;
    let currentNode = this.rootNode;
    let lastNodeInSequence = null;

    while(cursor < sequence.length) {
      // Check if any children have the same value
      const childWithValue = this._findChildWithValue(currentNode, sequence[cursor]);
      if (childWithValue) {  // if there is a matching child, use it
        currentNode = childWithValue;
      } else {  // else we need to create a new node in the trie
        const newNode = new CompactPredictionTreeNode(currentNode, [], sequence[cursor]);
        currentNode.children.push(newNode);

        currentNode = newNode;
      }

      cursor++;
    }

    // we don't want to return a reference to the root node since it is more of a dummy node
    return currentNode === this.rootNode ? null : currentNode;
  }

  /**
   * Starts from the specified node and traverses towards the root of the tree
   * until either the root is encountered or the the value of the current node
   * is included in the specified array.
   * @param  {CompactPredictionTreeNode} node          the start node
   * @param  {Array<string>}             includesArray array of 'stop' values
   * @return {Array<string>}                           an array of values visited until stop (excluding the stop value)
   */
  reverseTraversalUntilIncluded(node: CompactPredictionTreeNode, includesArray: Array<string>): Array<string> {
    let currentNode = node;
    const visitedValues: Array<string> = [];
    while (!currentNode.isRootNode() && includesArray.indexOf(currentNode.value) === -1) {
      visitedValues.push(currentNode.value);
      currentNode = currentNode.parentNode;
    }

    return visitedValues;
  }

  _findChildWithValue(node: CompactPredictionTreeNode, value: string): CompactPredictionTreeNode {
    const match = node.children.filter((child) => child.value === value);
    return match.length ? match[0] : null;
  }
}
