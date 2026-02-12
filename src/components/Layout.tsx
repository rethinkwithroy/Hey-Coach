import { Outlet, NavLink } from 'react-router-dom'
import { Home, Calendar, MessageSquare, ClipboardList, TrendingUp } from 'lucide-react'

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{
        width: '240px',
        background: 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)',
        color: 'white',
        padding: '24px 0',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ padding: '0 24px', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Hey Coach</h1>
          <p style={{ fontSize: '12px', opacity: 0.8 }}>Executive Coaching Platform</p>
        </div>
        
        <NavItem to="/" icon={<Home size={20} />} label="Dashboard" />
        <NavItem to="/sessions" icon={<Calendar size={20} />} label="Sessions" />
        <NavItem to="/chat" icon={<MessageSquare size={20} />} label="Coach Chat" />
        <NavItem to="/assignments" icon={<ClipboardList size={20} />} label="Assignments" />
        <NavItem to="/progress" icon={<TrendingUp size={20} />} label="Progress" />
      </nav>

      <main style={{ flex: 1, padding: '32px', background: '#f8f9fa' }}>
        <Outlet />
      </main>
    </div>
  )
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 24px',
        color: 'white',
        textDecoration: 'none',
        background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
        borderLeft: isActive ? '4px solid white' : '4px solid transparent',
        transition: 'all 0.2s',
      })}
    >
      {icon}
      <span style={{ fontSize: '14px', fontWeight: '500' }}>{label}</span>
    </NavLink>
  )
}
