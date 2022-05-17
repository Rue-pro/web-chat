-- Adminer 4.8.1 PostgreSQL 14.2 (Debian 14.2-1.pgdg110+1) dump

\connect "d2cpmlfrhcraju";

CREATE TABLE "public"."connection" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "socketId" character varying NOT NULL,
    "userId" uuid,
    CONSTRAINT "PK_be611ce8b8cf439091c82a334b2" PRIMARY KEY ("id"),
    CONSTRAINT "REL_3b35155c2968acced66fc326ae" UNIQUE ("userId")
) WITH (oids = false);


CREATE SEQUENCE conversation_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."conversation" (
    "id" integer DEFAULT nextval('conversation_id_seq') NOT NULL,
    "user1" uuid,
    "user2" uuid,
    CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE message_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."message" (
    "id" integer DEFAULT nextval('message_id_seq') NOT NULL,
    "content" character varying NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "authorId" uuid,
    "channelId" integer,
    CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE migration_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."migration" (
    "id" integer DEFAULT nextval('migration_id_seq') NOT NULL,
    "timestamp" bigint NOT NULL,
    "name" character varying NOT NULL,
    CONSTRAINT "PK_3043fc6b8af7c99b8b98830094f" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "migration" ("id", "timestamp", "name") VALUES
(1,	1652352031096,	'CommonTables1652352031096');

CREATE TABLE "public"."typeorm_metadata" (
    "type" character varying NOT NULL,
    "database" character varying,
    "schema" character varying,
    "table" character varying,
    "name" character varying,
    "value" text
) WITH (oids = false);


CREATE TABLE "public"."user" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "name" character varying NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL,
    "email" character varying NOT NULL,
    "phone" character varying NOT NULL,
    "password" character varying NOT NULL,
    "currentHashedRefreshToken" character varying,
    "avatar" character varying,
    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"),
    CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
) WITH (oids = false);

INSERT INTO "user" ("id", "name", "createdAt", "updatedAt", "email", "phone", "password", "currentHashedRefreshToken", "avatar") VALUES
('7147be27-4eed-4865-a97f-e13a71f087fb',	'Trever Wyman',	'2022-05-13 12:29:03.8',	'2022-05-13 12:29:03.8',	'Armani60@hotmail.com',	'037.240.1074 x0322',	'$2b$10$e0T3HVQ6FKmUofr1LU3fM.llpa0YXxGPQ1E.t79lTujMkGmeLLgsi',	NULL,	NULL),
('aeec03e6-6740-4a84-a909-281489ab68f4',	'Shaina Ziemann',	'2022-05-13 12:29:03.861',	'2022-05-13 12:29:03.861',	'Aisha_Hickle63@hotmail.com',	'765-536-0278 x60414',	'$2b$10$PVxpiAT0RKgNAJuOxMyzi.IB/DHbEHUAZ6L159gOCUJUrYenz4pae',	NULL,	'https://s3.amazonaws.com/uifaces/faces/twitter/quailandquasar/128.jpg'),
('74af4054-4575-4dca-8716-9c3d7445905b',	'Chesley Stoltenberg',	'2022-05-13 12:29:03.919',	'2022-05-13 12:29:03.919',	'Alan_Shields17@hotmail.com',	'942-824-4792 x78268',	'$2b$10$iFTcrJtqsHa4A5tXajD/j.QYrvRvCXB7jawIelpvFCBV3lfgzs5h6',	NULL,	NULL),
('ead2361e-9959-47e8-a7ad-58da28ad646d',	'Cloyd Kohler',	'2022-05-13 12:29:03.978',	'2022-05-13 12:29:03.978',	'Savion_Gutmann16@gmail.com',	'1-312-174-4077',	'$2b$10$JJAvnnzj/8uo/8pypxFQTuWRXnCEsp1UOr9fDsvR7HBVwxzT4L4la',	NULL,	'https://s3.amazonaws.com/uifaces/faces/twitter/joshaustin/128.jpg'),
('3d4d38ea-0d32-4415-97f9-8eb5ded79cb6',	'Brennon Heidenreich I',	'2022-05-13 12:29:04.036',	'2022-05-13 12:29:04.036',	'Arely_Bins50@yahoo.com',	'(777) 569-5804 x7950',	'$2b$10$V9MOaW.bq3cGSOH3OWuMy.NCraslfb/jS3i7hrnNnWrC4RCC5e5bK',	NULL,	'https://s3.amazonaws.com/uifaces/faces/twitter/baluli/128.jpg'),
('0160d374-f610-4f0e-a073-5326e53c8c82',	'Lilyan Rutherford',	'2022-05-13 12:29:04.095',	'2022-05-13 12:29:04.095',	'Lindsay_Lind75@hotmail.com',	'856-408-0617 x80083',	'$2b$10$IdLjhVhRaWDkAJ3sTNewYe0AHtRMMSlX.RNShnixyNxdi2.M7.Sm.',	NULL,	'https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg'),
('b49060e5-d3ac-4116-85bb-33dcbbeaf751',	'Jaylon Swift',	'2022-05-13 12:29:04.155',	'2022-05-13 12:29:04.155',	'Joanne_Wisozk82@yahoo.com',	'1-808-082-2751 x24177',	'$2b$10$hYL.4GjpYNrLSLG4dQ253.6qpjQrWIZLfv1.K1RGYGsZKEOQGi6jK',	NULL,	'https://s3.amazonaws.com/uifaces/faces/twitter/exentrich/128.jpg'),
('b1fd3021-3e63-4acc-8d1b-36a3c48b1aa8',	'Hal Mante',	'2022-05-13 12:29:04.217',	'2022-05-13 12:29:04.217',	'Deborah84@hotmail.com',	'613.807.6743 x24828',	'$2b$10$fDowQlZgpTYlRc.JluxxZ.ssUfA11CylXO7m2oUiKKgFSA4QnZdWy',	NULL,	NULL),
('efe205d5-8142-4dae-9376-75cadc508f46',	'Anderson Feeney',	'2022-05-13 12:29:03.663',	'2022-05-16 12:46:49.982152',	'Garrick_Nitzsche@yahoo.com',	'1-735-951-2985 x3273',	'$2b$10$K8YXtb9G/keNjDB6dWeXZ.2rWO8rsdxlamGp5SM75lL073efE2tgi',	NULL,	NULL),
('bc07428f-62ff-4dc8-a0cc-b4bf4cc64a0c',	'Deshawn Leannon',	'2022-05-13 12:29:03.739',	'2022-05-16 12:49:13.010388',	'Macy_Kshlerin65@yahoo.com',	'450.187.3484',	'$2b$10$DIDeCWTWQN8sGiRxeT3Wbe9ulMMvRHFEgK5PkZcIiKf0G1x3jngLe',	'$2b$10$0cwX4voO9c9XVNhChXHpXuKBPPgSTHtCLk6bSqQCSR34YDqzo3IFq',	NULL);

ALTER TABLE ONLY "public"."connection" ADD CONSTRAINT "FK_3b35155c2968acced66fc326aea" FOREIGN KEY ("userId") REFERENCES "user"(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."conversation" ADD CONSTRAINT "FK_58655a79896e1ae23173b90ee82" FOREIGN KEY (user1) REFERENCES "user"(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."conversation" ADD CONSTRAINT "FK_c8e5269cb23afd99c6763383108" FOREIGN KEY (user2) REFERENCES "user"(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."message" ADD CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES conversation(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."message" ADD CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "user"(id) NOT DEFERRABLE;

-- 2022-05-17 06:20:02.215516+00