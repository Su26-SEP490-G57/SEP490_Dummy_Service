import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareSheetsModule } from './modules/care-sheets/care-sheets.module';
import { HealthModule } from './modules/health/health.module';
import { SurgicalRecordsModule } from './modules/surgical-records/surgical-records.module';
import { TreatmentSheetsModule } from './modules/treatment-sheets/treatment-sheets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST') ?? 'localhost',
        port: Number(config.get('DB_PORT') ?? 5432),
        username: config.get('DB_USER') ?? 'postgres',
        password: config.get('DB_PASSWORD') ?? 'postgres',
        database: config.get('DB_NAME') ?? 'SEP490_HIS',
        schema: config.get('DB_SCHEMA') ?? 'public',
        autoLoadEntities: true,
        // Dummy service: let TypeORM create/sync the table automatically so
        // there is no migration step to run before seeding.
        synchronize: true,
        logging: config.get('DB_LOGGING') === 'true',
      }),
      inject: [ConfigService],
    }),
    CareSheetsModule,
    HealthModule,
    SurgicalRecordsModule,
    TreatmentSheetsModule,
  ],
})
export class AppModule {}
