const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CommonTables1652352031096 {
    name = 'CommonTables1652352031096'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "phone" character varying NOT NULL, "password" character varying NOT NULL, "currentHashedRefreshToken" character varying, "avatar" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "connection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "socketId" character varying NOT NULL, "userId" uuid, CONSTRAINT "REL_3b35155c2968acced66fc326ae" UNIQUE ("userId"), CONSTRAINT "PK_be611ce8b8cf439091c82a334b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conversation" ("id" SERIAL NOT NULL, "user1" uuid, "user2" uuid, CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "channelId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "connection" ADD CONSTRAINT "FK_3b35155c2968acced66fc326aea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_58655a79896e1ae23173b90ee82" FOREIGN KEY ("user1") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_c8e5269cb23afd99c6763383108" FOREIGN KEY ("user2") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_c8e5269cb23afd99c6763383108"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_58655a79896e1ae23173b90ee82"`);
        await queryRunner.query(`ALTER TABLE "connection" DROP CONSTRAINT "FK_3b35155c2968acced66fc326aea"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "conversation"`);
        await queryRunner.query(`DROP TABLE "connection"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
