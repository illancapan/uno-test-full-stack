export interface GameResult {
    gameId: string
    flippedCards: Card[]
    matchedPairs: number
    moves: number
    finished: boolean
}
