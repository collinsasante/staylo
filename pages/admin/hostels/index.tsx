import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';

interface Hostel {
  id: string;
  name: string;
  location: string;
  price: number;
  status: 'active' | 'unavailable' | 'featured';
  ownerName: string;
  ownerContact: string;
  views: number;
  createdAt: string;
}

export default function HostelsList() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'unavailable' | 'featured'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hostels');
      const data = await response.json();

      if (data.success) {
        setHostels(data.data);
      } else {
        setError(data.error || 'Failed to fetch hostels');
      }
    } catch (err: any) {
      console.error('Error fetching hostels:', err);
      setError(err.message || 'Failed to fetch hostels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const filteredHostels = hostels.filter(hostel => {
    const matchesFilter = filter === 'all' || hostel.status === filter;
    const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hostel.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hostel?')) {
      try {
        const response = await fetch(`/api/hostels/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          // Refresh the hostels list
          await fetchHostels();
        } else {
          alert(data.error || 'Failed to delete hostel');
        }
      } catch (err: any) {
        console.error('Error deleting hostel:', err);
        alert(err.message || 'Failed to delete hostel');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'success',
      unavailable: 'danger',
      featured: 'warning',
    };
    return badges[status as keyof typeof badges] || 'secondary';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="hostels-page">
          <div className="page-header">
            <h1>Loading...</h1>
            <p className="text-muted">Fetching hostel listings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="hostels-page">
          <div className="page-header">
            <h1>Hostel Listings</h1>
            <div className="error-alert">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="hostels-page">
        <div className="page-header">
          <div>
            <h1>Hostel Listings</h1>
            <p className="text-muted">Manage all hostel properties on Staylo</p>
          </div>
          <Link href="/admin/hostels/new" className="btn btn-primary">
            ➕ Add New Hostel
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="filters-bar">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({hostels.length})
            </button>
            <button
              className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({hostels.filter(h => h.status === 'active').length})
            </button>
            <button
              className={`filter-tab ${filter === 'featured' ? 'active' : ''}`}
              onClick={() => setFilter('featured')}
            >
              Featured ({hostels.filter(h => h.status === 'featured').length})
            </button>
            <button
              className={`filter-tab ${filter === 'unavailable' ? 'active' : ''}`}
              onClick={() => setFilter('unavailable')}
            >
              Unavailable ({hostels.filter(h => h.status === 'unavailable').length})
            </button>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search hostels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* Hostels Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Hostel Name</th>
                <th>Location</th>
                <th>Price/Semester</th>
                <th>Owner</th>
                <th>Contact</th>
                <th>Views</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHostels.map((hostel) => (
                <tr key={hostel.id}>
                  <td>
                    <div className="hostel-name">
                      <strong>{hostel.name}</strong>
                    </div>
                  </td>
                  <td>{hostel.location}</td>
                  <td>
                    <span className="price">GH₵ {hostel.price.toLocaleString()}</span>
                  </td>
                  <td>{hostel.ownerName}</td>
                  <td>
                    <a href={`tel:${hostel.ownerContact}`} className="contact-link">
                      {hostel.ownerContact}
                    </a>
                  </td>
                  <td>
                    <span className="view-count">👁️ {hostel.views}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${getStatusBadge(hostel.status)}`}>
                      {hostel.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        href={`/admin/hostels/${hostel.id}`}
                        className="btn-icon"
                        title="View"
                      >
                        👁️
                      </Link>
                      <Link
                        href={`/admin/hostels/${hostel.id}/edit`}
                        className="btn-icon"
                        title="Edit"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(hostel.id)}
                        className="btn-icon danger"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredHostels.length === 0 && (
            <div className="empty-state">
              <p>No hostels found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
