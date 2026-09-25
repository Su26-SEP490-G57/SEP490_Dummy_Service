import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

/**
 * A surgical patient record as stored in the (external) hospital information
 * system. Field names intentionally differ from the capstone `patient_cases`
 * schema to simulate an external data source that must be mapped/transformed
 * when imported.
 */
@Entity('surgical_records')
export class SurgicalRecord {
  /** External record identifier (the HIS primary key). */
  @PrimaryColumn({ name: 'record_id', type: 'varchar', length: 36 })
  recordId!: string;

  /** Hospital-issued patient code, e.g. "HIS-000123". */
  @Column({ name: 'hospital_patient_code', type: 'varchar', length: 32 })
  hospitalPatientCode!: string;

  /** Masked patient name / initials, e.g. "N.V.A". */
  @Column({ name: 'patient_name', type: 'varchar', length: 100 })
  patientName!: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth!: string | null;

  /** Biological sex as recorded by the HIS: 'M' | 'F' | 'O'. */
  @Column({ name: 'sex', type: 'varchar', length: 1, nullable: true })
  sex!: string | null;

  @Column({ name: 'height_cm', type: 'float', nullable: true })
  heightCm!: number | null;

  @Column({ name: 'weight_kg', type: 'float', nullable: true })
  weightKg!: number | null;

  @Column({ name: 'admission_diagnosis', type: 'text', nullable: true })
  admissionDiagnosis!: string | null;

  /** Free-text procedure name, e.g. "Laparoscopic right hemicolectomy". */
  @Column({ name: 'procedure_name', type: 'varchar', length: 200 })
  procedureName!: string;

  /** ICD-9-CM-style procedure code, e.g. "17.33". */
  @Column({
    name: 'procedure_code',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  procedureCode!: string | null;

  /** Surgical approach: 'OPEN' | 'LAPAROSCOPIC' | 'ROBOTIC'. */
  @Column({
    name: 'surgical_approach',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  surgicalApproach!: string | null;

  /** Whether a gastrointestinal anastomosis was performed. */
  @Column({ name: 'bowel_anastomosis', type: 'boolean', nullable: true })
  bowelAnastomosis!: boolean | null;

  /** Date/time the operation was performed. */
  @Column({ name: 'operated_at', type: 'timestamp' })
  operatedAt!: Date;

  @Column({
    name: 'attending_surgeon',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  attendingSurgeon!: string | null;

  @Column({ name: 'ward_code', type: 'varchar', length: 20, nullable: true })
  wardCode!: string | null;

  @Column({ name: 'bed_number', type: 'varchar', length: 20, nullable: true })
  bedNumber!: string | null;

  /** Discharge status: 'IN_HOSPITAL' | 'DISCHARGED' | 'TRANSFERRED'. */
  @Column({
    name: 'discharge_status',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  dischargeStatus!: string | null;

  @Column({
    name: 'contact_phone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  contactPhone!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
