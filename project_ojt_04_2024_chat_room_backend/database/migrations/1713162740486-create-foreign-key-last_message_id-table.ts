import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class CreateForeignKeyLastMessageIdTable1713162740486
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'rooms',
      new TableForeignKey({
        columnNames: ['last_message_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'messages',
        name: 'FK_rooms_last_message_id',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('rooms', 'FK_rooms_last_message_id');
  }
}
