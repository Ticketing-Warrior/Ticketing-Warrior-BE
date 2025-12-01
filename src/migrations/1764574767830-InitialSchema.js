import { Table } from "typeorm";

export class InitialSchema1764574767830 {
    name = 'InitialSchema1764574767830'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`record\` (\`id\` int NOT NULL AUTO_INCREMENT, \`duration\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`record\``);
    }
}
