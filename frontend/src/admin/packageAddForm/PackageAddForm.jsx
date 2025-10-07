
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const PackageAddForm = ({ open, handleClose, getAllPackage, addPackage }) => {
    const [formData, setFormData] = useState({
        package_name: '',
        package_description: '',
        package_time: '',
        features: '',
        pricing: {
            below_1: '',
            between_1And10: '',
            above_10: ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name in formData.pricing) {
            setFormData({
                ...formData,
                pricing: {
                    ...formData.pricing,
                    [name]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    //done
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const packageData = {
        packageID: uuidv4(),
        package_name: formData.package_name,
        package_description: formData.package_description,
        package_time: formData.package_time,
        features: Array.isArray(formData.features) ? formData.features : [formData.features],
        pricing: {
            between_1And10: parseFloat(formData.pricing.between_1And10) || 0,
            above_10: parseFloat(formData.pricing.above_10) || 0
        }
        };

    const API_BASE_URL = process.env.REACT_APP_API_BASE; // Railway backend URL

    const response = await fetch(`${API_BASE_URL}/api/package`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(packageData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    alert('Package added successfully!');
    console.log(data);

    // Reset form
    setFormData({
      package_name: '',
      package_description: '',
      package_time: '',
      features: [''],
      pricing: {
        below_1: '',
        between_1And10: '',
        above_10: ''
      }
    });

    // Refresh packages list
    if (getAllPackage) getAllPackage();

    // Close modal
    if (handleClose) handleClose();

  } catch (error) {
    console.error('Error submitting form:', error);
    alert(error.message || 'Error adding package. Please try again.');
  }
    };


    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Package</h2>

            <label>Package Name:</label>
            <input 
                type="text" 
                name="package_name" 
                value={formData.package_name} 
                onChange={handleChange} 
                required 
            />

            <label>Description:</label>
            <textarea 
                name="package_description" 
                value={formData.package_description} 
                onChange={handleChange} 
                required 
            />

            <label>Time:</label>
            <input 
                type="datetime-local" 
                name="package_time" 
                value={formData.package_time} 
                onChange={handleChange} 
                required 
            />

            <label>Features:</label>
            <input 
                type="text" 
                name="features" 
                value={formData.features} 
                onChange={handleChange} 
                required 
            />

            <h3>Pricing</h3>
            <label>Below 1 kg:</label>
            <input 
                type="text" 
                name="below_1" 
                value={formData.pricing.below_1} 
                onChange={handleChange} 
            />

            <label>1-10 kg:</label>
            <input 
                type="text" 
                name="between_1And10" 
                value={formData.pricing.between_1And10} 
                onChange={handleChange} 
            />

            <label>Above 10 kg:</label>
            <input 
                type="text" 
                name="above_10" 
                value={formData.pricing.above_10} 
                onChange={handleChange} 
            />

            <button type="submit">Submit</button>
        </form>
    );
};

export default PackageAddForm;