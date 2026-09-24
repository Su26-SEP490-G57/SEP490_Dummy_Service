import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareSheetsController } from './controllers/care-sheets.controller';
import { CareSheet } from './entities/care-sheet.entity';
import { CareSheetsService } from './services/care-sheets.service';

@Module({
  imports: [TypeOrmModule.forFeature([CareSheet])],
  controllers: [CareSheetsController],
  providers: [CareSheetsService],
})
export class CareSheetsModule {}
