import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1737985979443 implements MigrationInterface {
	name = 'Init1737985979443';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "to_do_entity" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" text, CONSTRAINT "PK_03a5a499425f9667b78f8d04206" PRIMARY KEY ("id"))`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "to_do_entity"`);
	}
}
