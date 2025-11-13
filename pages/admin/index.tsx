import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

interface DashboardStats {
  totalHostels: number;
  activeHostels: number;
  totalInquiries: number;
  unreadInquiries: number;
  mostViewed: {
    name: string;
    views: number;
  }[];
  recentInquiries: {
    studentName: string;
    hostelInterested: string;
    date: string;
    status: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalHostels: 0,
    activeHostels: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
    mostViewed: [],
    recentInquiries: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats');
        const data = await response.json();

        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.error || 'Failed to fetch statistics');
        }
      } catch (err: any) {
        console.error('Error fetching stats:', err);
        setError(err.message || 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard">
          <div className="dashboard-header">
            <h1>Loading...</h1>
            <p className="text-muted">Fetching dashboard statistics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="dashboard">
          <div className="dashboard-header">
            <h1>Dashboard Overview</h1>
            <div className="error-alert">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <p className="text-muted">Welcome back! Here's what's happening with Staylo.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon hostel">🏠</div>
            <div className="stat-content">
              <h3>Total Hostels</h3>
              <p className="stat-number">{stats.totalHostels}</p>
              <p className="stat-meta">
                <span className="stat-badge success">
                  {stats.activeHostels} Active
                </span>
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon inquiry">📩</div>
            <div className="stat-content">
              <h3>Total Inquiries</h3>
              <p className="stat-number">{stats.totalInquiries}</p>
              <p className="stat-meta">
                <span className="stat-badge warning">
                  {stats.unreadInquiries} Unread
                </span>
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon views">👀</div>
            <div className="stat-content">
              <h3>Most Viewed</h3>
              <p className="stat-number">
                {stats.mostViewed[0]?.views || 0}
              </p>
              <p className="stat-meta text-muted">
                {stats.mostViewed[0]?.name || 'No data'}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon featured">⭐</div>
            <div className="stat-content">
              <h3>Featured Listings</h3>
              <p className="stat-number">6</p>
              <p className="stat-meta">
                <span className="stat-badge info">Updated today</span>
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-row">
          {/* Most Viewed Hostels */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Most Viewed Hostels</h3>
              <a href="/admin/hostels" className="card-link">View all →</a>
            </div>
            <div className="card-body">
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Hostel Name</th>
                    <th>Views</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.mostViewed.map((hostel, index) => (
                    <tr key={index}>
                      <td>
                        <span className="rank-badge">#{index + 1}</span>
                      </td>
                      <td>{hostel.name}</td>
                      <td>
                        <span className="view-count">{hostel.views}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Recent Inquiries</h3>
              <a href="/admin/inquiries" className="card-link">View all →</a>
            </div>
            <div className="card-body">
              <div className="inquiry-list">
                {stats.recentInquiries && stats.recentInquiries.length > 0 ? (
                  stats.recentInquiries.map((inquiry, index) => (
                    <div
                      key={index}
                      className={`inquiry-item ${inquiry.status === 'unread' ? 'unread' : ''}`}
                    >
                      <div className="inquiry-header">
                        <strong>{inquiry.studentName}</strong>
                        <span className="inquiry-time">
                          {formatTimeAgo(inquiry.date)}
                        </span>
                      </div>
                      <p className="inquiry-text">
                        Interested in {inquiry.hostelInterested}
                      </p>
                      {inquiry.status === 'unread' && (
                        <span className="unread-badge">New</span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No recent inquiries</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <a href="/admin/hostels/new" className="action-btn primary">
              ➕ Add New Hostel
            </a>
            <a href="/admin/inquiries" className="action-btn secondary">
              📩 View Inquiries
            </a>
            <a href="/admin/hostels" className="action-btn secondary">
              ✏️ Manage Hostels
            </a>
            <a href="/admin/media" className="action-btn secondary">
              🖼️ Media Library
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
