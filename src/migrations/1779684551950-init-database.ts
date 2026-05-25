import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1779684551950 implements MigrationInterface {
  name = 'InitDatabase1779684551950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ai" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_ae9dd2406873944373f167a22f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "writings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "title" character varying(255) NOT NULL, "content" text NOT NULL, "type" character varying(100) NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'draft', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_113656b435cadec969451db31b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(255) NOT NULL, "email" character varying(255), "password" character varying(255), "full_name" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "analysis" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "writing_id" uuid NOT NULL, "user_id" uuid NOT NULL, "feedback_json" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_300795d51c57ef52911ed65851f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "writings" ADD CONSTRAINT "fk_writing_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "analysis" ADD CONSTRAINT "fk_analysis_writing_id" FOREIGN KEY ("writing_id") REFERENCES "writings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "analysis" ADD CONSTRAINT "fk_analysis_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "analysis" DROP CONSTRAINT "fk_analysis_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "analysis" DROP CONSTRAINT "fk_analysis_writing_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "writings" DROP CONSTRAINT "fk_writing_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "analysis"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "writings"`);
    await queryRunner.query(`DROP TABLE "ai"`);
  }
}
