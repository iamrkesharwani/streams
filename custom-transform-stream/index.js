import { Transform } from 'node:stream';

class FilterActiveUsers extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(user, _, callback) {
    console.log(`Processing user: ${user.name}`);
    if (user.isActive) this.push(user);
    callback();
  }
}

const filter = new FilterActiveUsers();
filter.on('data', (data) => console.log('Output received:', data));

filter.write({ name: 'Rahul', isActive: true });
filter.write({ name: 'Kesharwani', isActive: false });
filter.end();
