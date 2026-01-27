import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/upload') {
    const fileName = req.headers['file-name'] || 'uploaded_file.txt';
    const filePath = path.join(process.cwd(), fileName);
    const fileSize = parseInt(req.headers['content-length']) || '0';

    let uploadedSize = 0;

    const writeStream = fs.createWriteStream(filePath);
    console.log(`Starting upload: ${fileName}`);

    req.on('data', (chunk) => {
      uploadedSize += chunk.length;
      const percentage = ((uploadedSize / fileSize) * 100).toFixed(2);
      console.log(`Progress: ${percentage}% (${uploadedSize} bytes)`);
    });

    req.pipe(writeStream);

    writeStream.on('finish', () => {
      console.log('Upload completed and saved on disk.');
      res.writeHead(201, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'File uploaded successfully' }));
    });

    const handleError = (err) => {
      console.error('System Error:', err.message);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      res.writeHead(500);
      res.end('Upload file');
    };

    req.on('error', handleError);
    writeStream.on('error', handleError);
  } else {
    res.writeHead(404);
    res.end('Not found. Use POST');
  }
});

server.listen(3000, () => console.log('Server live on PORT 3000'));
