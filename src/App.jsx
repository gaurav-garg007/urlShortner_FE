import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Analytics from './pages/Analytics'
import { Link } from 'react-router-dom'
import { Link as LinkIcon } from 'lucide-react'

function App() {
  return (
    <>
      <header style={{ padding: '0', borderBottom: '1px solid hsl(var(--border))', background: 'hsl(var(--background) / 0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'hsl(var(--foreground))', fontWeight: 700, fontSize: '1.25rem' }}>
            <div style={{ padding: '0.4rem', background: 'hsl(var(--primary))', borderRadius: '8px', display: 'flex' }}>
              <LinkIcon size={18} color="white" />
            </div>
            <span>Short<span className="text-gradient">Link</span></span>
          </Link>
          <nav>
            {/* Add nav items if needed */}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics/:id" element={<Analytics />} />
        </Routes>
      </main>

      <footer style={{ padding: '0', borderTop: '1px solid hsl(var(--border))', marginTop: 'auto' }}>
        <div className="container" style={{ textAlign: 'center', color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
          <p>© {new Date().getFullYear()} ShortLink. Premium URL Shortener.</p>
        </div>
      </footer>
    </>
  )
}

export default App
