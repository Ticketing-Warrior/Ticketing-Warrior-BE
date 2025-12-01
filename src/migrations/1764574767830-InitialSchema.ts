import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1764574767830 implements MigrationInterface {
    name = 'InitialSchema1764574767830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`record\` (\`id\` int NOT NULL AUTO_INCREMENT, \`duration\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`record\``);
    }

}
