
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const packageData = {
                packageID: uuidv4(),
                package_name: formData.package_name,
                package_description: formData.package_description,
                package_time: formData.package_time,
                features: formData.features,
                pricing: {
                    below_1: formData.pricing.below_1,
                    between_1And10: formData.pricing.between_1And10,
                    above_10: formData.pricing.above_10
                }
            };

            
            const response = await fetch('http://localhost:5000/api/package', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(packageData) 
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            alert('Package added successfully!');
            console.log(data);
            
            // Reset form after successful submission
            setFormData({
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
            
            // Call getAllPackage to refresh the list if provided
            if (getAllPackage) {
                getAllPackage();
            }
            
            // Close modal if handleClose is provided
            if (handleClose) {
                handleClose();
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error adding package. Please try again.');
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