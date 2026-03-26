import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [
    PassportModule,
  ],
  providers: [AuthService ,JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, PassportModule], 
})
export class AuthModule {}
