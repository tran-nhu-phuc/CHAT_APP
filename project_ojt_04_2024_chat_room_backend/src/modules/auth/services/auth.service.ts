import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createUserDto, userLoginDto } from '../../users/request/user.request';
import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { MSG_ERROR } from 'src/common/err.msg';
import { UserResponse } from 'src/modules/users/response/user.response';

/**
 * Auth service responsible for handling user authentication
 */
@Injectable()
export class AuthService {
  /**
   * Constructor to inject required dependencies.
   * @param userRepository - Instance of the UserRepository.
   * @param jwtService - Instance of the JwtService for JWT token generation and validation.
   */
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * @param userData - The user login data including email and password.
   * @returns Return an object containing access token and user data when successful authentication.
   * @throws UnauthorizedException if user does not exist or password does not match.
   */
  async signIn(
    userData: userLoginDto,
  ): Promise<{ accessToken: string; dataUser: UserResponse }> {
    const { email, password } = userData;
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException(MSG_ERROR.EMAIL_PASSWORD_INCORRECT_ERROR);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException(MSG_ERROR.EMAIL_PASSWORD_INCORRECT_ERROR);
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const dataUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };
    return { accessToken, dataUser };
  }

  /**
   * Registers a new user .
   * @param createUserData - The data required to create a new user is email, password, firstName,
   * lastName, birthdate, phone, role.
   * @throws UnauthorizedException if user with the provided email already exists.
   */
  async signUp(createUserData: createUserDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      birthDate,
      phone,
      role,
      avatar,
    } = createUserData;
    const userExist = await this.userRepository.getUserByEmail(email);

    if (userExist) {
      throw new UnauthorizedException(MSG_ERROR.EMAIL_EXIST_ERROR);
    }

    const hashPassword = await bcrypt.hash(password, 9);
    await this.userRepository.createNewUser({
      email,
      firstName,
      lastName,
      birthDate,
      phone,
      role,
      avatar,
      password: hashPassword,
    });
  }
}
