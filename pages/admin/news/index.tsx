import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';
import { NewsPost } from '../../../types';

export default function NewsList() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const status = filter === 'all' ? 'all' : filter;
      const response = await fetch(`/api/news?status=${status}&limit=100`);
      const data = await response.json();

      if (data.success) {
        setNews(data.data);
      } else {
        setError(data.error || 'Failed to fetch news');
      }
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [filter]);

  const filteredNews = news.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this news post?')) {
      try {
        const response = await fetch(`/api/news/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          await fetchNews();
        } else {
          alert(data.error || 'Failed to delete news post');
        }
      } catch (err: any) {
        console.error('Error deleting news:', err);
        alert(err.message || 'Failed to delete news post');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      published: 'success',
      draft: 'warning',
      archived: 'danger',
    };
    return badges[status as keyof typeof badges] || 'secondary';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="hostels-page">
          <div className="page-header">
            <h1>Loading...</h1>
            <p className="text-muted">Fetching news posts...</p>
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
            <h1>News Management</h1>
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
            <h1>News Management</h1>
            <p className="text-muted">Create and manage news posts</p>
          </div>
          <Link href="/admin/news/new" className="btn btn-primary">
            ➕ Add New Post
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="filters-bar">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({news.length})
            </button>
            <button
              className={`filter-tab ${filter === 'published' ? 'active' : ''}`}
              onClick={() => setFilter('published')}
            >
              Published ({news.filter(n => n.status === 'published').length})
            </button>
            <button
              className={`filter-tab ${filter === 'draft' ? 'active' : ''}`}
              onClick={() => setFilter('draft')}
            >
              Drafts ({news.filter(n => n.status === 'draft').length})
            </button>
            <button
              className={`filter-tab ${filter === 'archived' ? 'active' : ''}`}
              onClick={() => setFilter('archived')}
            >
              Archived ({news.filter(n => n.status === 'archived').length})
            </button>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* News Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Published</th>
                <th>Views</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="hostel-name">
                      <strong>{post.title}</strong>
                      <small className="text-muted d-block">{post.excerpt.substring(0, 60)}...</small>
                    </div>
                  </td>
                  <td>{post.author}</td>
                  <td>
                    <span className="category-tag">{post.category}</span>
                  </td>
                  <td>{formatDate(post.publishedAt || post.createdAt)}</td>
                  <td>
                    <span className="view-count">👁️ {post.views}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${getStatusBadge(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        href={`/admin/news/${post.id}`}
                        className="btn-icon"
                        title="Edit"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
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

          {filteredNews.length === 0 && (
            <div className="empty-state">
              <p>No news posts found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
