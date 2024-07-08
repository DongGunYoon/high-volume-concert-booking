import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/presentation/user/user.module';
import { UserAuthGuard, UserQueueAuthGuard } from './guard/auth.guard';

@Module({
  imports: [UserModule, JwtModule.register({ global: true })],
  providers: [UserAuthGuard, UserQueueAuthGuard],
  exports: [UserAuthGuard, UserQueueAuthGuard],
})
export class AuthModule {}
