import http from 'node:http';
import fs from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream';

const server = http.createServer((req, res) => {
  if (req.url === '/download' && req.method === 'GET') {
    const filePath = './bigFile.txt';

    res.writeHead(200, {
      'content-type': 'text/plain',
      'content-encoding': 'gzip',
      'content-disposition': 'attachment; filename="bigFile.gz"',
    });

    const readStream = fs.createReadStream(filePath);
    const gzip = createGzip();

    pipeline(readStream, gzip, res, (err) => {
      if (err) {
        console.error('Pipline failed:', err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Compression Error');
        }
      } else {
        console.log('File compressed and sent successfully!');
      }
    });
  } else {
    res.end('Go to /download');
  }
});

server.listen(3000, () => console.log('Compression started on PORT 3000'));
