import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ValidatorService } from './validations/check-expiration-time';
import { UserModule } from '../user/user.module';
import { JWT_CONFIG } from 'src/configs/constant.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT_CONFIG.SECRET,
      signOptions: {
        expiresIn: JWT_CONFIG.EXPIRED_IN,
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ValidatorService],
  exports: [AuthService],
})
export class AuthModule {}
