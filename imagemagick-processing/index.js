import { spawn } from 'node:child_process';
import { createWriteStream, createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

async function resizeImage(inputFile, outputFile) {
  const transformer = spawn('magick', ['-', '-resize', '400x400', 'png:-']);

  const timeout = setTimeout(() => {
    console.error('Process taking too long... Killing it.');
    transformer.kill('SIGKILL');
  }, 5000);

  try {
    await pipeline(createReadStream(inputFile), transformer.stdin);
    await pipeline(transformer.stdout, createWriteStream(outputFile));

    clearTimeout(timeout);
    console.log('Task finished successfully.');
  } catch (error) {
    clearTimeout(timeout);
    if (error.code === 'ERR_STREAM_PREMATURE_CLOSE') {
      console.error('Process was killed due to timeout.');
    } else {
      console.error('Pipeline error:', error.message);
    }
  }

  transformer.stderr.on('data', (data) => {
    console.error(`Magick Error: ${data}`);
  });

  transformer.on('close', (code) => {
    if (code === 0) console.log('Image resized successfully');
    else console.log(`Process exited with code ${code}`);
  });
}

resizeImage('image.jpg', 'resized.png');
