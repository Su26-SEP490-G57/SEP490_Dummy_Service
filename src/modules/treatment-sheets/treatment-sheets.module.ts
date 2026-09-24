import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreatmentSheetsController } from './controllers/treatment-sheets.controller';
import { TreatmentSheet } from './entities/treatment-sheet.entity';
import { TreatmentSheetsService } from './services/treatment-sheets.service';

@Module({
  imports: [TypeOrmModule.forFeature([TreatmentSheet])],
  controllers: [TreatmentSheetsController],
  providers: [TreatmentSheetsService],
})
export class TreatmentSheetsModule {}
