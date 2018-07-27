import AsyncLineReader from '../file/AsyncLineReader';
import CompactPredictionTree from './data_structures/CompactPredictionTree';
import InvertedIndex from './data_structures/InvertedIndex';
import LookupTable from './data_structures/LookupTable';
import CountTable from './data_structures/CountTable';

const DEFAULT_PREFIX_LENGTH = 5;
const DEFAULT_SEPARATOR = ',';

export default class CptModel {
  filePath: string
  nextSeqId: number
  cpt: CompactPredictionTree
  invertedIndex: InvertedIndex
  lookupTable: LookupTable

  constructor(filePath: string) {
    this.filePath = filePath;
    this.cpt = new CompactPredictionTree();
    this.invertedIndex = new InvertedIndex();
    this.lookupTable = new LookupTable();
    this.nextSeqId = 0;
  }

  addNewSequence(sequence: Array<string>, sequenceIdentifier = this.generateNextSeqId()): void {
    const lastNodeInCpt = this.cpt.add(sequence);
    this.invertedIndex.add(sequenceIdentifier, sequence);
    this.lookupTable.add(sequenceIdentifier, lastNodeInCpt);
  }

  generateNextSeqId(): string {
    return `Seq${this.nextSeqId++}`;
  }

  predict(inputSequence: Array<string>, prefixLength = DEFAULT_PREFIX_LENGTH): CountTable {
    const referenceSequence = inputSequence.slice(-1*DEFAULT_PREFIX_LENGTH);
    const similarSequences = this.invertedIndex.getSimilarSequencesFor(referenceSequence);
    const similarSequencesEndNodes = this.lookupTable.endNodesFor(similarSequences);

    // computes the consequents w.r.t each similar sequence
    // and registers results to the CountTable instance
    const countTable = new CountTable();
    similarSequencesEndNodes.forEach((node) => {
      countTable.add(this.cpt.reverseTraversalUntilIncluded(node, referenceSequence));
    });

    const candidateValues = countTable.getValues();
    const occurrencesPerValue = this.invertedIndex.getOccurrencesPerValue(candidateValues);
    countTable.setOccurrencesPerValue(occurrencesPerValue);

    return countTable;
  }

  train(separator = DEFAULT_SEPARATOR): void {
    function onLineAvailable(line: string) {
      this.addNewSequence(line.split(DEFAULT_SEPARATOR));
    }

    function onEof() {}

    new AsyncLineReader(this.filePath, onLineAvailable.bind(this), onEof);
  }
}
