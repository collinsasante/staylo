import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/auth';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Hostels', href: '/admin/hostels', icon: '🏠' },
    { name: 'News', href: '/admin/news', icon: '📰' },
    { name: 'Inquiries', href: '/admin/inquiries', icon: '📩' },
    { name: 'Media Library', href: '/admin/media', icon: '🖼️' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');

      // Redirect to login
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
      router.push('/admin/login');
    }
  };

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">
            <span className="logo-icon">🏨</span>
            Staylo Admin
          </h1>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-header">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div className="header-title">
            <h2>{navigation.find(item => isActive(item.href))?.name || 'Admin'}</h2>
          </div>
          <div className="header-actions">
            <button className="notification-btn">
              🔔
              <span className="notification-badge">3</span>
            </button>
            <div className="admin-profile">
              <span className="profile-avatar">A</span>
              <span className="profile-name">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
