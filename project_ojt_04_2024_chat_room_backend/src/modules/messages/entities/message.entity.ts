import { File } from 'src/modules/files/entities/file.entity';
import { Notice } from 'src/modules/notifications/entities/notification.entity';
import { Room } from 'src/modules/rooms/entities/room.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'int', name: 'room_id' })
  roomId: number;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  content: string;

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

  @OneToMany(() => Notice, (notice) => notice.message)
  notices: Notice[];

  @OneToOne(() => Room, (room) => room.lastMessage)
  room: Room;

  @OneToMany(() => File, (file) => file.message)
  files: File[];

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Room, (room) => room.messages)
  @JoinColumn({ name: 'room_id' })
  rooms: Room;
}
