import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';

interface Inquiry {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  hostelInterested: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'contacted';
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'contacted'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inquiries');
      const data = await response.json();

      if (data.success) {
        setInquiries(data.data);
      } else {
        setError(data.error || 'Failed to fetch inquiries');
      }
    } catch (err: any) {
      console.error('Error fetching inquiries:', err);
      setError(err.message || 'Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filteredInquiries = inquiries.filter(inquiry =>
    filter === 'all' || inquiry.status === filter
  );

  const handleStatusChange = async (id: string, newStatus: 'unread' | 'read' | 'contacted') => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setInquiries(prev =>
          prev.map(inq => (inq.id === id ? { ...inq, status: newStatus } : inq))
        );
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert(err.message || 'Failed to update status');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      unread: 'danger',
      read: 'warning',
      contacted: 'success',
    };
    return badges[status as keyof typeof badges] || 'secondary';
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Hostel', 'Message', 'Date', 'Status'];
    const csvData = [
      headers.join(','),
      ...inquiries.map(inq =>
        [
          inq.studentName,
          inq.email,
          inq.phone,
          `"${inq.hostelInterested}"`,
          `"${inq.message}"`,
          new Date(inq.date).toLocaleDateString(),
          inq.status,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="inquiries-page">
          <div className="page-header">
            <h1>Loading...</h1>
            <p className="text-muted">Fetching inquiries...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="inquiries-page">
          <div className="page-header">
            <h1>Student Inquiries</h1>
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
      <div className="inquiries-page">
        <div className="page-header">
          <div>
            <h1>Student Inquiries</h1>
            <p className="text-muted">Manage and respond to student questions and booking requests</p>
          </div>
          <button onClick={exportToCSV} className="btn btn-secondary">
            📥 Export to CSV
          </button>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({inquiries.length})
            </button>
            <button
              className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({inquiries.filter(i => i.status === 'unread').length})
            </button>
            <button
              className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
              onClick={() => setFilter('read')}
            >
              Read ({inquiries.filter(i => i.status === 'read').length})
            </button>
            <button
              className={`filter-tab ${filter === 'contacted' ? 'active' : ''}`}
              onClick={() => setFilter('contacted')}
            >
              Contacted ({inquiries.filter(i => i.status === 'contacted').length})
            </button>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Hostel Interested In</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className={inquiry.status === 'unread' ? 'unread-row' : ''}
                >
                  <td>
                    <strong>{inquiry.studentName}</strong>
                  </td>
                  <td>
                    <a href={`mailto:${inquiry.email}`} className="email-link">
                      {inquiry.email}
                    </a>
                  </td>
                  <td>
                    <a href={`tel:${inquiry.phone}`} className="contact-link">
                      {inquiry.phone}
                    </a>
                  </td>
                  <td>{inquiry.hostelInterested}</td>
                  <td className="text-muted">{formatDate(inquiry.date)}</td>
                  <td>
                    <span className={`badge badge-${getStatusBadge(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="btn-icon"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="btn-icon"
                        title="Send Email"
                      >
                        ✉️
                      </a>
                      <a
                        href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-icon"
                        title="WhatsApp"
                      >
                        💬
                      </a>
                      <select
                        value={inquiry.status}
                        onChange={(e) =>
                          handleStatusChange(
                            inquiry.id,
                            e.target.value as 'unread' | 'read' | 'contacted'
                          )
                        }
                        className="status-select"
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="contacted">Contacted</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInquiries.length === 0 && (
            <div className="empty-state">
              <p>No inquiries found.</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedInquiry && (
          <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Inquiry Details</h3>
                <button onClick={() => setSelectedInquiry(null)} className="close-btn">
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="inquiry-detail">
                  <div className="detail-row">
                    <strong>Student:</strong>
                    <span>{selectedInquiry.studentName}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong>
                    <a href={`mailto:${selectedInquiry.email}`}>
                      {selectedInquiry.email}
                    </a>
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong>
                    <a href={`tel:${selectedInquiry.phone}`}>
                      {selectedInquiry.phone}
                    </a>
                  </div>
                  <div className="detail-row">
                    <strong>Hostel:</strong>
                    <span>{selectedInquiry.hostelInterested}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Date:</strong>
                    <span>{new Date(selectedInquiry.date).toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Status:</strong>
                    <span className={`badge badge-${getStatusBadge(selectedInquiry.status)}`}>
                      {selectedInquiry.status}
                    </span>
                  </div>
                  <div className="detail-message">
                    <strong>Message:</strong>
                    <p>{selectedInquiry.message}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="btn btn-secondary"
                >
                  ✉️ Send Email
                </a>
                <a
                  href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
