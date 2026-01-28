import { spawn } from 'node:child_process';
import { createWriteStream, createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

async function extractThumbnail(videoInput, thumbnailOutput) {
  const ffmpeg = spawn('ffmpeg', [
    '-i',
    'pipe:0',
    '-ss',
    '00:00:01',
    '-vframes',
    '1',
    '-f',
    'image2pipe',
    '-vcodec',
    'mjpeg',
    'pipe:1',
  ]);

  try {
    await Promise.all([
      pipeline(createReadStream(videoInput), ffmpeg.stdin).catch((err) => {
        if (err.code !== 'EPIPE') throw err;
      }),
      pipeline(ffmpeg.stdout, createWriteStream(thumbnailOutput)),
    ]);
    console.log('Process Success: Thumbnail Created');
  } catch (error) {
    console.error('Pipeline Failed:', error.message);
    if (!ffmpeg.killed) ffmpeg.kill('SIGKILL');
  }
}

await extractThumbnail('video.mp4', 'thumbnail.png');
