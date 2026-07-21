import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getPassword(): any {
    const bcrypt = require('bcryptjs');

    bcrypt.hash('Admin@123', 10).then(console.log);
  }
  getHello(): string {
    return 'Hello World!';
  }

}
