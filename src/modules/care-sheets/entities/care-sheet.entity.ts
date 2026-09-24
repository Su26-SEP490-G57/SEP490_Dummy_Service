import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * "Phiếu theo dõi và chăm sóc" (MS: 38/BV1) — Cấp 1 or Cấp 2-3, written by a
 * nurse. Stored in the (external) HIS; written by the capstone backend. The
 * header columns are a snapshot of the patient at writing time; every clinical
 * field lives in `content`, keyed by the form-field keys the backend defines.
 */
@Entity('care_sheets')
@Index('IDX_care_sheets_patient_code', ['patientCode', 'sheetNumber'], { unique: true })
export class CareSheet {
  @PrimaryGeneratedColumn({ name: 'sheet_id', type: 'int' })
  sheetId!: number;

  /** "Tờ số" — sequential per patient, assigned by the HIS. */
  @Column({ name: 'sheet_number', type: 'int' })
  sheetNumber!: number;

  /** 'LEVEL_1' (Cấp 1) | 'LEVEL_2_3' (Cấp 2-3) */
  @Column({ name: 'sheet_type', type: 'varchar', length: 20 })
  sheetType!: string;

  /** "Phân cấp chăm sóc" at writing time, e.g. LEVEL_2. */
  @Column({ name: 'care_level', type: 'varchar', length: 20, nullable: true })
  careLevel!: string | null;

  @Column({ name: 'patient_code', type: 'varchar', length: 64 })
  patientCode!: string;

  @Column({ name: 'patient_name', type: 'varchar', length: 255 })
  patientName!: string;

  @Column({ name: 'facility', type: 'varchar', length: 255, nullable: true })
  facility!: string | null;

  @Column({ name: 'department', type: 'varchar', length: 255, nullable: true })
  department!: string | null;

  /** "Số vào viện" */
  @Column({ name: 'admission_number', type: 'varchar', length: 64, nullable: true })
  admissionNumber!: string | null;

  @Column({ name: 'age', type: 'int', nullable: true })
  age!: number | null;

  @Column({ name: 'gender', type: 'varchar', length: 10, nullable: true })
  gender!: string | null;

  @Column({ name: 'room', type: 'varchar', length: 50, nullable: true })
  room!: string | null;

  @Column({ name: 'bed', type: 'varchar', length: 50, nullable: true })
  bed!: string | null;

  @Column({ name: 'diagnosis', type: 'text', nullable: true })
  diagnosis!: string | null;

  /** "Tiền sử dị ứng": true = có, false = chưa ghi nhận, null = không điền. */
  @Column({ name: 'has_allergy', type: 'boolean', nullable: true })
  hasAllergy!: boolean | null;

  @Column({ name: 'allergy_note', type: 'text', nullable: true })
  allergyNote!: string | null;

  /** "Ngày" + "Giờ" */
  @Column({ name: 'recorded_at', type: 'timestamptz' })
  recordedAt!: Date;

  /** Every clinical field, keyed by form-field key. */
  @Column({ name: 'content', type: 'jsonb', default: () => "'{}'" })
  content!: Record<string, string>;

  /** "Tên điều dưỡng thực hiện" */
  @Column({ name: 'nurse_name', type: 'varchar', length: 255, nullable: true })
  nurseName!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
