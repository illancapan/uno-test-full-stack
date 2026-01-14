import React, { useState } from 'react'
import type { User } from '../types/user'

interface UserFormProps {
    onSave: (user: User) => void
}

export function UserForm({ onSave }: UserFormProps) {
    const [name, setName] = useState('')
    const [run, setRun] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            onSave({ name, run })
            setIsLoading(false)
        }, 500)
    }

    const isValid = name.trim() && run.trim()

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Your Name
                </label>
                <input
                    type='text'
                    placeholder='e.g., John Doe'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400'
                    required
                />
            </div>
            <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    RUN / ID
                </label>
                <input
                    type='text'
                    placeholder='e.g., 12345678-9'
                    value={run}
                    onChange={(e) => setRun(e.target.value)}
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400'
                    required
                />
            </div>
            <button
                type='submit'
                disabled={!isValid || isLoading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                    isValid && !isLoading
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-105'
                        : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
                {isLoading ? (
                    <>
                        <span className='animate-spin'>⏳</span> Starting...
                    </>
                ) : (
                    <>🚀 Start Game</>
                )}
            </button>
        </form>
    )
}
