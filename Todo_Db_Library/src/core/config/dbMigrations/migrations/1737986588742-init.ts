import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1737986588742 implements MigrationInterface {
	name = 'Init1737986588742';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "to_do_entity" ADD "identifier" character varying(50) NOT NULL`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."to_do_entity_status_enum" AS ENUM('1', '0')`
		);
		await queryRunner.query(
			`ALTER TABLE "to_do_entity" ADD "status" "public"."to_do_entity_status_enum" NOT NULL DEFAULT '0'`
		);
		await queryRunner.query(
			`ALTER TABLE "to_do_entity" ADD "created_date" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`
		);
		await queryRunner.query(
			`ALTER TABLE "to_do_entity" ADD "modified_date" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`
		);
		await queryRunner.query(
			`ALTER TABLE "to_do_entity" DROP CONSTRAINT "PK_03a5a499425f9667b78f8d04206"`
		);
		await queryRunner.query(`ALTER TABLE "to_do_entity" DROP COLUMN "id"`);
		await queryRunner.query(`ALTER TABLE "to_do_entity" ADD "id" BIGSERIAL NOT NULL`);
		await queryRunner.query(
			`ALTER TABLE "to_do_entity" ADD CONSTRAINT "PK_03a5a499425f9667b78f8d04206" PRIMARY KEY ("id")`
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_4988f11d6114e06a52524ed241" ON "to_do_entity" ("identifier") `
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "public"."IDX_4988f11d6114e06a52524ed241"`);
		await queryRunner.query(
			`ALTER TABLE "to_do_entity" DROP CONSTRAINT "PK_03a5a499425f9667b78f8d04206"`
		);
		await queryRunner.query(`ALTER TABLE "to_do_entity" DROP COLUMN "id"`);
		await queryRunner.query(`ALTER TABLE "to_do_entity" ADD "id" SERIAL NOT NULL`);
		await queryRunner.query(
			`ALTER TABLE "to_do_entity" ADD CONSTRAINT "PK_03a5a499425f9667b78f8d04206" PRIMARY KEY ("id")`
		);
		await queryRunner.query(`ALTER TABLE "to_do_entity" DROP COLUMN "modified_date"`);
		await queryRunner.query(`ALTER TABLE "to_do_entity" DROP COLUMN "created_date"`);
		await queryRunner.query(`ALTER TABLE "to_do_entity" DROP COLUMN "status"`);
		await queryRunner.query(`DROP TYPE "public"."to_do_entity_status_enum"`);
		await queryRunner.query(`ALTER TABLE "to_do_entity" DROP COLUMN "identifier"`);
	}
}
