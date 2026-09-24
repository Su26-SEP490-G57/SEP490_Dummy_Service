import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { CareSheet } from '../entities/care-sheet.entity';

export const CARE_SHEET_TYPES = ['LEVEL_1', 'LEVEL_2_3'] as const;

/** Body of `POST /care-sheets`. `sheetNumber` is assigned by the HIS. */
export class CreateCareSheetDto {
  @ApiProperty({ enum: CARE_SHEET_TYPES })
  @IsIn(CARE_SHEET_TYPES)
  sheetType!: string;

  @ApiPropertyOptional({ example: 'LEVEL_1' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  careLevel?: string;

  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(64) patientCode!: string;
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(255) patientName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255) facility?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255) department?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(64) admissionNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) age?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(10) gender?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50) room?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50) bed?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() diagnosis?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasAllergy?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() allergyNote?: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  recordedAt!: Date;

  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  @IsObject()
  content!: Record<string, string>;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255) nurseName?: string;
}

export class CareSheetDto {
  @ApiProperty() sheetId!: number;
  @ApiProperty() sheetNumber!: number;
  @ApiProperty({ enum: CARE_SHEET_TYPES }) sheetType!: string;
  @ApiPropertyOptional({ nullable: true }) careLevel!: string | null;
  @ApiProperty() patientCode!: string;
  @ApiProperty() patientName!: string;
  @ApiPropertyOptional({ nullable: true }) facility!: string | null;
  @ApiPropertyOptional({ nullable: true }) department!: string | null;
  @ApiPropertyOptional({ nullable: true }) admissionNumber!: string | null;
  @ApiPropertyOptional({ nullable: true }) age!: number | null;
  @ApiPropertyOptional({ nullable: true }) gender!: string | null;
  @ApiPropertyOptional({ nullable: true }) room!: string | null;
  @ApiPropertyOptional({ nullable: true }) bed!: string | null;
  @ApiPropertyOptional({ nullable: true }) diagnosis!: string | null;
  @ApiPropertyOptional({ nullable: true }) hasAllergy!: boolean | null;
  @ApiPropertyOptional({ nullable: true }) allergyNote!: string | null;
  @ApiProperty() recordedAt!: Date;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  content!: Record<string, string>;
  @ApiPropertyOptional({ nullable: true }) nurseName!: string | null;
  @ApiProperty() createdAt!: Date;

  static from(entity: CareSheet): CareSheetDto {
    return { ...entity };
  }
}

export class CareSheetListDto {
  @ApiProperty({ type: [CareSheetDto] }) data!: CareSheetDto[];
  @ApiProperty() total!: number;
}

export class NextCareSheetNumberDto {
  @ApiProperty({ example: 3 }) sheetNumber!: number;
}
