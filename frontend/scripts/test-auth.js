const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const TEST_EMAIL = `testuser_${Date.now()}@example.com`;
const TEST_PASSWORD = 'Test@1234';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

async function testAuth() {
  try {
    console.log('🚀 Starting authentication test...\n');

    // 1. Test registration
    console.log('1. Testing registration...');
    const registerResponse = await api.post('/auth/registration/', {
      email: TEST_EMAIL,
      password1: TEST_PASSWORD,
      password2: TEST_PASSWORD,
      first_name: 'Test',
      last_name: 'User',
      phone_number: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    });
    console.log('✅ Registration successful!');

    // 2. Test login
    console.log('\n2. Testing login...');
    const loginResponse = await api.post('/auth/login/', {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    
    const { access: accessToken, refresh: refreshToken } = loginResponse.data;
    console.log('✅ Login successful!');
    console.log('   Access Token:', accessToken.substring(0, 20) + '...');
    console.log('   Refresh Token:', refreshToken.substring(0, 20) + '...');

    // 3. Test getting current user
    console.log('\n3. Testing get current user...');
    const userResponse = await api.get('/auth/user/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('✅ Current user data:', {
      email: userResponse.data.email,
      name: `${userResponse.data.first_name} ${userResponse.data.last_name}`
    });

    // 4. Test token refresh
    console.log('\n4. Testing token refresh...');
    const refreshResponse = await api.post('/auth/token/refresh/', {
      refresh: refreshToken
    });
    console.log('✅ Token refresh successful!');
    console.log('   New access token:', refreshResponse.data.access.substring(0, 20) + '...');

    // 5. Test logout
    console.log('\n5. Testing logout...');
    await api.post('/auth/logout/', {
      refresh: refreshToken
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('✅ Logout successful!');

    console.log('\n🎉 All authentication tests passed successfully!');
    console.log(`Test user email: ${TEST_EMAIL}`);
    console.log('You may want to delete this test user from the database.');

  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testAuth();
