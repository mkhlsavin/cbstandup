import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Video } from './Video';

@Entity('user_favorite')
export class UserFavorite {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'telegram_user_id' })
  telegram_user_id!: string;

  @Column({ name: 'video_id' })
  video_id!: number;

  @ManyToOne(() => Video)
  @JoinColumn({ name: 'video_id' })
  video!: Video;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;
}
