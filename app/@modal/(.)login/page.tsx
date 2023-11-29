'use client';

import React, { useState } from 'react';
import { Modal, ModalProps, FormProps, Form, message } from 'antd';
import LoginForm from '@/components/form/login';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@/lib/http/axios-instance';
import { useAuth } from '@/hooks/useAuth';

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

            localStorage.setItem('token', JSON.stringify(response));

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
