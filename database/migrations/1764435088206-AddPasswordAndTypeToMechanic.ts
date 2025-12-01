import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordAndTypeToMechanic1764435088206 implements MigrationInterface {
    name = 'AddPasswordAndTypeToMechanic1764435088206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mechanic" ADD "password" character varying(255)`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."client_nit_ci" IS 'NIT o CI del cliente para facturación (7-10 dígitos)'`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."client_name" IS 'Nombre completo del cliente para facturación'`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."client_email" IS 'Email del cliente para envío de factura'`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."subtotal" IS 'Subtotal antes de impuestos'`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."tax_amount" IS 'Monto de IVA (13%)'`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."total_cost" IS 'Total a pagar (subtotal + IVA)'`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."payment_method" IS 'Método de pago utilizado'`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."invoice_number" IS 'Número de factura generado por Factus'`);
        await queryRunner.query(`COMMENT ON COLUMN "client_vehicle"."is_primary" IS 'Indica si este es el vehículo principal del cliente'`);
        await queryRunner.query(`COMMENT ON COLUMN "client_vehicle"."notes" IS 'Notas adicionales sobre esta relación cliente-vehículo'`);
        await queryRunner.query(`COMMENT ON COLUMN "client_vehicle"."is_active" IS 'Indica si el cliente aún posee este vehículo'`);
        await queryRunner.query(`COMMENT ON COLUMN "client_vehicle"."added_date" IS 'Fecha en que se agregó este vehículo al cliente'`);
        await queryRunner.query(`CREATE INDEX "IDX_b6fa7b9b5629e562f684920393" ON "reservate_service" ("reservate_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_21a7f5bbf48b55c10c124ef3ec" ON "reservate_service" ("service_id") `);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_8ea603efaa141c2db7cfa0dc21e" FOREIGN KEY ("reservate_id") REFERENCES "reservate"("reservate_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_74ef9e828c4d521e413a5230682" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("vehicle_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_bc017795cac211f37b47afa6dab" FOREIGN KEY ("mechanic_id") REFERENCES "mechanic"("mechanic_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mechanic_services" ADD CONSTRAINT "FK_8e253505ac6e35770253dd216bd" FOREIGN KEY ("mechanic_id") REFERENCES "mechanic"("mechanic_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mechanic_services" ADD CONSTRAINT "FK_3c2eff14f521f952cf741d00c42" FOREIGN KEY ("service_id") REFERENCES "service"("service_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reservate_service" ADD CONSTRAINT "FK_b6fa7b9b5629e562f684920393f" FOREIGN KEY ("reservate_id") REFERENCES "reservate"("reservate_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reservate_service" ADD CONSTRAINT "FK_21a7f5bbf48b55c10c124ef3ec6" FOREIGN KEY ("service_id") REFERENCES "service"("service_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservate_service" DROP CONSTRAINT "FK_21a7f5bbf48b55c10c124ef3ec6"`);
        await queryRunner.query(`ALTER TABLE "reservate_service" DROP CONSTRAINT "FK_b6fa7b9b5629e562f684920393f"`);
        await queryRunner.query(`ALTER TABLE "mechanic_services" DROP CONSTRAINT "FK_3c2eff14f521f952cf741d00c42"`);
        await queryRunner.query(`ALTER TABLE "mechanic_services" DROP CONSTRAINT "FK_8e253505ac6e35770253dd216bd"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_bc017795cac211f37b47afa6dab"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_74ef9e828c4d521e413a5230682"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_8ea603efaa141c2db7cfa0dc21e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_21a7f5bbf48b55c10c124ef3ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b6fa7b9b5629e562f684920393"`);
        await queryRunner.query(`COMMENT ON COLUMN "client_vehicle"."added_date" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "client_vehicle"."is_active" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "client_vehicle"."notes" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "client_vehicle"."is_primary" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."invoice_number" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."payment_method" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."total_cost" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."tax_amount" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."subtotal" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."client_email" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."client_name" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."client_nit_ci" IS NULL`);
        await queryRunner.query(`ALTER TABLE "mechanic" DROP COLUMN "password"`);
    }

}
