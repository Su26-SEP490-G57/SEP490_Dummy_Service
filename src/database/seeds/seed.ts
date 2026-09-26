import 'dotenv/config';
import dataSource from '../../data-source';
import { SurgicalRecord } from '../../modules/surgical-records/entities/surgical-record.entity';

/**
 * Seeds the dummy HIS with ~25 surgical patient records (colorectal / GI
 * surgery, matching the capstone ERAS/POD context). Idempotent: it clears the
 * table and reinserts, so it can be re-run safely.
 *
 * Run with:  npm run build && npm run seed   (runs dist/database/seeds/seed.js)
 */

const PROCEDURES: Array<{
  name: string;
  code: string;
  approach: 'OPEN' | 'LAPAROSCOPIC' | 'ROBOTIC';
  anastomosis: boolean;
}> = [
  {
    name: 'Laparoscopic right hemicolectomy',
    code: '17.33',
    approach: 'LAPAROSCOPIC',
    anastomosis: true,
  },
  {
    name: 'Open anterior resection of rectum',
    code: '48.63',
    approach: 'OPEN',
    anastomosis: true,
  },
  {
    name: 'Laparoscopic sigmoidectomy',
    code: '17.36',
    approach: 'LAPAROSCOPIC',
    anastomosis: true,
  },
  {
    name: 'Low anterior resection',
    code: '48.62',
    approach: 'OPEN',
    anastomosis: true,
  },
  {
    name: 'Abdominoperineal resection',
    code: '48.5',
    approach: 'OPEN',
    anastomosis: false,
  },
  {
    name: 'Laparoscopic left hemicolectomy',
    code: '17.35',
    approach: 'LAPAROSCOPIC',
    anastomosis: true,
  },
  {
    name: 'Total colectomy with ileostomy',
    code: '45.8',
    approach: 'OPEN',
    anastomosis: false,
  },
  {
    name: 'Robotic low anterior resection',
    code: '48.62',
    approach: 'ROBOTIC',
    anastomosis: true,
  },
  {
    name: 'Laparoscopic appendectomy',
    code: '47.01',
    approach: 'LAPAROSCOPIC',
    anastomosis: false,
  },
  {
    name: 'Hartmann procedure',
    code: '48.69',
    approach: 'OPEN',
    anastomosis: false,
  },
];

const DIAGNOSES = [
  'Carcinoma of the sigmoid colon',
  'Adenocarcinoma of the rectum',
  'Carcinoma of the ascending colon',
  'Rectosigmoid junction tumor',
  'Descending colon carcinoma',
  'Complicated diverticulitis',
  'Obstructing colorectal mass',
  'Caecal adenocarcinoma',
];

const SURGEONS = [
  'Dr. Tran Van B',
  'Dr. Nguyen Thi C',
  'Dr. Le Hoang D',
  'Dr. Pham Minh E',
  'Dr. Vo Thanh F',
];

const WARDS = ['GI-1', 'GI-2', 'GI-3', 'SURG-A'];
const DISCHARGE = ['IN_HOSPITAL', 'IN_HOSPITAL', 'DISCHARGED', 'TRANSFERRED'];
const SEX = ['M', 'F'];

/** Masked initials pool. */
const INITIALS = [
  'N.V.A',
  'T.T.B',
  'L.H.C',
  'P.M.D',
  'V.T.E',
  'H.N.F',
  'D.Q.G',
  'B.T.H',
  'C.V.I',
  'M.T.K',
  'N.H.L',
  'T.V.M',
  'L.T.N',
  'P.H.O',
  'V.M.P',
  'H.T.Q',
  'D.V.R',
  'B.N.S',
  'C.T.T',
  'M.V.U',
  'N.T.V',
  'T.H.X',
  'L.V.Y',
  'P.T.Z',
  'V.H.A',
  'H.M.B',
];

const RECORD_COUNT = 25;

/** 2-digit zero-padded helper. */
function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function buildRecords(): SurgicalRecord[] {
  const records: SurgicalRecord[] = [];

  for (let i = 0; i < RECORD_COUNT; i++) {
    const proc = PROCEDURES[i % PROCEDURES.length];
    const sex = SEX[i % SEX.length];

    // Deterministic dates (no reliance on the current clock).
    const birthYear = 1948 + ((i * 7) % 50); // roughly 1948..1997
    const birthMonth = pad(1 + (i % 12));
    const birthDay = pad(1 + (i % 27));

    // Operations spread across June–July 2026.
    const opMonth = i % 2 === 0 ? '06' : '07';
    const opDay = pad(1 + (i % 27));
    const opHour = pad(7 + (i % 8)); // 07:00..14:00

    records.push({
      recordId: `HIS-REC-${pad(i + 1)}`,
      hospitalPatientCode: `HIS-${String(100000 + i * 137).padStart(6, '0')}`,
      patientName: INITIALS[i % INITIALS.length],
      dateOfBirth: `${birthYear}-${birthMonth}-${birthDay}`,
      sex,
      heightCm: 150 + ((i * 3) % 35), // 150..184
      weightKg: Math.round((48 + ((i * 5) % 42)) * 10) / 10, // 48..89
      admissionDiagnosis: DIAGNOSES[i % DIAGNOSES.length],
      procedureName: proc.name,
      procedureCode: proc.code,
      surgicalApproach: proc.approach,
      bowelAnastomosis: proc.anastomosis,
      operatedAt: new Date(`2026-${opMonth}-${opDay}T${opHour}:30:00.000Z`),
      attendingSurgeon: SURGEONS[i % SURGEONS.length],
      wardCode: WARDS[i % WARDS.length],
      bedNumber: `${WARDS[i % WARDS.length].split('-')[1] ?? 'A'}-${pad(1 + (i % 20))}`,
      dischargeStatus: DISCHARGE[i % DISCHARGE.length],
      contactPhone: `+8490${String(1000000 + i * 13337).padStart(7, '0')}`,
      createdAt: new Date(`2026-${opMonth}-${opDay}T${opHour}:45:00.000Z`),
    });
  }

  return records;
}

async function run() {
  await dataSource.initialize();
  const records = buildRecords();

  // Idempotent reseed: truncate then insert, atomically, so a failed insert
  // never leaves the table empty.
  await dataSource.transaction(async (manager) => {
    const { schema, tableName } =
      manager.getRepository(SurgicalRecord).metadata;
    const table = schema ? `"${schema}"."${tableName}"` : `"${tableName}"`;
    await manager.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    await manager.insert(SurgicalRecord, records);
  });

  // eslint-disable-next-line no-console
  console.log(
    `Seeded ${records.length} surgical records into ${process.env.DB_NAME}.`,
  );
  await dataSource.destroy();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Seeding failed:', err);
  process.exit(1);
});
