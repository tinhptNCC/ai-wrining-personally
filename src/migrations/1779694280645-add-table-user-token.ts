import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableUserToken1779694280645 implements MigrationInterface {
  name = 'AddTableUserToken1779694280645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_token_usage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "date" date NOT NULL, "tokens_used" integer NOT NULL DEFAULT '0', "tokens_limit" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_75bb27cb42326a54353beaed08d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_44e4969824548043497ead3196" ON "user_token_usage"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b420ec3e493c7e1f786a6f9da5" ON "user_token_usage"  ("user_id", "date") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_token_usage" ADD CONSTRAINT "FK_44e4969824548043497ead3196f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_token_usage" DROP CONSTRAINT "FK_44e4969824548043497ead3196f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b420ec3e493c7e1f786a6f9da5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_44e4969824548043497ead3196"`,
    );
    await queryRunner.query(`DROP TABLE "user_token_usage"`);
  }
}
