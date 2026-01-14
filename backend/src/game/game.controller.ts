import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { BuildDeckService } from './application/build-deck.service';
import { GameStateService } from './application/game-state.service';
import { FlipCardDto } from './dto/flip-card.dto';
import { GameResultDto } from './dto/game-result.dto';
import { CardDto } from './dto/card.dto';

@Controller('game')
export class GameController {
  constructor(
    private readonly buildDeckService: BuildDeckService,
    private readonly gameStateService: GameStateService,
  ) {}

  @Get('deck/:gameId')
  async getDeck(
    @Param('gameId') gameId: string,
    @Query('run') run: string,
    @Query('name') name: string,
  ): Promise<CardDto[]> {
    const deck = await this.buildDeckService.execute();
    this.gameStateService.setDeck(deck, gameId, run, name);
    return deck;
  }

  @Post('flip/:gameId')
  flipCard(
    @Param('gameId') gameId: string,
    @Body() flip: FlipCardDto,
  ): GameResultDto {
    return this.gameStateService.flipCard(flip, gameId);
  }

  @Get('result/:gameId')
  getResult(@Param('gameId') gameId: string): GameResultDto {
    const result = this.gameStateService.getResultById(gameId);
    if (!result) throw new Error('Result not found');
    return result;
  }

  @Post('save/:gameId')
  async saveGameResult(@Param('gameId') gameId: string): Promise<void> {
    await this.gameStateService.saveResult(gameId);
  }

  @Get('history/:run')
  async getHistoryByRun(@Param('run') run: string): Promise<any[]> {
    return this.gameStateService.getHistoryByRun(run);
  }
}
