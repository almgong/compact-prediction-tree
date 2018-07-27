import AsyncLineReader from './file/AsyncLineReader';
import CptModel from './model/CptModel';
import CountTable from './model/data_structures/CountTable';

const MAX_RESULTS_PER_QUERY = 5;
const defaultPredictionOptions = {
  maxResultsPerQuery: MAX_RESULTS_PER_QUERY,
  useConfidenceScores: false
};

interface PredictionOptions {
  maxResultsPerQuery: number,
  useConfidenceScores: boolean
};

/**
 * The Predictor object is the entry point to training the predictive model
 * and querying for the next likely set of items given an input sequence.
 */
export default class Predictor {
  trainingDataSetFilePath: string
  model: CptModel

  /**
   * Creates a new Predictor
   * @param {String} trainingDataSetFileName The path to the training data set
   */
  constructor(trainingDataSetFilePath: string) {
    this.trainingDataSetFilePath = trainingDataSetFilePath;
    this.model = new CptModel(this.trainingDataSetFilePath);
  }

  /**
   * Trains the predictive model
   */
  train() {
    this.model.train();
  }

  /**
   * Predicts (at most) the next N items given the input sequence.
   * @param  {Array<string>} inputSequence      The input sequence used for prediction
   * @param  {Number}        maxResultsPerQuery The maximum number of predictions (N)
   * @return {Array<string>}                    the predicted values
   */
  predict(inputSequence: Array<string>, predictionOptions = {}): Array<string> {
    const options: PredictionOptions = { ...defaultPredictionOptions, ...predictionOptions };
    const countTable: CountTable = this.model.predict(inputSequence);
    const scores = options.useConfidenceScores ? countTable.getConfidenceScores() : countTable.getSupportScores();

    return Object.keys(scores).sort((a, b) => scores[b] - scores[a]).slice(0, options.maxResultsPerQuery);
  }
}
