import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';

const execFilePromise = promisify(execFile);

async function getRecentCommits(repoPath = './') {
  const absolutePath = resolve(repoPath);
  const options = {
    cwd: absolutePath,
    timeout: 10000,
    maxBuffer: 1024 * 1024,
  };

  const gitArgs = ['log', '-n', '5', '--pretty=format:"%h|%an|%s"'];
  try {
    console.log(`Executing git log in: ${absolutePath}`);
    const { stdout, stderr } = await execFilePromise('git', gitArgs, options);
    if (stderr) console.warn('Git warning:', stderr);
    const commits = stdout
      .trim()
      .split('\n')
      .filter((line) => line.length > 0)
      .map((line) => {
        const [hash, author, subject] = line.split('|');
        return { hash, author, subject, processedAt: new Date().toISOString() };
      });

    return commits;
  } catch (error) {
    console.error('Git Command Failed:', error.message);
    if (error.code === 'ENOENT')
      console.error('Path is incorrect or Git not installed');
    return [];
  }
}

const data = await getRecentCommits();
console.log(JSON.stringify(data, null, 2));
