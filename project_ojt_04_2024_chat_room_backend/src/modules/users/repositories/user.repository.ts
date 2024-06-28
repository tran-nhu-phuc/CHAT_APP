import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createUserDto } from '../request/user.request';

const logger = new Logger('UserRepository');

@Injectable()
export class UserRepository {
  /**
   * UserRepository constructor.
   * @param {Repository<User>} userDb - The repository for User entity.
   */
  constructor(
    @InjectRepository(User)
    private userDb: Repository<User>,
  ) {}

  /**
   * Get a user by ID.
   * @param {any} id - ID of the user.
   * @returns {Promise<User>} - Return user if found.
   * @throws {InternalServerErrorException} - If an error occurs.
   */
  async getUserById(id: any): Promise<User> {
    try {
      return await this.userDb.findOne({
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          birthDate: true,
          avatar: true,
        },
      });
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Get a user by email address.
   * @param {string} email - Email address of the user.
   * @returns {Promise<User>} - Return user if found.
   * @throws {InternalServerErrorException} - If an error occurs.
   */
  async getUserByEmail(email: string): Promise<User> {
    try {
      return await this.userDb.findOne({ where: { email } });
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Create a new user.
   * @param {createUserDto} userData - Data of new user.
   * @returns {Promise<void>} - Return void
   * @throws {InternalServerErrorException} - If an error occurs.
   */
  async createNewUser(userData: createUserDto): Promise<void> {
    try {
      await this.userDb.save(userData);
    } catch (error) {
      console.log(error);

      logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  /**
   *
   * @param id -Id of user want to edit avatar
   * @param avatar - Avatar to edit
   * @returns {Promise<void>}-Return void
   * @throws {InternalServerErrorException} - If an error occurs.
   */
  async editUserAvatar(id: string, avatar: string): Promise<void> {
    try {
      await this.userDb.update(id, { avatar });
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
