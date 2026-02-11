import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, MousePointer2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const Analytics = () => {
    const { id } = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://urlshortner-be-guis.onrender.com/url/analytics/${id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch analytics')
                }
                const result = await response.json()
                setData(result)
            } catch (err) {
                console.error(err)
                setError('Could not load analytics. Please check if the URL ID is correct and the backend is running.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    const history = data?.clickHistory || data?.analytics || []

    const chartData = history.map((entry, index) => {
        // Try to parse timestamp from 'clicks' or fallback
        const timestamp = entry.clicks || entry.timestamp || Date.now()
        const date = new Date(timestamp)
        return {
            name: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            clicks: 1, // Represents a single click event
            fullDate: date.toLocaleString()
        }
    })

    return (
        <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/" className="btn btn-secondary" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                    Analytics for <span className="text-gradient">/{id}</span>
                </h1>
            </div>

            {loading && (
                <div className="flex-center" style={{ minHeight: '300px' }}>
                    <p>Loading analytics data...</p>
                </div>
            )}

            {error && (
                <div style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius)' }}>
                    {error}
                </div>
            )}

            {data && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Stats Card: Total Clicks */}
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: 'hsla(var(--primary), 0.2)', borderRadius: '12px', color: 'hsl(var(--primary))' }}>
                                <MousePointer2 size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Total Clicks</h3>
                        </div>
                        <p style={{ fontSize: '3rem', fontWeight: 800 }}>
                            {data.totalClicks || history.length || 0}
                        </p>
                        <p style={{ color: 'hsl(var(--muted-foreground))' }}>All time interactions</p>
                    </div>

                    {/* List of clicks */}
                    <div className="card" style={{ gridColumn: '1 / -1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'hsla(var(--ring), 0.2)', borderRadius: '12px', color: 'hsl(var(--ring))' }}>
                                <Clock size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Click History</h3>
                        </div>

                        {chartData.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid hsl(var(--border))', textAlign: 'left' }}>
                                            <th style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))' }}>Timestamp</th>
                                            <th style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))' }}>Date</th>
                                            <th style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))' }}>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((entry, i) => {
                                            const timestamp = entry.clicks || entry.timestamp;
                                            const d = new Date(timestamp);
                                            return (
                                                <tr key={i} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                                                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{timestamp}</td>
                                                    <td style={{ padding: '1rem' }}>{d.toLocaleDateString()}</td>
                                                    <td style={{ padding: '1rem' }}>{d.toLocaleTimeString()}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ color: 'hsl(var(--muted-foreground))' }}>No clicks recorded yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )

}

export default Analytics
