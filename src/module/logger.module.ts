import { Module, Global } from '@nestjs/common';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { LoggerService } from 'src/common/logger/logger.service';
import * as winston from 'winston';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', { colors: true, prettyPrint: true, processId: true, appName: true }),
          ),
        }),
      ],
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
