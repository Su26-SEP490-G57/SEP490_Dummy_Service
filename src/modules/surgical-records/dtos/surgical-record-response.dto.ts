import { ApiProperty } from '@nestjs/swagger';
import { SurgicalRecord } from '../entities/surgical-record.entity';

/** Public shape of a surgical record returned by the HIS API. */
export class SurgicalRecordDto {
  @ApiProperty({ example: '3f1c2b9e-8a4d-4e2a-9f0b-1c2d3e4f5a6b' })
  recordId!: string;

  @ApiProperty({ example: 'HIS-000123' })
  hospitalPatientCode!: string;

  @ApiProperty({ example: 'N.V.A' })
  patientName!: string;

  @ApiProperty({ example: '1975-04-12', nullable: true })
  dateOfBirth!: string | null;

  @ApiProperty({ example: 'M', nullable: true })
  sex!: string | null;

  @ApiProperty({ example: 168, nullable: true })
  heightCm!: number | null;

  @ApiProperty({ example: 62.5, nullable: true })
  weightKg!: number | null;

  @ApiProperty({ example: 'Carcinoma of the sigmoid colon', nullable: true })
  admissionDiagnosis!: string | null;

  @ApiProperty({ example: 'Laparoscopic anterior resection' })
  procedureName!: string;

  @ApiProperty({ example: '48.63', nullable: true })
  procedureCode!: string | null;

  @ApiProperty({ example: 'LAPAROSCOPIC', nullable: true })
  surgicalApproach!: string | null;

  @ApiProperty({ example: true, nullable: true })
  bowelAnastomosis!: boolean | null;

  @ApiProperty({ example: '2026-07-01T08:30:00.000Z' })
  operatedAt!: Date;

  @ApiProperty({ example: 'Dr. Tran Van B', nullable: true })
  attendingSurgeon!: string | null;

  @ApiProperty({ example: 'GI-2', nullable: true })
  wardCode!: string | null;

  @ApiProperty({ example: 'B-14', nullable: true })
  bedNumber!: string | null;

  @ApiProperty({ example: 'IN_HOSPITAL', nullable: true })
  dischargeStatus!: string | null;

  @ApiProperty({ example: '+84901234567', nullable: true })
  contactPhone!: string | null;

  static from(record: SurgicalRecord): SurgicalRecordDto {
    return {
      recordId: record.recordId,
      hospitalPatientCode: record.hospitalPatientCode,
      patientName: record.patientName,
      dateOfBirth: record.dateOfBirth,
      sex: record.sex,
      heightCm: record.heightCm,
      weightKg: record.weightKg,
      admissionDiagnosis: record.admissionDiagnosis,
      procedureName: record.procedureName,
      procedureCode: record.procedureCode,
      surgicalApproach: record.surgicalApproach,
      bowelAnastomosis: record.bowelAnastomosis,
      operatedAt: record.operatedAt,
      attendingSurgeon: record.attendingSurgeon,
      wardCode: record.wardCode,
      bedNumber: record.bedNumber,
      dischargeStatus: record.dischargeStatus,
      contactPhone: record.contactPhone,
    };
  }
}

/** Envelope returned by GET /surgical-records. */
export class SurgicalRecordListDto {
  @ApiProperty({ type: [SurgicalRecordDto] })
  data!: SurgicalRecordDto[];

  @ApiProperty({ example: 25 })
  total!: number;
}
