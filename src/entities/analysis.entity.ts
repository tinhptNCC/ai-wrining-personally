import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Writing } from './writings.entity';

@Entity({ name: 'analysis', schema: 'public' })
export class Analysis {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'writing_id',
    type: 'uuid',
    nullable: false,
  })
  writing_id!: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  user_id!: string;

  @Column({
    name: 'feedback_json',
    type: 'jsonb',
    nullable: true,
  })
  feedback_json?: object;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  created_at!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updated_at!: Date;

  // Relations
  @ManyToOne(() => Writing, (writing) => writing.analyses)
  writing!: Writing;

  @ManyToOne(() => User, (user) => user.analyses)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_analysis_user_id',
  })
  user!: User;
}
