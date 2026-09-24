import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateTreatmentSheetDto } from '../dtos/treatment-sheet.dto';
import { TreatmentSheet } from '../entities/treatment-sheet.entity';

@Injectable()
export class TreatmentSheetsService {
  constructor(
    @InjectRepository(TreatmentSheet)
    private readonly repo: Repository<TreatmentSheet>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /** Sheets of one patient, newest first. */
  findByPatientCode(patientCode: string): Promise<TreatmentSheet[]> {
    return this.repo.find({
      where: { patientCode },
      order: { sheetNumber: 'DESC' },
    });
  }

  async nextSheetNumber(patientCode: string): Promise<number> {
    const row = await this.repo
      .createQueryBuilder('s')
      .select('COALESCE(MAX(s.sheet_number), 0)', 'max')
      .where('s.patient_code = :patientCode', { patientCode })
      .getRawOne<{ max: string | number }>();
    return Number(row?.max ?? 0) + 1;
  }

  /**
   * Store a new sheet. The number is assigned here, under a per-patient
   * advisory lock, so two concurrent writes never get the same "Tờ số".
   */
  create(dto: CreateTreatmentSheetDto): Promise<TreatmentSheet> {
    return this.dataSource.transaction(async (manager) => {
      await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [dto.patientCode]);
      const row = await manager
        .getRepository(TreatmentSheet)
        .createQueryBuilder('s')
        .select('COALESCE(MAX(s.sheet_number), 0)', 'max')
        .where('s.patient_code = :patientCode', { patientCode: dto.patientCode })
        .getRawOne<{ max: string | number }>();

      return manager.getRepository(TreatmentSheet).save({
        ...dto,
        sheetNumber: Number(row?.max ?? 0) + 1,
        facility: dto.facility ?? null,
        department: dto.department ?? null,
        diagnosis: dto.diagnosis ?? null,
        comorbidities: dto.comorbidities ?? null,
        age: dto.age ?? null,
        gender: dto.gender ?? null,
        room: dto.room ?? null,
        bed: dto.bed ?? null,
        careLevel: dto.careLevel ?? null,
        doctorName: dto.doctorName ?? null,
        externalOrderId: dto.externalOrderId ?? null,
      });
    });
  }
}
