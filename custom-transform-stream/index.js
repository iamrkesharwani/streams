import { Transform } from 'node:stream';

class UppercaseTransform extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const text = chunk.toString('utf8').toUpperCase();
    this.push(Buffer.from(text));
    callback();
  }
}

const trans = new UppercaseTransform();
process.stdin.pipe(trans).pipe(process.stdout);
