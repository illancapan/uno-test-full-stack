import { useState, useEffect } from 'react'
import type { User } from '../types/user'

export function useUser() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem('user')
        if (saved) setUser(JSON.parse(saved))
    }, [])

    const saveUser = (user: User) => {
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
    }

    return { user, saveUser }
}
