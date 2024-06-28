import { Roles } from '../role.decorator';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
// import { AuthGuard } from '../guards/auth.guard';
// import { RolesGuard } from '../guards/role.guard';
import { UserRoles } from 'src/modules/users/enums/user.enum';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import {
  createUserDto,
  userLoginDto,
} from 'src/modules/users/request/user.request';
import { ENDPOINT } from 'src/common/endpoint';
import { RequestGlobal } from 'src/common/requestGlobal';
import { UserService } from 'src/modules/users/services/user.service';
import { AuthGuard } from '../guards/auth.guard';

/**
 * Controller handling authentication endpoints.
 */
@Controller(ENDPOINT.AUTH)
export class AuthController {
  [x: string]: any;
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  /**
   * Endpoint for user sign-in.
   * @param userData - User login credentials, including email and password.
   * @param res - The HTTP response object to set the accessToken header and send the response data of user login.
   * @returns Returns void.
   */
  @Post(ENDPOINT.LOGIN)
  async signIn(
    @Body() userData: userLoginDto,
    @Res() res: Response,
  ): Promise<void> {
    const { dataUser, accessToken } = await this.authService.signIn(userData);
    res.setHeader('Authorization', 'Bearer ' + accessToken);
    res.status(200).json(dataUser);
    return;
  }

  /**
   * Endpoint for user sign-up.
   * @param registerUserData - The data required to create a new user account.
   * @returns Return void.
   */
  @Post(ENDPOINT.REGISTER)
  // @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async signUp(@Body() registerUserData: createUserDto): Promise<void> {
    return await this.authService.signUp(registerUserData);
  }

  /**
   * For checking if user has login before.
   * @req - get userId from authGuard.
   * @returns Return userData.
   */
  @UseGuards(AuthGuard)
  @Get(ENDPOINT.CHECK_LOGIN)
  async checkSignIn(@Req() req: RequestGlobal): Promise<any> {
    const result = await this.userService.getUserById(req.user.id);
    return result;
  }
}
