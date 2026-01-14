import React from 'react'
import type { Card as CardType } from '../types/card'

interface CardProps {
    card: CardType
    onClick: (card: CardType) => void
}

export function Card({ card, onClick }: CardProps) {
    return (
        <div
            className='w-24 h-32 border rounded cursor-pointer overflow-hidden flex items-center justify-center shadow-md bg-white'
            onClick={() => onClick(card)}
        >
            {card.flipped || card.isMatched ? (
                <img
                    src={card.image.url}
                    alt={card.image.title || 'card'}
                    className='w-full h-full object-cover'
                />
            ) : (
                // Fondo gris que ocupa todo el espacio
                <div className='w-full h-full bg-gray-400 flex items-center justify-center text-white font-bold text-2xl'>
                    X
                </div>
            )}
        </div>
    )
}
