import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthGuard, UserQueueAuthGuard } from '../common/guard/auth.guard';
import { UserModule } from 'src/module/user.module';

@Module({
  imports: [UserModule, JwtModule.register({ global: true })],
  providers: [UserAuthGuard, UserQueueAuthGuard],
  exports: [UserAuthGuard, UserQueueAuthGuard],
})
export class AuthModule {}
