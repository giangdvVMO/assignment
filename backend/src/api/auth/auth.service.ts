import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { ValidatorService } from './validations/check-expiration-time';
import { JwtPayload } from './payloads/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly validatorService: ValidatorService,
  ) {}

  async validateUser(username: string, password: string) {
    console.log('validate');
    const user: any = await this.userService.findOneByCondition({
      username: username,
    });
    console.log('user', user);
    if (!user) {
      throw new BadRequestException(
        'Không tồn tại tài khoản có tên đăng nhập như trên',
      );
    }
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (user && comparePassword) {
      console.log(user);
      return user;
    }
    throw new BadRequestException('Sai mật khẩu');
    return null;
  }

  async login(user: any): Promise<any> {
    const payload: JwtPayload = {
      sub: user._id,
      username: user.username,
      email: user.email,
    };
    console.log(payload);
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
