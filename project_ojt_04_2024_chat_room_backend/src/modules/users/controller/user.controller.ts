import { Controller, Get, Param, Body, Patch } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get the user by id
   * @param id The ID of the user .
   * @returns The user object if found, otherwise null.
   */
  @Get(':id')
  async getUserById(@Param('id') id: string | number): Promise<User | null> {
    const user = await this.userService.getUserById(id);
    return user;
  }

  /**
   * Update the avatar of a user.
   * @param id The ID of the user.
   * @param avatar The new avatar URL.
   */
  @Patch('/avatar/:id')
  async editUserAvatar(
    @Param('id') id: string,
    @Body('avatar') avatar: string,
  ): Promise<void> {
    await this.userService.editUserAvatar(id, avatar);
  }
}
