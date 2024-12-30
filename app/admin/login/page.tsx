'use client';
import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

interface LoginRequest {
  email: string;
  password: string;
}

interface JwtPayload {
  role: string;
  // ...other JWT fields...
}

const AdminLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRedirect = (role: string) => {
    console.log('Redirecting with role:', role);
    switch (role.toUpperCase()) {
      case 'ADMIN':
        router.push('/admin');
        break;
      case 'SHIPPER':
        router.push('/shipper');
        break;
      case 'MANAGER':
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

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', values.email);
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: values.email,
        password: values.password
      });
      
      console.log('Login response:', response.data);
      const token = response.data;
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Decoded token:', decoded);
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', decoded.role);
      
      message.success('Login successful');
      handleRedirect(decoded.role);
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      message.error(error.response?.data || 'Login failed');
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
