'use client';

import React, { useState } from 'react';
import { Modal, ModalProps, FormProps, Form, message } from 'antd';
import LoginForm from '@/components/form/login';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@/lib/http/axios-instance';
import { useAuth } from '@/hooks/useAuth';
import { jwtDecode } from "jwt-decode";

interface LoginModalProps extends ModalProps {
    isOpen: boolean;
    onSubmit: FormProps['onFinish'];
    formInstace?: FormProps['form'];
}

const LoginModal: React.FC<LoginModalProps> = () => {
    const router = useRouter();
    const [formInstace] = Form.useForm();

    const [isOpenModal, setIsOpenLoginModal] = useState(true);

    const { isLoggedIn, isValidating, mutate } = useAuth();

    const loginSubmitHandler = async (values: Record<string, any>) => {
        console.log('login values: ', values);

        try {
            const response = await axiosInstance.post('/auth/login', values);

            if (!response) {
                throw new Error('Token not found');
            }

            // Store the token
            localStorage.setItem('token', JSON.stringify(response));

            // Decode token to get email
            const decodedToken: any = jwtDecode(response);
            const userEmail = decodedToken.sub;
            console.log('userEmail: ', userEmail);
            
            // Fixed URL path - removed duplicate /api
            const userResponse = await axiosInstance.get(`/client/users/email/${userEmail}`);
            if (userResponse?.data) {
                localStorage.setItem('USERID', userResponse.data.id);
            }
            console.log('userResponse: ', userResponse);
            formInstace.resetFields();
            setIsOpenLoginModal(false);
            mutate(null);
            message.success('Login successfully');
        } catch (error: any) {
            console.log(error);
            message.error('Username or Password incorrect');
        }
    };

    return (
        <Modal
            open={isOpenModal}
            title={null}
            footer={null}
            onCancel={() => setIsOpenLoginModal(false)}
            centered
            afterClose={() => router.replace('/')}
        >
            <LoginForm
                formInstace={formInstace}
                onSubmit={loginSubmitHandler}
            />
        </Modal>
    );
};
export default LoginModal;
