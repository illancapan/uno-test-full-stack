import React from 'react'
import { useUser } from '../hooks/useUser'
import { UserForm } from '../components/UserForm'
import { Game } from './Game'

export function Home() {
    const { user, saveUser } = useUser()

    return (
        <div className='min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center p-4'>
            {!user ? (
                <div className='w-full max-w-md'>
                    <div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20'>
                        <div className='mb-8 text-center'>
                            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4'>
                                <span className='text-3xl'>🎮</span>
                            </div>
                            <h1 className='text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                                Memory Game
                            </h1>
                            <p className='text-gray-600 text-sm'>
                                Test your concentration skills
                            </p>
                        </div>
                        <UserForm onSave={saveUser} />
                    </div>
                    <p className='text-center text-white/70 text-xs mt-6'>
                        ✨ Match all pairs to win
                    </p>
                </div>
            ) : (
                <Game user={user} />
            )}
        </div>
    )
}
