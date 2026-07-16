import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SurgicalRecordDto,
  SurgicalRecordListDto,
} from '../dtos/surgical-record-response.dto';
import { SurgicalRecordsService } from '../services/surgical-records.service';

@ApiTags('Surgical Records')
@Controller('surgical-records')
export class SurgicalRecordsController {
  constructor(private readonly service: SurgicalRecordsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all surgical patient records',
    description:
      'Returns every patient who has undergone surgery (records with an operation date). ' +
      'Consumed by the capstone backend to import patient cases instead of manual entry.',
  })
  @ApiResponse({ status: 200, type: SurgicalRecordListDto })
  async getAll(): Promise<SurgicalRecordListDto> {
    const records = await this.service.findAllOperated();
    return {
      data: records.map((r) => SurgicalRecordDto.from(r)),
      total: records.length,
    };
  }
}
