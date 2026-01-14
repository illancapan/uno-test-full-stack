import type { Card } from './types/card'
import type { GameResult } from './types/gameResult'

const BASE_URL = 'http://localhost:3000/game'

export async function getDeck(
    gameId: string,
    run: string,
    name: string
): Promise<any[]> {
    const response = await fetch(
        `${BASE_URL}/deck/${gameId}?run=${encodeURIComponent(
            run
        )}&name=${encodeURIComponent(name)}`
    )
    if (!response.ok) throw new Error('Failed to get deck')
    return response.json()
}

export async function flipCard(
    gameId: string,
    cardId: string | number
): Promise<any> {
    const response = await fetch(`${BASE_URL}/flip/${gameId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId }),
    })
    if (!response.ok) throw new Error('Failed to flip card')
    return response.json()
}

export async function getGameResult(gameId: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/result/${gameId}`)
    if (!response.ok) throw new Error('Failed to fetch result')
    return response.json()
}

export async function saveGameResult(gameId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/save/${gameId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error('Failed to save result')
}

export async function getHistoryByRun(run: string): Promise<any[]> {
    const response = await fetch(
        `${BASE_URL}/history/${encodeURIComponent(run)}`
    )
    if (!response.ok) throw new Error('Failed to fetch history')
    return response.json()
}
