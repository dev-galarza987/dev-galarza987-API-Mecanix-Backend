import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordAndTypeToMechanicManual1764435200000 implements MigrationInterface {
    name = 'AddPasswordAndTypeToMechanicManual1764435200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add password column if it doesn't exist
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'mechanic' AND column_name = 'password'
                ) THEN
                    ALTER TABLE "mechanic" ADD "password" character varying(255);
                END IF;
            END $$;
        `);

        // Create enum type for UserRole if it doesn't exist
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mechanic_type_enum') THEN
                    CREATE TYPE "mechanic_type_enum" AS ENUM('admin', 'client', 'mechanic');
                END IF;
            END $$;
        `);

        // Add type column if it doesn't exist
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'mechanic' AND column_name = 'type'
                ) THEN
                    ALTER TABLE "mechanic" ADD "type" "mechanic_type_enum" NOT NULL DEFAULT 'mechanic';
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mechanic" DROP COLUMN IF EXISTS "type"`);
        await queryRunner.query(`ALTER TABLE "mechanic" DROP COLUMN IF EXISTS "password"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "mechanic_type_enum"`);
    }
}
