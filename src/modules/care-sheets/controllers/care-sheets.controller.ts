import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CareSheetDto,
  CareSheetListDto,
  CreateCareSheetDto,
  NextCareSheetNumberDto,
} from '../dtos/care-sheet.dto';
import { CareSheetsService } from '../services/care-sheets.service';

@ApiTags('Care Sheets')
@Controller('care-sheets')
export class CareSheetsController {
  constructor(private readonly service: CareSheetsService) {}

  @Post()
  @ApiOperation({ summary: 'Store a "Phiếu theo dõi và chăm sóc" (sheet number assigned by HIS)' })
  @ApiResponse({ status: 201, type: CareSheetDto })
  async create(@Body() dto: CreateCareSheetDto): Promise<CareSheetDto> {
    return CareSheetDto.from(await this.service.create(dto));
  }

  @Get('patient/:patientCode')
  @ApiOperation({ summary: 'Care sheets of a patient, newest first' })
  @ApiResponse({ status: 200, type: CareSheetListDto })
  async getByPatient(@Param('patientCode') patientCode: string): Promise<CareSheetListDto> {
    const sheets = await this.service.findByPatientCode(patientCode);
    return { data: sheets.map((s) => CareSheetDto.from(s)), total: sheets.length };
  }

  @Get('patient/:patientCode/next-number')
  @ApiOperation({ summary: 'Sheet number the next care sheet of this patient will get' })
  @ApiResponse({ status: 200, type: NextCareSheetNumberDto })
  async nextNumber(@Param('patientCode') patientCode: string): Promise<NextCareSheetNumberDto> {
    return { sheetNumber: await this.service.nextSheetNumber(patientCode) };
  }
}
