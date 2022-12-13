import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AUTH_SWAGGER_RESPONSE } from './auth.constant';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';

@ApiTags('Authentication')
@Controller({
  version: ['1'],
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOkResponse(AUTH_SWAGGER_RESPONSE.LOGIN_SUCCESS)
  @ApiNotFoundResponse(AUTH_SWAGGER_RESPONSE.LOGIN_FAIL)
  @ApiUnauthorizedResponse(AUTH_SWAGGER_RESPONSE.UNAUTHORIZED_EXCEPTION)
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { username, password } = body;
    const user: any = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @ApiOkResponse(AUTH_SWAGGER_RESPONSE.LOGIN_SUCCESS)
  @ApiNotFoundResponse(AUTH_SWAGGER_RESPONSE.LOGIN_FAIL)
  @ApiUnauthorizedResponse(AUTH_SWAGGER_RESPONSE.UNAUTHORIZED_EXCEPTION)
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.userService.create(body);
  }
}
