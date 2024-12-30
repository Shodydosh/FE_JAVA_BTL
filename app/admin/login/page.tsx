'use client';
import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Update this line

interface LoginRequest {
  email: string;
  password: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;  // This will now be included in the token
  iat: number;
  exp: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdDate: string;
  lastModifiedDate: string;
}

const AdminLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRedirect = (role: string) => {
    console.log('Redirecting with role:', role);
    switch (role.toLowerCase()) {  // Change to toLowerCase()
      case 'admin':
        router.push('/admin');
        break;
      case 'shipper':
        router.push('/shipper');
        break;
      case 'manager':
        console.log('Detected manager role, redirecting to /manager');
        router.push('/manager');
        break;
      default:
        console.log('Invalid role detected:', role);
        message.error('Invalid role');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }
  };

  const fetchUserByEmail = async (email: string): Promise<User> => {
    try {
      const response = await axios.get(`http://localhost:8080/api/client/users/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', values.email);
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: values.email,
        password: values.password
      });
      
      const token = response.data;
      console.log('Token:', token);
      
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log('Decoded token:', decoded);
        
        // Fetch user details using email from token
        const user = await fetchUserByEmail(decoded.email);
        console.log('Fetched user:', user);
        
        if (!user.role) {
          message.error('Role information missing');
          return;
        }
        
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('user', JSON.stringify(user));
        
        message.success('Login successful');
        handleRedirect(user.role);
      } catch (decodeError) {
        console.error('Token decode or user fetch error:', decodeError);
        message.error('Authentication failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Backend specific error messages
      const errorMessage = error.response?.data || 'Login failed';
      if (errorMessage === 'User not found') {
        message.error('User not found');
      } else if (errorMessage === 'Incorrect password') {
        message.error('Incorrect password');
      } else {
        message.error('Login failed');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Form
        name="admin_login"
        className="w-96 p-8 shadow-lg rounded"
        onFinish={onFinish}
      >
        <h1 className="text-2xl mb-6 text-center">Admin Login</h1>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminLogin;

