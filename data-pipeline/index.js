import { Transform } from 'node:stream';
import { createReadStream } from 'node:fs';
import readline from 'node:readline';

class AgeValidator extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(user, _, callback) {
    if (user.age > 18) this.push(user);
    callback();
  }
}

async function processCsv() {
  const fileStream = createReadStream('./users.csv');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const validator = new AgeValidator();
  validator.on('data', (data) => console.log('Validated User:', data));

  for await (const line of rl) {
    const [name, age, status] = line.split(',');
    validator.write({ name, age: parseInt(age), status });
  }

  validator.end();
}

processCsv();
