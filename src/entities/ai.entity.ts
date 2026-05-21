import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ai', schema: 'public' })
export class AI {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}
