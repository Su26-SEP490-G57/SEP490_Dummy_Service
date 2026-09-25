import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateCareSheetDto } from '../dtos/care-sheet.dto';
import { CareSheet } from '../entities/care-sheet.entity';

@Injectable()
export class CareSheetsService {
  constructor(
    @InjectRepository(CareSheet)
    private readonly repo: Repository<CareSheet>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /** Sheets of one patient, newest first. */
  findByPatientCode(patientCode: string): Promise<CareSheet[]> {
    return this.repo.find({
      where: { patientCode },
      order: { sheetNumber: 'DESC' },
    });
  }

  async nextSheetNumber(
    patientCode: string,
    manager?: EntityManager,
  ): Promise<number> {
    const row = await (manager?.getRepository(CareSheet) ?? this.repo)
      .createQueryBuilder('s')
      .select('COALESCE(MAX(s.sheet_number), 0)', 'max')
      .where('s.patient_code = :patientCode', { patientCode })
      .getRawOne<{ max: string | number }>();
    return Number(row?.max ?? 0) + 1;
  }

  /**
   * Store a new sheet. The number is assigned under a per-patient advisory
   * lock so two concurrent writes never get the same "Tờ số".
   */
  create(dto: CreateCareSheetDto): Promise<CareSheet> {
    return this.dataSource.transaction(async (manager) => {
      await manager.query(
        "SELECT pg_advisory_xact_lock(hashtext('care:' || $1))",
        [dto.patientCode],
      );
      const sheetNumber = await this.nextSheetNumber(dto.patientCode, manager);

      return manager.getRepository(CareSheet).save({
        ...dto,
        sheetNumber,
        careLevel: dto.careLevel ?? null,
        facility: dto.facility ?? null,
        department: dto.department ?? null,
        admissionNumber: dto.admissionNumber ?? null,
        age: dto.age ?? null,
        gender: dto.gender ?? null,
        room: dto.room ?? null,
        bed: dto.bed ?? null,
        diagnosis: dto.diagnosis ?? null,
        hasAllergy: dto.hasAllergy ?? null,
        allergyNote: dto.allergyNote ?? null,
        nurseName: dto.nurseName ?? null,
      });
    });
  }
}
