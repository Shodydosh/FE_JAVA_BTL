'use client';

import React, { useState } from 'react';
import { Modal, Form, message } from 'antd';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@/lib/http/axios-instance';
import RegisterForm from '@/components/form/register';

const RegisterModal: React.FC = () => {
    const router = useRouter();
    const [formInstace] = Form.useForm();

    const [isRegisterModal, setIsOpenRegisterModal] = useState(true);

    const registerSubmitHandler = async (values: Record<string, any>) => {
        try {
            const response = await axiosInstance.post('/auth/register', values);

            console.log('register response: ', response);

            message.success('Register succesfully!');

            formInstace.resetFields();

            setIsOpenRegisterModal(false);
        } catch (error: any) {
            console.log(error);
            message.error('Register Failed');
        }
    };

    return (
        <Modal
            open={isRegisterModal}
            title={null}
            footer={null}
            onCancel={() => setIsOpenRegisterModal(false)}
            centered
            afterClose={() => router.replace('/')}
        >
            <RegisterForm
                formInstace={formInstace}
                onSubmit={registerSubmitHandler}
            />
        </Modal>
    );
};
export default RegisterModal;
