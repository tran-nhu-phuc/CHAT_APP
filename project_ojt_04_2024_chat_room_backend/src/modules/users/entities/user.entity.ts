import { Message } from 'src/modules/messages/entities/message.entity';
import { Notice } from 'src/modules/notifications/entities/notification.entity';
import { Room } from 'src/modules/rooms/entities/room.entity';
import { UserInRoom } from 'src/modules/user-in-room/entities/user-in-room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar', unique: true, length: 30 })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 60 })
  password: string;

  @Column({ nullable: false, type: 'varchar', name: 'first_name', length: 39 })
  firstName: string;

  @Column({ nullable: false, type: 'varchar', name: 'last_name', length: 9 })
  lastName: string;

  @Column({ nullable: false, type: 'date', name: 'birth_date' })
  birthDate: Date;

  @Column({ nullable: false, type: 'varchar', length: 11 })
  phone: string;

  @Column({ nullable: true, default: null, type: 'varchar', length: 255 })
  avatar: string;

  @Column({ nullable: false, type: 'tinyint' })
  role: number;

  @Column({ nullable: true, type: 'tinyint', default: 0, name: 'is_delete' })
  isDelete: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => UserInRoom, (userInRoom) => userInRoom.user)
  userInRoom: UserInRoom[];

  @OneToMany(() => Room, (room) => room.creator)
  rooms: Room[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @OneToMany(() => Notice, (notice) => notice.user)
  notices: Notice[];
}
