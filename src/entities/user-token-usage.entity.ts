import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity({ name: 'user_token_usage', schema: 'public' })
@Index(['userId', 'date'], { unique: true })
@Index(['userId'])
export class UserTokenUsage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  userId!: string;

  @Column({
    name: 'date',
    type: 'date',
    nullable: false,
  })
  date!: Date;

  @Column({
    name: 'tokens_used',
    type: 'integer',
    default: 0,
  })
  tokensUsed: number = 0;

  @Column({
    name: 'tokens_limit',
    type: 'integer',
    nullable: false,
  })
  tokensLimit!: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.tokenUsages, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
