import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';

function* createFile() {
  for (let i = 0; i < 1000000; i++) {
    yield `User_${i}, user${i}@email.com\n`;
  }
}

const filePath = path.join(process.cwd(), 'bigFile.txt');
const readableStream = Readable.from(createFile());
const writableStream = fs.createWriteStream(filePath);
readableStream.pipe(writableStream);

writableStream.on('finish', () => {
  console.log('File created successfully');
});

writableStream.on('error', (err) => {
  console.error('Write error:', err);
});
