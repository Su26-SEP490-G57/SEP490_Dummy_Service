import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { TreatmentSheet } from '../entities/treatment-sheet.entity';

/** Body of `POST /treatment-sheets`. `sheetNumber` is assigned by the HIS. */
export class CreateTreatmentSheetDto {
  @ApiProperty({ example: 'BN000012' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  patientCode!: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  patientName!: string;

  @ApiPropertyOptional({ example: 'Bệnh viện Đa khoa' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  facility?: string;

  @ApiPropertyOptional({ example: 'Khoa Ngoại' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  department?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comorbidities?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  gender?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  room?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bed?: string;

  @ApiProperty({ example: '2026-09-23T08:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  recordedAt!: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  progressNotes!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orders!: string;

  @ApiPropertyOptional({ example: 'LEVEL_2' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  careLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  doctorName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  externalOrderId?: number;
}

export class TreatmentSheetDto {
  @ApiProperty() sheetId!: number;
  @ApiProperty() sheetNumber!: number;
  @ApiProperty() patientCode!: string;
  @ApiProperty() patientName!: string;
  @ApiPropertyOptional({ nullable: true }) facility!: string | null;
  @ApiPropertyOptional({ nullable: true }) department!: string | null;
  @ApiPropertyOptional({ nullable: true }) diagnosis!: string | null;
  @ApiPropertyOptional({ nullable: true }) comorbidities!: string | null;
  @ApiPropertyOptional({ nullable: true }) age!: number | null;
  @ApiPropertyOptional({ nullable: true }) gender!: string | null;
  @ApiPropertyOptional({ nullable: true }) room!: string | null;
  @ApiPropertyOptional({ nullable: true }) bed!: string | null;
  @ApiProperty() recordedAt!: Date;
  @ApiProperty() progressNotes!: string;
  @ApiProperty() orders!: string;
  @ApiPropertyOptional({ nullable: true }) careLevel!: string | null;
  @ApiPropertyOptional({ nullable: true }) doctorName!: string | null;
  @ApiPropertyOptional({ nullable: true }) externalOrderId!: number | null;
  @ApiProperty() createdAt!: Date;

  static from(entity: TreatmentSheet): TreatmentSheetDto {
    return { ...entity };
  }
}

export class TreatmentSheetListDto {
  @ApiProperty({ type: [TreatmentSheetDto] })
  data!: TreatmentSheetDto[];

  @ApiProperty()
  total!: number;
}

export class NextSheetNumberDto {
  @ApiProperty({ example: 3 })
  sheetNumber!: number;
}
