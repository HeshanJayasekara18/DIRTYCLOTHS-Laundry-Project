import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Package, DollarSign, Clock, Users, Search, Filter, MoreVertical, CheckCircle, XCircle } from 'lucide-react';

const LaundryAdminPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch packages from API
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/package`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      } else {
        setError('Failed to fetch packages');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Network error while fetching packages');
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.package_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.package_description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddPackage = async (newPackage) => {
    try {
      setError('');
      console.log('Sending package data:', newPackage);
      
      const response = await fetch(`${API_BASE_URL}/package`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPackage),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Package added successfully:', result);
        fetchPackages();
        setShowAddModal(false);
      } else {
        const errorData = await response.text();
        console.error('Add failed:', response.status, errorData);
        setError(`Failed to add package: ${errorData}`);
      }
    } catch (error) {
      console.error('Error adding package:', error);
      setError('Network error while adding package');
    }
  };

  const handleEditPackage = async (updatedPackage) => {
    try {
      setError('');
      const packageId = editingPackage.packageID || editingPackage.id || editingPackage._id;
      console.log('Updating package with ID:', packageId);
      console.log('Updated package data:', updatedPackage);
      
      const response = await fetch(`${API_BASE_URL}/package/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedPackage,
          packageID: packageId
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Package updated successfully:', result);
        fetchPackages();
        setEditingPackage(null);
      } else {
        const errorData = await response.text();
        console.error('Update failed:', response.status, errorData);
        setError(`Failed to update package: ${errorData}`);
      }
    } catch (error) {
      console.error('Error updating package:', error);
      setError('Network error while updating package');
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        setError('');
        const response = await fetch(`${API_BASE_URL}/package/${packageId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          console.log('Package deleted successfully');
          fetchPackages();
        } else {
          const errorData = await response.text();
          console.error('Delete failed:', response.status, errorData);
          setError(`Failed to delete package: ${errorData}`);
        }
      } catch (error) {
        console.error('Error deleting package:', error);
        setError('Network error while deleting package');
      }
    }
  };

  // Helper function to ensure features is always an array
  const normalizeFeatures = (features) => {
    if (Array.isArray(features)) {
      return features.length > 0 ? features : [''];
    }
    if (typeof features === 'string' && features.trim()) {
      return [features];
    }
    return [''];
  };

  const PackageModal = ({ package: pkg, onSave, onClose, isEdit = false }) => {
    const [formData, setFormData] = useState(() => {
      if (pkg) {
        return {
          package_name: pkg.package_name || '',
          package_description: pkg.package_description || '',
          package_time: pkg.package_time || '',
          features: normalizeFeatures(pkg.features),
          pricing: {
            below_1: pkg.pricing?.below_1 || '',
            between_1And10: pkg.pricing?.between_1And10 || '',
            above_10: pkg.pricing?.above_10 || ''
          }
        };
      }
      return {
        package_name: '',
        package_description: '',
        package_time: '',
        features: [''],
        pricing: {
          below_1: '',
          between_1And10: '',
          above_10: ''
        }
      };
    });

    const [formError, setFormError] = useState('');

    const handleSubmit = (e) => {
      if (e) e.preventDefault();
      
      // Validation
      if (!formData.package_name.trim()) {
        setFormError('Package name is required');
        return;
      }
      if (!formData.package_description.trim()) {
        setFormError('Package description is required');
        return;
      }
      if (!formData.package_time.trim()) {
        setFormError('Package time is required');
        return;
      }
      
      const cleanFeatures = formData.features.filter(f => f.trim() !== '');
      if (cleanFeatures.length === 0) {
        setFormError('At least one feature is required');
        return;
      }

      setFormError('');
      
      const processedData = {
        ...formData,
        pricing: {
          below_1: parseFloat(formData.pricing.below_1) || 0,
          between_1And10: parseFloat(formData.pricing.between_1And10) || 0,
          above_10: parseFloat(formData.pricing.above_10) || 0
        },
        features: cleanFeatures
      };
      
      console.log('Submitting form data:', processedData);
      onSave(processedData);
    };

    const updateFeature = (index, value) => {
      const newFeatures = [...formData.features];
      newFeatures[index] = value;
      setFormData({ ...formData, features: newFeatures });
    };

    const addFeature = () => {
      setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const removeFeature = (index) => {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      if (newFeatures.length === 0) {
        newFeatures.push('');
      }
      setFormData({ ...formData, features: newFeatures });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Package' : 'Add New Package'}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{formError}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Package Name *
                </label>
                <input
                  type="text"
                  value={formData.package_name}
                  onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Package Description *
                </label>
                <textarea
                  value={formData.package_description}
                  onChange={(e) => setFormData({ ...formData, package_description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Package Time *
                </label>
                <input
                  type="text"
                  value={formData.package_time}
                  onChange={(e) => setFormData({ ...formData, package_time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 24 hours, 2-3 days"
                  required
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Features *
                  </label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus size={16} />
                    <span>Add Feature</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features && formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Wash & Fold, Stain Removal"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Pricing Structure</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Below 1 kg ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricing.below_1}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      pricing: { ...formData.pricing, below_1: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    1-10 kg ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricing.between_1And10}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      pricing: { ...formData.pricing, between_1And10: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Above 10 kg ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricing.above_10}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      pricing: { ...formData.pricing, above_10: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {isEdit ? 'Update Package' : 'Add Package'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laundry Packages</h1>
              <p className="text-gray-600 mt-1">Manage your laundry service packages</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Package</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="text-red-600 mr-2" size={20} />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Packages</p>
                <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Packages</p>
                <p className="text-2xl font-bold text-green-600">{packages.filter(p => p.status !== 'inactive').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Price (1-10kg)</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${packages.length > 0 ? 
                    (packages.reduce((sum, p) => sum + (p.pricing?.between_1And10 || 0), 0) / packages.length).toFixed(2) : 
                    '0.00'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quick Services</p>
                <p className="text-2xl font-bold text-orange-600">
                  {packages.filter(p => p.package_time && p.package_time.toLowerCase().includes('hour')).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchPackages}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div key={pkg.packageID || pkg.id || pkg._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{pkg.package_name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingPackage(pkg)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.packageID || pkg.id || pkg._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{pkg.package_description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2" />
                    <span>{pkg.package_time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Package size={16} className="mr-2" />
                    <span>{Array.isArray(pkg.features) ? pkg.features.join(', ') : pkg.features}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Pricing</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Below 1kg:</span>
                      <span className="font-medium">${pkg.pricing?.below_1 || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">1-10kg:</span>
                      <span className="font-medium">${pkg.pricing?.between_1And10 || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Above 10kg:</span>
                      <span className="font-medium">${pkg.pricing?.above_10 || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first package'}
            </p>
          </div>
        )}
      </div>

      {/* Add Package Modal */}
      {showAddModal && (
        <PackageModal
          onSave={handleAddPackage}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Package Modal */}
      {editingPackage && (
        <PackageModal
          package={editingPackage}
          onSave={handleEditPackage}
          onClose={() => setEditingPackage(null)}
          isEdit={true}
        />
      )}
    </div>
  );
};

export default LaundryAdminPage;