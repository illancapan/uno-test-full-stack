import { Injectable } from '@nestjs/common';
import { FlipCardDto } from '../dto/flip-card.dto';
import { GameResultDto } from '../dto/game-result.dto';
import { CardDto } from '../dto/card.dto';
import { GameResultRepository } from '../repositories/game-result.repository';

@Injectable()
export class GameStateService {
  private gameStates: Record<
    string,
    {
      deck: CardDto[];
      flippedCards: CardDto[];
      matchedPairs: number;
      totalMoves: number;
      run?: string;
      name?: string;
    }
  > = {};

  constructor(private readonly gameResultRepository: GameResultRepository) {}

  setDeck(deck: CardDto[], gameId: string, run: string, name: string) {
    this.gameStates[gameId] = {
      deck: deck.map((c) => ({ ...c, flipped: false, isMatched: false })),
      flippedCards: [],
      matchedPairs: 0,
      totalMoves: 0,
      run,
      name,
    };
  }

  flipCard(flip: FlipCardDto, gameId: string): GameResultDto {
    const gameState = this.gameStates[gameId];
    if (!gameState) {
      throw new Error('Game state not found');
    }

    const { deck, flippedCards } = gameState;
    const card = deck.find((c) => c.id === flip.cardId);

    if (!card || card.flipped || card.isMatched) {
      return this.getResult(gameId);
    }

    card.flipped = true;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      gameState.totalMoves++;
      const [first, second] = flippedCards;

      if (first.image.uuid === second.image.uuid) {
        first.isMatched = true;
        second.isMatched = true;
        gameState.matchedPairs++;
      } else {
        first.flipped = false;
        second.flipped = false;
      }

      gameState.flippedCards = [];
    }

    return this.getResult(gameId);
  }

  getResultById(gameId: string): GameResultDto | undefined {
    const gameState = this.gameStates[gameId];
    if (!gameState) return undefined;

    return {
      matchedPairs: gameState.matchedPairs,
      totalMoves: gameState.totalMoves,
      completed: gameState.matchedPairs === gameState.deck.length / 2,
    };
  }

  async saveResult(gameId: string): Promise<void> {
    const gameState = this.gameStates[gameId];
    if (!gameState || !gameState.run || !gameState.name) {
      throw new Error('Cannot save result: missing game state or user info');
    }

    const result = this.getResult(gameId);
    await this.gameResultRepository.save({
      run: gameState.run,
      name: gameState.name,
      matchedPairs: result.matchedPairs,
      totalMoves: result.totalMoves,
      completed: result.completed,
    });
  }

  async getHistoryByRun(run: string): Promise<any[]> {
    return this.gameResultRepository.findByRun(run);
  }

  private getResult(gameId: string): GameResultDto {
    const gameState = this.gameStates[gameId];
    return {
      matchedPairs: gameState.matchedPairs,
      totalMoves: gameState.totalMoves,
      completed: gameState.matchedPairs === gameState.deck.length / 2,
    };
  }
}
