import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailToMechanic1764439300000 implements MigrationInterface {
    name = 'AddEmailToMechanic1764439300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add email column to mechanic table
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'mechanic' AND column_name = 'email'
                ) THEN
                    ALTER TABLE "mechanic" ADD "email" character varying(100);
                    CREATE UNIQUE INDEX IF NOT EXISTS "IDX_mechanic_email" ON "mechanic" ("email") WHERE "email" IS NOT NULL;
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_mechanic_email"`);
        await queryRunner.query(`ALTER TABLE "mechanic" DROP COLUMN IF EXISTS "email"`);
    }
}
