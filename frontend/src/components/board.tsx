import React from 'react'
import type { Card as CardType } from '../types/card'
import { Card } from './Card'

interface BoardProps {
    cards: CardType[]
    onCardClick: (card: CardType) => void
}

export function Board({ cards, onCardClick }: BoardProps) {
    return (
        <div className='grid grid-cols-4 gap-2'>
            {cards.map((card) => (
                <Card key={card.id} card={card} onClick={onCardClick} />
            ))}
        </div>
    )
}
