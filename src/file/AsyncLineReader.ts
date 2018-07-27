const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

export default class AsyncLineReader {
  filePath: string
  rl: any

  constructor(filePath: string, onLineAvailable: Function, onEof: Function) {
    const instream = fs.createReadStream(filePath);

    this.filePath = filePath;
    this.rl = readline.createInterface(instream);

    this.rl.on('line', onLineAvailable);
    this.rl.on('close', onEof);
  }
}