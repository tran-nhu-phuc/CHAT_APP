import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  /**
   * Constructor to inject the UserRepository dependency.
   * @param userRepository - Instance of the UserRepository.
   */
  constructor(private userRepository: UserRepository) {}

  /**
   * @param email - The email address of user
   * @returns  return user data if found, otherwise return null.
   */
  async getUserByEmail(email: string) {
    return await this.userRepository.getUserByEmail(email);
  }

  /**
   *
   * @param id - Id of user
   * @returns returns user if found, otherwise returns null
   */
  async getUserById(id: string | number): Promise<User | null> {
    return await this.userRepository.getUserById(id);
  }
  /**
   *
   * @param id  -Id of user to edit avatar
   * @param avatar - avatar to edit
   */
  async editUserAvatar(id: string, avatar: string): Promise<void> {
    await this.userRepository.editUserAvatar(id, avatar);
  }
}
