import { Message } from 'src/modules/messages/entities/message.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'message_id' })
  messageId: number;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ nullable: true, default: 1, type: 'tinyint' })
  status: number;

  @Column({ nullable: true, default: 0, type: 'tinyint' })
  type: number;

  @Column({ nullable: true, default: 0, type: 'tinyint', name: 'is_delete' })
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

  @ManyToOne(() => User, (user) => user.notices)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Message, (msg) => msg.notices)
  @JoinColumn({ name: 'message_id' })
  message: Message;
}
