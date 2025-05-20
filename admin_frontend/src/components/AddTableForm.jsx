import './AddTableForm.css'; // Import custom CSS file

import React, { useState } from 'react';

import axios from 'axios';

const AddTableForm = () => {
  const [formData, setFormData] = useState({
    table_number: '',
    table_type: 'indoor',
    capacity: '',
    description: ''
  });
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      // Append each image file
      Array.from(images).forEach((image) => {
        data.append('images', image);
      });

      const response = await axios.post('http://localhost:4000/api/tables', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Table added successfully!' });
        // Reset form
        setFormData({
          table_number: '',
          table_type: 'indoor',
          capacity: '',
          description: ''
        });
        setImages([]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Upload failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="table-form-container">
      <div className="form-header">
        <h2>Add New Table</h2>
      </div>
      
      {message.text && (
        <div className={`message-box ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="table-form">
        <div className="form-group">
          <label>Table Number</label>
          <input
            type="text"
            name="table_number"
            value={formData.table_number}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Table Type</label>
          <select
            name="table_type"
            value={formData.table_type}
            onChange={handleInputChange}
          >
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </div>

        <div className="form-group">
          <label>Capacity (Number of chairs)</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Table Images (Max 5)</label>
          <div className="file-input-container">
            <input
              type="file"
              name="images"
              onChange={handleImageChange}
              multiple
              accept="image/jpeg, image/png"
              className="file-input"
              id="table-images"
            />
            <label htmlFor="table-images" className="file-input-label">Choose Files</label>
            <span className="file-count">{images.length > 0 ? `${images.length} file(s) selected` : 'No files chosen'}</span>
          </div>
          <p className="file-hint">First image will be used as primary image</p>
        </div>

        <div className="form-group submit-group">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
          >
            {isSubmitting ? 'Adding Table...' : 'Add Table'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTableForm;