import { Message } from 'src/modules/messages/entities/message.entity';
import { UserInRoom } from 'src/modules/user-in-room/entities/user-in-room.entity';
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

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'creator_id' })
  creatorId: number;

  @Column({ type: 'int', name: 'last_message_id', nullable: true })
  lastMessageId: number;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  name: string;

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

  @OneToOne(() => Message, (message) => message.room)
  @JoinColumn({ name: 'last_message_id' })
  lastMessage: Message;

  @OneToMany(() => UserInRoom, (userInRoom) => userInRoom.room)
  userInRoom: UserInRoom[];

  @OneToMany(() => Message, (message) => message.rooms)
  messages: Message[];

  @ManyToOne(() => User, (creator) => creator.rooms)
  @JoinColumn({ name: 'creator_id' })
  creator: User;
}
