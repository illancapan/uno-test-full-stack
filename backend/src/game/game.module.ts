import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { BuildDeckService } from './application/build-deck.service';
import { GameStateService } from './application/game-state.service';
import { ImageApiService } from './infrastructure/image-api.service';
import { GameResultRepository } from './repositories/game-result.repository';
import { GameResult } from '../entities/game-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameResult])],
  controllers: [GameController],
  providers: [
    GameService,
    BuildDeckService,
    GameStateService,
    ImageApiService,
    GameResultRepository,
  ],
})
export class GameModule {}
