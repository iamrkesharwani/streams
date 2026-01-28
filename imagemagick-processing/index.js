import { spawn } from 'node:child_process';
import { createWriteStream, createReadStream } from 'node:fs';

function resizeImage(inputFile, outputFile) {
  const transformer = spawn('magick', ['-', '-resize', '400x400', 'png:-']);
  const input = createReadStream(inputFile);
  const output = createWriteStream(outputFile);

  input.pipe(transformer.stdin);
  transformer.stdout.pipe(output);

  transformer.stderr.on('data', (data) => {
    console.error(`Magick Error: ${data}`);
  });

  transformer.on('close', (code) => {
    if (code === 0) console.log('Image resized successfully');
    else console.log(`Process exited with code ${code}`);
  });
}

resizeImage('image.jpg', 'resized.png');
