import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AdminTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAdminUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/test-admin`);
      setTestResult(response.data);
    } catch (error) {
      setTestResult({ 
        status: 'error', 
        message: error.response?.data?.message || error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: 'heshan.system@admin.com',
        password: '12345678'
      });
      setTestResult({ 
        status: 'success', 
        message: 'Login successful',
        data: response.data
      });
    } catch (error) {
      setTestResult({ 
        status: 'error', 
        message: error.response?.data?.message || error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={testAdminUser}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Admin User Setup'}
        </button>
        
        <button
          onClick={testLogin}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Admin Login'}
        </button>
      </div>
      
      {testResult && (
        <div className={`mt-6 p-4 rounded ${
          testResult.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <h3 className="font-bold">Test Result:</h3>
          <p className="mt-2">{testResult.message}</p>
          {testResult.data && (
            <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(testResult.data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTest;