# Dummy HIS Service

A standalone **dummy external Hospital Information System (HIS)** for the capstone
project (SEP490-305).

In the patient-management flow, patient records are no longer entered by hand —
they are pulled from an external system. This service **simulates that external
system**: it owns its own PostgreSQL database of surgical patient records and
exposes them over HTTP. The capstone backend calls it to source patients that
have undergone surgery.

```
┌────────────────────┐   GET /patients/external-records   ┌────────────────────┐   GET /surgical-records   ┌────────────────────┐
│  Frontend / Admin  │ ─────────────────────────────────► │  capstone-backend  │ ────────────────────────► │  dummy-his-service │
│                    │                                    │  (JWT protected)   │        (HTTP)             │   this service     │
└────────────────────┘                                    └────────────────────┘                          └─────────┬──────────┘
                                                                                                                     │
                                                                                                          ┌──────────▼──────────┐
                                                                                                          │  Postgres SEP490_HIS │
                                                                                                          │  surgical_records    │
                                                                                                          └─────────────────────┘
```

- **Stack:** NestJS 11 + TypeORM + PostgreSQL
- **Default port:** `4000`
- **Database:** `SEP490_HIS` (separate from the backend's `SEP490_G57`)
- **Swagger UI:** http://localhost:4000/api

---

## Prerequisites

- Node.js 18+ (uses global `fetch` on the backend side; this service just needs a modern Node)
- PostgreSQL 14+ running and reachable

---

## Setup

```bash
# 1. install dependencies
npm install

# 2. create the database (once)
createdb SEP490_HIS
#   or:  psql -U postgres -c 'CREATE DATABASE "SEP490_HIS";'
#   or, if you use the capstone-backend docker Postgres:
#        docker exec capstone-postgres createdb -U postgres SEP490_HIS

# 3. configure environment
cp .env.example .env          # then edit DB credentials if needed

# 4. seed ~25 surgical records (the table auto-creates via TypeORM synchronize)
npm run seed

# 5. run
npm run start:dev             # watch mode
```

The service prints `Dummy HIS service listening on http://localhost:4000` once up.

### Environment variables (`.env`)

| Variable      | Default      | Description                                  |
| ------------- | ------------ | -------------------------------------------- |
| `DB_HOST`     | `localhost`  | Postgres host                                |
| `DB_PORT`     | `5432`       | Postgres port                                |
| `DB_USER`     | `postgres`   | Postgres user                                |
| `DB_PASSWORD` | `postgres`   | Postgres password                            |
| `DB_NAME`     | `SEP490_HIS` | Database name                                |
| `DB_SCHEMA`   | `public`     | Schema                                       |
| `DB_LOGGING`  | `false`      | Set `true` to log SQL                        |
| `PORT`        | `4000`       | HTTP port the service listens on             |

> **Note:** `synchronize: true` is enabled — the `surgical_records` table is
> created/updated automatically on boot. This is intentional for a dummy
> service so there is no migration step to run. Do **not** copy this setting to
> the real backend.

---

## Endpoint

| Method | Path                | Description                                                |
| ------ | ------------------- | ---------------------------------------------------------- |
| `GET`  | `/surgical-records` | All patients that have undergone surgery (with `total`).   |

"Undergone surgery" = every record that has an `operated_at` timestamp, ordered
most-recent operation first.

### Example

```bash
curl http://localhost:4000/surgical-records
```

```json
{
  "data": [
    {
      "recordId": "HIS-REC-01",
      "hospitalPatientCode": "HIS-100000",
      "patientName": "N.V.A",
      "dateOfBirth": "1948-01-01",
      "sex": "M",
      "heightCm": 150,
      "weightKg": 48,
      "admissionDiagnosis": "Carcinoma of the sigmoid colon",
      "procedureName": "Laparoscopic right hemicolectomy",
      "procedureCode": "17.33",
      "surgicalApproach": "LAPAROSCOPIC",
      "bowelAnastomosis": true,
      "operatedAt": "2026-06-01T07:30:00.000Z",
      "attendingSurgeon": "Dr. Tran Van B",
      "wardCode": "GI-1",
      "bedNumber": "1-01",
      "dischargeStatus": "IN_HOSPITAL",
      "contactPhone": "+84901000000"
    }
  ],
  "total": 25
}
```

---

## Data model (`surgical_records`)

Field names **intentionally differ** from the capstone `patient_cases` schema to
simulate an external source whose data must be mapped/transformed on import.

| Column (`surgical_records`) | Type      | Notes                                          | Maps to `patient_cases`        |
| --------------------------- | --------- | ---------------------------------------------- | ------------------------------ |
| `record_id`                 | varchar   | HIS primary key, e.g. `HIS-REC-01`             | —                              |
| `hospital_patient_code`     | varchar   | Hospital-issued code, e.g. `HIS-100000`        | (external ref)                 |
| `patient_name`              | varchar   | Masked initials, e.g. `N.V.A`                  | `name_initials`                |
| `date_of_birth`             | date      | ISO date                                       | → derive `age`                 |
| `sex`                       | varchar   | `M` / `F` / `O`                                | → `gender`                     |
| `height_cm`                 | float     |                                                | `height`                       |
| `weight_kg`                 | float     |                                                | `weight` (→ derive `bmi`)      |
| `admission_diagnosis`       | text      |                                                | `diagnosis`                    |
| `procedure_name`            | varchar   | e.g. `Laparoscopic anterior resection`         | → `operation_type` / `method`  |
| `procedure_code`            | varchar   | ICD-9-CM-style, e.g. `48.63`                   | → `operation_type`             |
| `surgical_approach`         | varchar   | `OPEN` / `LAPAROSCOPIC` / `ROBOTIC`            | `method`                       |
| `bowel_anastomosis`         | boolean   | GI anastomosis performed?                      | `has_gi_anastomosis`           |
| `operated_at`               | timestamp | Operation date/time                            | `surgery_date`                 |
| `attending_surgeon`         | varchar   |                                                | —                              |
| `ward_code`                 | varchar   | e.g. `GI-2`                                    | → `room_bed`                   |
| `bed_number`                | varchar   | e.g. `B-14`                                    | → `room_bed`                   |
| `discharge_status`          | varchar   | `IN_HOSPITAL` / `DISCHARGED` / `TRANSFERRED`   | —                              |
| `contact_phone`             | varchar   |                                                | `guardian_phone`               |
| `created_at`                | timestamp | Row creation time                              | —                              |

> The mapping column is a guide for the future import step — this service only
> **serves** the records; the backend decides how to map them.

---

## Scripts

| Command             | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `npm run start`     | Start the service                                    |
| `npm run start:dev` | Start in watch mode                                  |
| `npm run start:prod`| Run the compiled build (`dist/main`)                 |
| `npm run build`     | Compile to `dist/`                                   |
| `npm run seed`      | Clear and reseed ~25 surgical records (idempotent)   |
| `npm run format`    | Prettier over `src/`                                 |

---

## How the capstone backend consumes this service

- The backend (branch `SEP490-305`) reads `HIS_SERVICE_URL` (default
  `http://localhost:4000`) and calls `GET /surgical-records`.
- It exposes `GET /patients/external-records` (JWT-protected) which fetches and
  returns this list. If this service is unreachable, the backend responds
  `502 Bad Gateway`.

To run the full flow locally: start Postgres → seed this service → run this
service on `:4000` → run the backend on `:3000`.

---

## Troubleshooting

- **`ECONNREFUSED` / seed fails** — Postgres isn't running or credentials in
  `.env` are wrong. Check `pg_isready` and that `SEP490_HIS` exists.
- **`database "SEP490_HIS" does not exist`** — run the `createdb` step above.
- **Backend returns 502** — this service isn't running, or `HIS_SERVICE_URL` on
  the backend doesn't point at `http://localhost:4000`.
- **Empty `data`** — you haven't seeded yet; run `npm run seed`.

---

## Project structure

```
dummy-his-service/
├── src/
│   ├── main.ts                     # bootstrap, CORS, Swagger, port 4000
│   ├── app.module.ts               # TypeORM (synchronize) + SurgicalRecordsModule
│   ├── data-source.ts              # DataSource used by the seed script
│   ├── database/seeds/seed.ts      # ~25 idempotent sample records
│   └── modules/surgical-records/
│       ├── surgical-records.module.ts
│       ├── controllers/            # GET /surgical-records
│       ├── services/               # query: records with operated_at
│       ├── entities/               # surgical_records entity
│       └── dtos/                   # response DTOs
├── .env.example
└── README.md
```
