import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GameResult } from '../../entities/game-result.entity';

@Injectable()
export class GameResultRepository {
  constructor(
    @InjectRepository(GameResult)
    private readonly repository: Repository<GameResult>,
  ) {}

  async save(data: {
    run: string;
    name: string;
    matchedPairs: number;
    totalMoves: number;
    completed: boolean;
  }): Promise<GameResult> {
    const gameResult = this.repository.create(data);
    return this.repository.save(gameResult);
  }

  async findByRun(run: string): Promise<GameResult[]> {
    return this.repository.find({
      where: { run },
      order: { playedAt: 'DESC' },
    });
  }

  async findAll(): Promise<GameResult[]> {
    return this.repository.find({
      order: { playedAt: 'DESC' },
    });
  }
}
