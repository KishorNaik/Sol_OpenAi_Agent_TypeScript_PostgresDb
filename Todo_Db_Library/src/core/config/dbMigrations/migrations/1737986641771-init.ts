import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1737986641771 implements MigrationInterface {
	name = 'Init1737986641771';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "to_do_entity" ("id" BIGSERIAL NOT NULL, "identifier" character varying(50) NOT NULL, "status" "public"."to_do_entity_status_enum" NOT NULL DEFAULT '0', "created_date" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modified_date" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "title" character varying(255) NOT NULL, "description" text, CONSTRAINT "PK_03a5a499425f9667b78f8d04206" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_4988f11d6114e06a52524ed241" ON "to_do_entity" ("identifier") `
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "public"."IDX_4988f11d6114e06a52524ed241"`);
		await queryRunner.query(`DROP TABLE "to_do_entity"`);
	}
}
