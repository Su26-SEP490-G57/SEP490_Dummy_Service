import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * "Phiếu theo dõi điều trị" — a doctor's treatment progress sheet, stored in
 * the (external) hospital information system. Written by the capstone backend
 * whenever a doctor issues a treatment order; the header fields are a snapshot
 * of the patient at the time the sheet was written.
 */
@Entity('treatment_sheets')
@Index('IDX_treatment_sheets_patient_code', ['patientCode', 'sheetNumber'], {
  unique: true,
})
export class TreatmentSheet {
  @PrimaryGeneratedColumn({ name: 'sheet_id', type: 'int' })
  sheetId!: number;

  /** "Tờ số" — sequential per patient, assigned by the HIS. */
  @Column({ name: 'sheet_number', type: 'int' })
  sheetNumber!: number;

  /** "Mã số người bệnh" — the capstone case id. */
  @Column({ name: 'patient_code', type: 'varchar', length: 64 })
  patientCode!: string;

  @Column({ name: 'patient_name', type: 'varchar', length: 255 })
  patientName!: string;

  /** "Cơ sở KC, CB" */
  @Column({ name: 'facility', type: 'varchar', length: 255, nullable: true })
  facility!: string | null;

  /** "Khoa" */
  @Column({ name: 'department', type: 'varchar', length: 255, nullable: true })
  department!: string | null;

  @Column({ name: 'diagnosis', type: 'text', nullable: true })
  diagnosis!: string | null;

  /** "Bệnh kèm theo" */
  @Column({ name: 'comorbidities', type: 'text', nullable: true })
  comorbidities!: string | null;

  @Column({ name: 'age', type: 'int', nullable: true })
  age!: number | null;

  @Column({ name: 'gender', type: 'varchar', length: 10, nullable: true })
  gender!: string | null;

  @Column({ name: 'room', type: 'varchar', length: 50, nullable: true })
  room!: string | null;

  @Column({ name: 'bed', type: 'varchar', length: 50, nullable: true })
  bed!: string | null;

  /** "Thời gian" — when the doctor examined the patient. */
  @Column({ name: 'recorded_at', type: 'timestamptz' })
  recordedAt!: Date;

  /** "Diễn biến bệnh" */
  @Column({ name: 'progress_notes', type: 'text' })
  progressNotes!: string;

  /** "Chỉ định" */
  @Column({ name: 'orders', type: 'text' })
  orders!: string;

  /** Care level ordered alongside the sheet, e.g. LEVEL_2. */
  @Column({ name: 'care_level', type: 'varchar', length: 20, nullable: true })
  careLevel!: string | null;

  @Column({ name: 'doctor_name', type: 'varchar', length: 255, nullable: true })
  doctorName!: string | null;

  /** Treatment order id in the capstone backend that produced this sheet. */
  @Column({ name: 'external_order_id', type: 'int', nullable: true })
  externalOrderId!: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
