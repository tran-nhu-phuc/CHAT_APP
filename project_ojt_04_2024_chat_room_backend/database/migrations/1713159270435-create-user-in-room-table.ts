import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUserInRoomTable1713159270435 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user-in-room',
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
            name: 'user_id',
            type: 'int',
            isNullable: false,
            unsigned: true,
          },
          {
            name: 'room_id',
            type: 'int',
            isNullable: false,
            unsigned: true,
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'user-in-room',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        name: 'FK_user-in-room_user_id',
      }),
    );
    await queryRunner.createForeignKey(
      'user-in-room',
      new TableForeignKey({
        columnNames: ['room_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'rooms',
        name: 'FK_user-in-room_room_id',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('user-in-room', 'FK_user-in-room_user_id');
    await queryRunner.dropForeignKey('user-in-room', 'FK_user-in-room_room_id');
    await queryRunner.dropTable('user-in-room');
  }
}
