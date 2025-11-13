import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useRouter } from 'next/router';
import { NewsPost } from '../../../types';

interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage: string;
  images: string[];
  publishedAt: string;
  newFeaturedImage: File | null;
  newImages: File[];
}

export default function EditNews() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    status: 'draft',
    featuredImage: '',
    images: [],
    publishedAt: '',
    newFeaturedImage: null,
    newImages: [],
  });

  const categories = [
    'Travel',
    'Tourist Guide',
    'City Sights',
    'Communication',
    'Events',
    'Tips & Tricks',
    'Student Life',
    'Accommodation',
  ];

  useEffect(() => {
    if (id) {
      fetchNews();
    }
  }, [id]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news/${id}`);
      const data = await response.json();

      if (data.success) {
        const post: NewsPost = data.data;
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          category: post.category,
          tags: post.tags.join(', '),
          status: post.status,
          featuredImage: post.featuredImage,
          images: post.images || [],
          publishedAt: post.publishedAt
            ? new Date(post.publishedAt).toISOString().slice(0, 16)
            : '',
          newFeaturedImage: null,
          newImages: [],
        });
      } else {
        alert('Failed to load news post');
        router.push('/admin/news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Failed to load news post');
      router.push('/admin/news');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        newFeaturedImage: e.target.files![0],
      }));
    }
  };

  const handleNewImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        newImages: [...prev.newImages, ...Array.from(e.target.files || [])],
      }));
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveNewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let featuredImageUrl = formData.featuredImage;
      let imageUrls = [...formData.images];

      // Upload new featured image if provided
      if (formData.newFeaturedImage) {
        const featuredFormData = new FormData();
        featuredFormData.append('images', formData.newFeaturedImage);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: featuredFormData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadData.success) {
          throw new Error(uploadData.error || 'Featured image upload failed');
        }

        featuredImageUrl = uploadData.data.urls[0];
      }

      // Upload new additional images if any
      if (formData.newImages.length > 0) {
        const imagesFormData = new FormData();
        formData.newImages.forEach(file => {
          imagesFormData.append('images', file);
        });

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imagesFormData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadData.success) {
          throw new Error(uploadData.error || 'Images upload failed');
        }

        imageUrls = [...imageUrls, ...uploadData.data.urls];
      }

      // Update news post
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const newsResponse = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: {
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            content: formData.content,
            author: formData.author,
            category: formData.category,
            tags: tagsArray,
            featuredImage: featuredImageUrl,
            images: imageUrls,
            status: formData.status,
            publishedAt: formData.publishedAt || undefined,
          },
        }),
      });

      const newsData = await newsResponse.json();

      if (newsData.success) {
        alert('News post updated successfully!');
        router.push('/admin/news');
      } else {
        throw new Error(newsData.error || 'Failed to update news post');
      }
    } catch (error: any) {
      console.error('Error updating news:', error);
      alert(error.message || 'Failed to update news post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="hostel-form-page">
          <div className="page-header">
            <h1>Loading...</h1>
            <p className="text-muted">Fetching news post...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="hostel-form-page">
        <div className="page-header">
          <div>
            <h1>Edit News Post</h1>
            <p className="text-muted">Update the article details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="hostel-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="slug">URL Slug *</label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="author">Author *</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="publishedAt">Publish Date (Optional)</label>
                <input
                  type="datetime-local"
                  id="publishedAt"
                  name="publishedAt"
                  value={formData.publishedAt}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="excerpt">Excerpt *</label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  className="form-textarea"
                />
                <small className="text-muted">{formData.excerpt.length} characters</small>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="content">Content *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={12}
                  required
                  className="form-textarea"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="tags">Tags (comma-separated)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="form-section">
            <h3>Featured Image</h3>

            {formData.featuredImage && !formData.newFeaturedImage && (
              <div>
                <p className="text-muted">Current Featured Image:</p>
                <div className="image-preview-grid" style={{ marginBottom: '1rem' }}>
                  <div className="image-preview">
                    <img src={formData.featuredImage} alt="Current featured" />
                  </div>
                </div>
              </div>
            )}

            <div className="upload-area">
              <label htmlFor="newFeaturedImage" className="upload-label">
                <div className="upload-icon">📸</div>
                <p>Click to upload new featured image</p>
                <p className="text-muted">PNG, JPG, WEBP up to 5MB</p>
                <input
                  type="file"
                  id="newFeaturedImage"
                  accept="image/*"
                  onChange={handleNewFeaturedImageUpload}
                  className="upload-input"
                />
              </label>
            </div>

            {formData.newFeaturedImage && (
              <div className="image-preview-grid" style={{ marginTop: '1rem' }}>
                <div className="image-preview">
                  <img
                    src={URL.createObjectURL(formData.newFeaturedImage)}
                    alt="New featured preview"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(prev => ({ ...prev, newFeaturedImage: null }))
                    }
                    className="remove-image"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div className="form-section">
            <h3>Additional Images</h3>

            {formData.images.length > 0 && (
              <div>
                <p className="text-muted">Current Images:</p>
                <div className="image-preview-grid">
                  {formData.images.map((url, index) => (
                    <div key={index} className="image-preview">
                      <img src={url} alt={`Current ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="remove-image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="upload-area" style={{ marginTop: '1rem' }}>
              <label htmlFor="newImages" className="upload-label">
                <div className="upload-icon">🖼️</div>
                <p>Click to upload additional images</p>
                <p className="text-muted">PNG, JPG, WEBP up to 5MB each</p>
                <input
                  type="file"
                  id="newImages"
                  accept="image/*"
                  multiple
                  onChange={handleNewImagesUpload}
                  className="upload-input"
                />
              </label>
            </div>

            {formData.newImages.length > 0 && (
              <div>
                <p className="text-muted" style={{ marginTop: '1rem' }}>New Images to Add:</p>
                <div className="image-preview-grid">
                  {formData.newImages.map((file, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="remove-image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Updating Post...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
