import fs from 'node:fs';
import path from 'node:path';
import { Readable, Transform } from 'node:stream';

async function* generateData(count) {
  for (let i = 1; i <= count; i++) {
    const age = Math.floor(Math.random() * 61) + 5;
    const activeUser = age % 2 === 0;
    yield { name: `User_${i}`, age, status: activeUser };
  }
}

const csvPath = path.join(process.cwd(), 'users.csv');
const writeStream = fs.createWriteStream(csvPath, { encoding: 'utf8' });

writeStream.write(`name,age,status\n`);

const toCsv = new Transform({
  writableObjectMode: true,
  transform(user, _, callback) {
    const row = `${user.name},${user.age},${user.status}\n`;
    callback(null, row);
  },
});

Readable.from(generateData(10)).pipe(toCsv).pipe(writeStream);
writeStream.on('finish', () => console.log('CSV file created at:', csvPath));
