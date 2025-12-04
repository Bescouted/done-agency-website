import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../config'

export default function Login() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            const data = await res.json()

            if (data.success) {
                localStorage.setItem('adminToken', data.token)
                navigate('/admin')
            } else {
                setError('Invalid password')
            }
        } catch (err) {
            setError('Login failed')
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-white/5 p-8 rounded-xl border border-white/10 w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Login</h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2">PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-electric-blue outline-none rounded"
                            placeholder="Enter admin password"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-electric-blue text-black font-bold rounded hover:bg-white transition-colors"
                    >
                        LOGIN
                    </button>
                </form>
            </div>
        </div>
    )
}
