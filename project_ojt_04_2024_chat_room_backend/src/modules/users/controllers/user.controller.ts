import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from '../services/user.service';
import { createUserDto } from '../request/user.request';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() createUserData: createUserDto) {
    const newUser = await this.createUser(createUserData);
    return newUser;
  }
}
