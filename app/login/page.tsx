'use client';

import React from 'react';
import { Form, message } from 'antd';
import LoginForm from '@/components/form/login';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@/lib/http/axios-instance';
import { useAuth } from '@/hooks/useAuth';
import { jwtDecode } from "jwt-decode";

interface UserData {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    createdDate: string;
    lastModifiedDate: string;
}

const Page: React.FC = () => {
    const router = useRouter();
    const [formInstace] = Form.useForm();
    const { mutate } = useAuth();

    const loginSubmitHandler = async (values: Record<string, any>) => {
        try {
            const response = await axiosInstance.post('/auth/login', values);

            if (!response) {
                throw new Error('Token not found');
            }

            localStorage.setItem('token', response);

            const decodedToken: any = jwtDecode(response);
            const userEmail = decodedToken.sub;
            const userResponse = await axiosInstance.get<UserData>(
                `/client/users/email/${userEmail}`,
            );
            
            // Store user data
            localStorage.setItem('userData', JSON.stringify(userResponse));
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userId = userData.id;
            console.log('userId: ', userId);
            
            formInstace.resetFields();
            mutate(null);
            router.push('/');
            message.success('Login successfully');
        } catch (error: any) {
            console.error('Login error:', error);
            message.error('Username or Password incorrect');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                <LoginForm
                    formInstace={formInstace}
                    onSubmit={loginSubmitHandler}
                />
            </div>
        </div>
    );
};

export default Page;
