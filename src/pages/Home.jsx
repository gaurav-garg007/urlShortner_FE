import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Copy, Check, BarChart2, Link as LinkIcon, Loader2 } from 'lucide-react'

const Home = () => {
    const [url, setUrl] = useState('')
    const [shortUrlId, setShortUrlId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [copied, setCopied] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!url) return

        setLoading(true)
        setError(null)
        setShortUrlId(null)

        try {
            const response = await fetch('https://urlshortner-be-guis.onrender.com/url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            })

            if (!response.ok) {
                const text = await response.text()
                throw new Error(`Failed to shorten URL: ${response.status} ${response.statusText}`)
            }

            const data = await response.json()

            // Support multiple possible response formats
            const receivedId = data?.url || data?.id || data?.shortId

            if (receivedId) {
                setShortUrlId(receivedId)
            } else {
                // If the API returns the ID directly as a string or number (less common for JSON APIs but possible)
                if (typeof data === 'string' || typeof data === 'number') {
                    setShortUrlId(data)
                } else {
                    throw new Error(`Invalid response format. Expected { urlId: "..." }. Received: ${JSON.stringify(data)}`)
                }
            }
        } catch (err) {
            console.error('Submit Error:', err)
            setError(err.message || 'Something went wrong. Please check the console.')
        } finally {
            setLoading(false)
        }
    }

    const shortLink = shortUrlId ? `https://urlshortner-be-guis.onrender.com/${shortUrlId}` : ''

    const copyToClipboard = () => {
        if (!shortLink) return
        navigator.clipboard.writeText(shortLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '600px' }} className="animate-fade-in">
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
                    Shorten Your <br />
                    <span className="text-gradient">Links Instantly</span>
                </h1>
                <p style={{ fontSize: '1.125rem', color: 'hsl(var(--muted-foreground))' }}>
                    A premium URL shortener for modern needs. Track clicks, analyze performance, and share with style.
                </p>
            </div>

            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', animationDelay: '0.1s' }}>
                <form onSubmit={handleSubmit} className="input-group">
                    <label htmlFor="url" style={{ fontWeight: 500, marginLeft: '0.25rem' }}>Paste your long URL</label>
                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'hsl(var(--muted-foreground))' }}>
                                <LinkIcon size={18} />
                            </div>
                            <input
                                id="url"
                                type="url"
                                placeholder="https://example.com/very-long-url..."
                                className="input"
                                style={{ paddingLeft: '3rem' }}
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} style={{ marginRight: '0.5rem' }} />
                                    Shortening...
                                </>
                            ) : (
                                <>
                                    Shorten URL <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {error && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius)', textAlign: 'center', wordBreak: 'break-word' }}>
                        {error}
                    </div>
                )}

                {shortUrlId && (
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid hsl(var(--border))' }} className="animate-fade-in">
                        <p style={{ marginBottom: '0.75rem', fontWeight: 500 }}>Your shortened URL:</p>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div className="input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '1.1rem', color: 'hsl(var(--primary))' }}>
                                {shortLink}
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="btn btn-secondary"
                                title="Copy to clipboard"
                                style={{ padding: '1rem' }}
                            >
                                {copied ? <Check size={20} color="#22c55e" /> : <Copy size={20} />}
                            </button>
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                            <Link
                                to={`/analytics/${shortUrlId}`}
                                className="btn btn-secondary"
                                style={{ width: '100%', gap: '0.5rem' }}
                            >
                                <BarChart2 size={18} />
                                View Analytics
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
