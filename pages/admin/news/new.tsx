import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useRouter } from 'next/router';

interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage: File | null;
  images: File[];
  publishedAt: string;
}

export default function NewNews() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    status: 'draft',
    featuredImage: null,
    images: [],
    publishedAt: '',
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      // Auto-generate slug from title
      if (name === 'title') {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      return updated;
    });
  };

  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        featuredImage: e.target.files![0],
      }));
    }
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files || [])],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let featuredImageUrl = '';
      let imageUrls: string[] = [];

      // Step 1: Upload featured image if provided
      if (formData.featuredImage) {
        const featuredFormData = new FormData();
        featuredFormData.append('images', formData.featuredImage);

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

      // Step 2: Upload additional images if any
      if (formData.images.length > 0) {
        const imagesFormData = new FormData();
        formData.images.forEach(file => {
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

        imageUrls = uploadData.data.urls;
      }

      // Step 3: Create news post
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const newsResponse = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      });

      const newsData = await newsResponse.json();

      if (newsData.success) {
        alert('News post created successfully!');
        router.push('/admin/news');
      } else {
        throw new Error(newsData.error || 'Failed to create news post');
      }
    } catch (error: any) {
      console.error('Error creating news:', error);
      alert(error.message || 'Failed to create news post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="hostel-form-page">
        <div className="page-header">
          <div>
            <h1>Create News Post</h1>
            <p className="text-muted">Write and publish a new article</p>
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
                  placeholder="e.g., Top 10 Study Tips for Students"
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
                  placeholder="e.g., top-10-study-tips-for-students"
                  required
                  className="form-input"
                />
                <small className="text-muted">Auto-generated from title, but you can edit it</small>
              </div>

              <div className="form-group">
                <label htmlFor="author">Author *</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
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
                  placeholder="A brief summary of the article (150-200 characters)"
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
                  placeholder="Write your article content here. You can use HTML or markdown..."
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
                  placeholder="e.g., study, tips, students, education"
                  className="form-input"
                />
                <small className="text-muted">Separate tags with commas</small>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="form-section">
            <h3>Featured Image *</h3>
            <div className="upload-area">
              <label htmlFor="featuredImage" className="upload-label">
                <div className="upload-icon">📸</div>
                <p>Click to upload featured image</p>
                <p className="text-muted">PNG, JPG, WEBP up to 5MB</p>
                <input
                  type="file"
                  id="featuredImage"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="upload-input"
                />
              </label>
            </div>

            {formData.featuredImage && (
              <div className="image-preview-grid" style={{ marginTop: '1rem' }}>
                <div className="image-preview">
                  <img
                    src={URL.createObjectURL(formData.featuredImage)}
                    alt="Featured preview"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, featuredImage: null }))}
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
            <h3>Additional Images (Optional)</h3>
            <div className="upload-area">
              <label htmlFor="images" className="upload-label">
                <div className="upload-icon">🖼️</div>
                <p>Click to upload additional images</p>
                <p className="text-muted">PNG, JPG, WEBP up to 5MB each</p>
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImagesUpload}
                  className="upload-input"
                />
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="image-preview-grid">
                {formData.images.map((file, index) => (
                  <div key={index} className="image-preview">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="remove-image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Post...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
