import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrationWithOutbox1738446829252 implements MigrationInterface {
    name = 'InitialMigrationWithOutbox1738446829252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "outbox_messages" ("id" uuid NOT NULL, "metadata" jsonb NOT NULL, "occurredOn" TIMESTAMP NOT NULL, "processed" boolean NOT NULL DEFAULT false, "processedOn" TIMESTAMP, "error" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, CONSTRAINT "PK_0171348f527c64b137e4d4f5b66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "outbox_messages"`);
    }

}
