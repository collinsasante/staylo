import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useRouter } from 'next/router';

interface HostelFormData {
  name: string;
  location: string;
  price: string;
  description: string;
  amenities: string[];
  ownerName: string;
  ownerContact: string;
  ownerEmail: string;
  status: 'active' | 'unavailable' | 'featured';
  images: File[];
}

export default function NewHostel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<HostelFormData>({
    name: '',
    location: '',
    price: '',
    description: '',
    amenities: [],
    ownerName: '',
    ownerContact: '',
    ownerEmail: '',
    status: 'active',
    images: [],
  });

  const amenitiesList = [
    'WiFi',
    'Water Supply',
    'Security',
    'Kitchen',
    'Laundry',
    'Parking',
    'Generator',
    'Study Room',
    'Gym',
    'Air Conditioning',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      let imageUrls: string[] = [];

      // Step 1: Upload images to Cloudinary if any
      if (formData.images.length > 0) {
        const formDataImages = new FormData();
        formData.images.forEach(file => {
          formDataImages.append('images', file);
        });

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataImages,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadData.success) {
          throw new Error(uploadData.error || 'Image upload failed');
        }

        imageUrls = uploadData.data.urls;
      }

      // Step 2: Create hostel with image URLs
      const hostelResponse = await fetch('/api/hostels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostelData: {
            name: formData.name,
            location: formData.location,
            price: Number(formData.price),
            description: formData.description,
            amenities: formData.amenities,
            ownerName: formData.ownerName,
            ownerContact: formData.ownerContact,
            ownerEmail: formData.ownerEmail || undefined,
            status: formData.status,
          },
          imageUrls: imageUrls,
        }),
      });

      const hostelData = await hostelResponse.json();

      if (hostelData.success) {
        alert('Hostel added successfully!');
        router.push('/admin/hostels');
      } else {
        throw new Error(hostelData.error || 'Failed to create hostel');
      }
    } catch (error: any) {
      console.error('Error adding hostel:', error);
      alert(error.message || 'Failed to add hostel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="hostel-form-page">
        <div className="page-header">
          <div>
            <h1>Add New Hostel</h1>
            <p className="text-muted">Fill in the details to list a new hostel property</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="hostel-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Hostel Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Sunrise Hostel"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Accra, Greater Accra"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price per Semester (GH₵) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 1200"
                  required
                  className="form-input"
                />
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
                  <option value="active">Active</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the hostel, its features, and what makes it special..."
                rows={5}
                required
                className="form-textarea"
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="form-section">
            <h3>Amenities</h3>
            <div className="amenities-grid">
              {amenitiesList.map(amenity => (
                <label key={amenity} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Owner Information */}
          <div className="form-section">
            <h3>Owner Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="ownerName">Owner Name *</label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  placeholder="e.g., Mr. Kofi Mensah"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="ownerContact">Contact Number *</label>
                <input
                  type="tel"
                  id="ownerContact"
                  name="ownerContact"
                  value={formData.ownerContact}
                  onChange={handleInputChange}
                  placeholder="+233 24 123 4567"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="ownerEmail">Email (Optional)</label>
                <input
                  type="email"
                  id="ownerEmail"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleInputChange}
                  placeholder="owner@example.com"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h3>Images</h3>
            <div className="upload-area">
              <label htmlFor="images" className="upload-label">
                <div className="upload-icon">📸</div>
                <p>Click to upload images or drag and drop</p>
                <p className="text-muted">PNG, JPG, WEBP up to 5MB</p>
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
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
              {loading ? 'Adding Hostel...' : 'Add Hostel'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
