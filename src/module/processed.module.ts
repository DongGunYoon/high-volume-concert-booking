import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessedRepositorySymbol } from 'src/domain/processed/interface/processed.repository';
import { ProcessedService } from 'src/domain/processed/service/processed.service';
import { ProcessedEntity } from 'src/infrastructure/processed/processed.entity';
import { ProcessedRepositoryImpl } from 'src/infrastructure/processed/processed.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessedEntity])],
  providers: [ProcessedService, { provide: ProcessedRepositorySymbol, useClass: ProcessedRepositoryImpl }],
  exports: [ProcessedService],
})
export class ProcessedModule {}
