import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateTreatmentSheetDto,
  NextSheetNumberDto,
  TreatmentSheetDto,
  TreatmentSheetListDto,
} from '../dtos/treatment-sheet.dto';
import { TreatmentSheetsService } from '../services/treatment-sheets.service';

@ApiTags('Treatment Sheets')
@Controller('treatment-sheets')
export class TreatmentSheetsController {
  constructor(private readonly service: TreatmentSheetsService) {}

  @Post()
  @ApiOperation({
    summary: 'Store a "Phiếu theo dõi điều trị" (sheet number assigned by HIS)',
  })
  @ApiResponse({ status: 201, type: TreatmentSheetDto })
  async create(
    @Body() dto: CreateTreatmentSheetDto,
  ): Promise<TreatmentSheetDto> {
    return TreatmentSheetDto.from(await this.service.create(dto));
  }

  @Get('patient/:patientCode')
  @ApiOperation({ summary: 'Treatment sheets of a patient, newest first' })
  @ApiResponse({ status: 200, type: TreatmentSheetListDto })
  async getByPatient(
    @Param('patientCode') patientCode: string,
  ): Promise<TreatmentSheetListDto> {
    const sheets = await this.service.findByPatientCode(patientCode);
    return {
      data: sheets.map((s) => TreatmentSheetDto.from(s)),
      total: sheets.length,
    };
  }

  @Get('patient/:patientCode/next-number')
  @ApiOperation({
    summary: 'Sheet number the next sheet of this patient will get',
  })
  @ApiResponse({ status: 200, type: NextSheetNumberDto })
  async nextNumber(
    @Param('patientCode') patientCode: string,
  ): Promise<NextSheetNumberDto> {
    return { sheetNumber: await this.service.nextSheetNumber(patientCode) };
  }
}
