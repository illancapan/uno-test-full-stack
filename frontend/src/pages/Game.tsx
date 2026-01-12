import { useEffect, useState } from 'react'
import {
    getDeck,
    flipCard,
    getGameResult,
    saveGameResult,
    getHistoryByRun,
} from '../services/Api'
import type { User } from '../types/user'

type GameCard = {
    id: string
    image: { url: string; title?: string }
    flipped: boolean
    isMatched?: boolean
}

interface GameProps {
    user: User
}

export function Game({ user }: GameProps) {
    const [deck, setDeck] = useState<GameCard[]>([])
    const [results, setResults] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [history, setHistory] = useState<any[]>([])
    const [showHistory, setShowHistory] = useState(false)
    const [saving, setSaving] = useState(false)

    const gameId = encodeURIComponent(
        `${user.run.trim().toLowerCase()}-${user.name
            .trim()
            .toLowerCase()}`.replace(/\s+/g, '-')
    )

    useEffect(() => {
        fetchDeckData()
        loadHistory()
    }, [gameId])

    async function fetchDeckData() {
        setLoading(true)
        try {
            const deckData = await getDeck(gameId, user.run, user.name)
            const initDeck = deckData.map((c) => ({
                ...c,
                flipped: false,
                isMatched: false,
            }))
            setDeck(initDeck)
            setResults(null)
        } catch (error) {
            console.error('Error fetching deck:', error)
        } finally {
            setLoading(false)
        }
    }

    async function loadHistory() {
        try {
            const historyData = await getHistoryByRun(user.run)
            setHistory(historyData)
        } catch (error) {
            console.error('Error loading history:', error)
        }
    }

    async function handleFlip(cardId: string) {
        try {
            const newResult = await flipCard(gameId, cardId)
            setResults(newResult)

            const updatedDeck = deck.map((c) =>
                c.id === cardId ? { ...c, flipped: true } : c
            )
            setDeck(updatedDeck)

            // Auto-save si completó
            if (newResult.completed && !saving) {
                handleSaveResult()
            }
        } catch (error) {
            console.error('Error flipping card:', error)
        }
    }

    async function fetchResults() {
        try {
            const result = await getGameResult(gameId)
            setResults(result)
        } catch (error) {
            console.error('Error fetching results:', error)
        }
    }

    async function handleSaveResult() {
        setSaving(true)
        try {
            await saveGameResult(gameId)
            await loadHistory()
        } catch (error) {
            console.error('Error saving result:', error)
        } finally {
            setSaving(false)
        }
    }

    async function handleReset() {
        await fetchDeckData()
    }

    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4'></div>
                    <p className='text-white font-semibold'>
                        Preparing your game...
                    </p>
                </div>
            </div>
        )
    }

    const progress = Math.round(
        (deck.filter((c) => c.flipped || c.isMatched).length / deck.length) *
            100
    )

    return (
        <div className='min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 p-4 flex items-center justify-center'>
            <div className='w-full' style={{ maxWidth: '1000px' }}>
                {/* Header */}
                <div className='mb-8'>
                    <div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20'>
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                                    🎮 Memory Game
                                </h1>
                                <div className='space-y-1'>
                                    <p className='text-gray-700 font-semibold'>
                                        {user.name}
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                        RUN: {user.run}
                                    </p>
                                </div>
                            </div>
                            <div className='flex gap-3 w-full sm:w-auto flex-wrap'>
                                <button
                                    onClick={handleReset}
                                    className='flex-1 sm:flex-none px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200'
                                >
                                    🔄 Reset
                                </button>
                                <button
                                    onClick={fetchResults}
                                    className='flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200'
                                >
                                    📊 Results
                                </button>
                                <button
                                    onClick={() => setShowHistory(!showHistory)}
                                    className='flex-1 sm:flex-none px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200'
                                >
                                    📜 History ({history.length})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className='bg-white/95 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20'>
                        <div className='flex justify-between items-center mb-2'>
                            <span className='text-sm font-semibold text-gray-700'>
                                Progress
                            </span>
                            <span className='text-sm font-bold text-indigo-600'>
                                {progress}%
                            </span>
                        </div>
                        <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
                            <div
                                className='h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300'
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {results && (
                        <div
                            className={`rounded-xl p-6 text-center transition-all duration-300 border backdrop-blur-sm ${
                                results.completed
                                    ? 'bg-green-50/95 border-green-200 shadow-lg'
                                    : 'bg-blue-50/95 border-blue-200'
                            }`}
                        >
                            <div className='space-y-3'>
                                <p className='text-sm font-semibold text-gray-700'>
                                    {results.completed
                                        ? '🎉 Game Completed!'
                                        : '📈 Current Status'}
                                </p>
                                <div className='flex justify-around gap-4'>
                                    <div className='flex-1'>
                                        <p className='text-3xl font-bold text-indigo-600 mb-1'>
                                            {results.matchedPairs}
                                        </p>
                                        <p className='text-xs text-gray-600'>
                                            Pairs Matched
                                        </p>
                                    </div>
                                    <div className='w-px bg-gray-300'></div>
                                    <div className='flex-1'>
                                        <p className='text-3xl font-bold text-indigo-600 mb-1'>
                                            {results.totalMoves}
                                        </p>
                                        <p className='text-xs text-gray-600'>
                                            Total Moves
                                        </p>
                                    </div>
                                </div>
                                {results.completed && (
                                    <button
                                        onClick={handleSaveResult}
                                        disabled={saving}
                                        className='mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all disabled:opacity-50'
                                    >
                                        {saving
                                            ? '💾 Saving...'
                                            : '💾 Save Result'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* History */}
                    {showHistory && history.length > 0 && (
                        <div className='bg-white/95 backdrop-blur-sm rounded-xl p-6 mt-6 border border-white/20'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                📜 Game History
                            </h3>
                            <div className='space-y-3 max-h-48 overflow-y-auto'>
                                {history.map((game, idx) => (
                                    <div
                                        key={idx}
                                        className='flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200'
                                    >
                                        <div>
                                            <p className='font-semibold text-gray-900'>
                                                Game {history.length - idx}
                                            </p>
                                            <p className='text-xs text-gray-500'>
                                                {new Date(
                                                    game.playedAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-sm font-semibold text-indigo-600'>
                                                {game.matchedPairs}/
                                                {game.matchedPairs} pairs
                                            </p>
                                            <p className='text-xs text-gray-500'>
                                                {game.totalMoves} moves
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Game Board */}
                <div
                    className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20'
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '1rem',
                    }}
                >
                    {deck.map((card, idx) => (
                        <button
                            key={card.id}
                            onClick={() => handleFlip(card.id)}
                            className={`aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all duration-300 transform ${
                                card.flipped || card.isMatched
                                    ? 'bg-white border-indigo-300 shadow-md'
                                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 hover:border-indigo-300 hover:shadow-lg hover:scale-105 cursor-pointer'
                            }`}
                            disabled={card.flipped || card.isMatched}
                            style={{
                                animation: !loading
                                    ? `fadeIn 0.3s ease-out ${
                                          idx * 0.05
                                      }s backwards`
                                    : 'none',
                            }}
                        >
                            {card.flipped || card.isMatched ? (
                                <img
                                    src={card.image.url}
                                    alt={card.image.title || 'card'}
                                    className='w-full h-full object-cover'
                                />
                            ) : (
                                <div className='w-full h-full flex items-center justify-center'>
                                    <span className='text-4xl font-light text-white'>
                                        ?
                                    </span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Footer Stats */}
                <p className='text-center text-white/80 text-sm mt-8'>
                    {deck.length > 0
                        ? `${
                              deck.filter((c) => c.flipped || c.isMatched)
                                  .length
                          } / ${deck.length} cards revealed`
                        : 'Loading...'}
                </p>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}
