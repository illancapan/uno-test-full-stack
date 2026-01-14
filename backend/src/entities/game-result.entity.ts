import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('game_results')
export class GameResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  run: string;

  @Column()
  name: string;

  @Column()
  matchedPairs: number;

  @Column()
  totalMoves: number;

  @Column()
  completed: boolean;

  @CreateDateColumn()
  playedAt: Date;
}
