import http from 'node:http';
import { Readable, Transform } from 'node:stream';

async function* generateData(count) {
  for (let i = 1; i <= count; i++) {
    yield {
      id: i,
      name: `User_${i}`,
      email: `user${i}@email.com`,
      timeStamp: new Date().toISOString(),
    };
  }
}

const jsonToCsvTransform = new Transform({
  objectMode: true,
  transform(chunk, _, callback) {
    if (this.isFirstChunk === undefined) {
      this.push('Id,Name,Email,Timestamp\n');
      this.isFirstChunk = false;
    }

    const row = `${chunk.id},${chunk.name},${chunk.email},${chunk.timeStamp}\n`;
    callback(null, row);
  },
});

const server = http.createServer((req, res) => {
  if (req.url === '/export' && req.method === 'GET') {
    res.writeHead(200, {
      'content-type': 'text/csv',
      'content-disposition': 'attachment; filename="users.csv"',
    });

    const userCount = 10000;
    const readableCount = userCount.toLocaleString();
    const dataStream = Readable.from(generateData(userCount));
    console.log(`Exporting ${readableCount} users...`);

    dataStream
      .pipe(jsonToCsvTransform)
      .pipe(res)
      .on('finish', () => console.log('Export Complete!'))
      .on('error', (err) => {
        console.error('Export error:', err);
        if (!res.headersSent) {
          res.writeHead(500);
          res.end('Internal Server Error');
        }
      });
  } else {
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end('Go to /export to download CSV');
  }
});

server.listen(3000, () => console.log('Server running on PORT 3000'));
