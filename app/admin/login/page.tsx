'use client';
import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface LoginRequest {
  email: string;
  password: string;
}

const AdminLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: values.email,
        password: values.password
      });
      
      // Backend returns JWT token directly as string
      const token = response.data;

      localStorage.setItem('token', token);
      message.success('Login successful');
      router.push('/admin');
    } catch (error: any) {
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
