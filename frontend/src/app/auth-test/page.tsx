'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AuthTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const auth = useAuth();

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, message]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test Registration
      addResult('🔄 Testing registration...');
      const userData = await auth.register({
        email: 'test@example.com',
        phone_number: '+1234567890',
        first_name: 'Test',
        last_name: 'User',
        password: 'TestPass123!',
        confirm_password: 'TestPass123!'
      });
      
      addResult('✅ Registration successful: ' + JSON.stringify(userData));
      
      // Test Login
      addResult('🔄 Testing login...');
      const loginResult = await auth.login({
        email: 'test@example.com',
        password: 'TestPass123!'
      });
      
      addResult('✅ Login successful: ' + JSON.stringify(loginResult));
      
      // Test token refresh
      addResult('🔄 Testing token refresh...');
      const newToken = await auth.refreshAccessToken();
      if (newToken) {
        addResult('✅ Token refresh successful');
      } else {
        addResult('❌ Token refresh failed');
      }
      
      // Test protected route access
      addResult('🔄 Testing authenticated state...');
      if (auth.isAuthenticated && auth.user) {
        addResult('✅ Authentication state verified');
        addResult('👤 Current user: ' + JSON.stringify(auth.user));
      } else {
        addResult('❌ Authentication state verification failed');
      }
      
      // Test logout
      addResult('🔄 Testing logout...');
      await auth.logout();
      if (!auth.isAuthenticated && !auth.user) {
        addResult('✅ Logout successful');
      } else {
        addResult('❌ Logout failed');
      }
      
    } catch (error) {
      addResult('❌ Test failed: ' + (error as Error).message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      <button
        onClick={runTests}
        disabled={isRunning}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isRunning ? 'Running Tests...' : 'Run Auth Tests'}
      </button>
      
      <div className="mt-4 space-y-2">
        {testResults.map((result, index) => (
          <div 
            key={index}
            className={`p-2 rounded ${
              result.includes('❌') ? 'bg-red-100' :
              result.includes('✅') ? 'bg-green-100' :
              'bg-gray-100'
            }`}
          >
            {result}
          </div>
        ))}
      </div>
    </div>
  );
}