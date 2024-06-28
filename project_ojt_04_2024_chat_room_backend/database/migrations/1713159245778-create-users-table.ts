import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1713159245778 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            length: '30',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '39',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '9',
            isNullable: false,
          },
          {
            name: 'birth_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '11',
            isNullable: false,
          },
          {
            name: 'avatar',
            type: 'varchar',
            default: null,
            isNullable: true,
          },
          {
            name: 'role',
            type: 'tinyint',
            isNullable: false,
          },
          {
            name: 'is_delete',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'DATETIME',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'DATETIME',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE users`);
  }
}
