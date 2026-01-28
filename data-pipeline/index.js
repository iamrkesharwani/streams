import { Transform } from 'node:stream';
import { createReadStream } from 'node:fs';
import readline from 'node:readline';

class AgeValidator extends Transform {
  constructor(msDelay) {
    super({ objectMode: true });
    this.delay = msDelay;
  }

  _transform(user, _, callback) {
    const memory = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`[Memory Usage]: ${memory.toFixed(2)} MB`);

    setTimeout(() => {
      if (user.age > 18) this.push(user);
      callback();
    }, this.delay);
  }
}

async function processCsv() {
  const fileStream = createReadStream('./users.csv');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const validator = new AgeValidator(100);
  validator.on('data', (data) => console.log('Validated User:', data));

  for await (const line of rl) {
    const [name, age, status] = line.split(',');
    validator.write({ name, age: parseInt(age), status });
  }

  validator.end();
}

processCsv();
