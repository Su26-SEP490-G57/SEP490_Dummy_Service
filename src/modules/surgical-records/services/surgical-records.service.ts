import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { SurgicalRecord } from '../entities/surgical-record.entity';

@Injectable()
export class SurgicalRecordsService {
  constructor(
    @InjectRepository(SurgicalRecord)
    private readonly repo: Repository<SurgicalRecord>,
  ) {}

  /**
   * All patients that have undergone surgery, i.e. every record that has an
   * `operated_at` timestamp. Ordered most-recent operation first.
   */
  async findAllOperated(): Promise<SurgicalRecord[]> {
    return this.repo.find({
      where: { operatedAt: Not(IsNull()) },
      order: { operatedAt: 'DESC' },
    });
  }
}
