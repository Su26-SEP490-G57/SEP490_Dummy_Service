import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurgicalRecordsController } from './controllers/surgical-records.controller';
import { SurgicalRecord } from './entities/surgical-record.entity';
import { SurgicalRecordsService } from './services/surgical-records.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurgicalRecord])],
  controllers: [SurgicalRecordsController],
  providers: [SurgicalRecordsService],
})
export class SurgicalRecordsModule {}
