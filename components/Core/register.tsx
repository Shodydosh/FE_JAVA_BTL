import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import {Modal, Button, Input, message} from "antd";
import styled from "@emotion/styled/macro";
import './app.css';
import Login from './login';
import { response } from "express";
import axios from 'axios';

const initialState = { name: '', email: '', password: '' };

interface formData  {
  name: string,
  email: string,
  password: string
}

const Register = ({setOpenLogin} : { setOpenLogin: any }) => {
  const [formData, setFormData] = useState<formData>(initialState);
  const [openRegister, setOpenRegister] = useState<boolean>(false);

  const handleOpenRegister = () => {
    setOpenLogin(false);
    setOpenRegister(true);
  };
  const handleGoBackLogin = () => {
    setOpenLogin(true);
    setOpenRegister(false);
  };
  const handleRegisterSuccess = () => {
    setOpenLogin(true);
    setOpenRegister(false);
  };

  const signUp = async (e: any) => {
    e.preventDefault();
    console.log(formData)
      try {
        const  response = await axios.post('http://localhost:8080/api/auth/register', formData)
        console.log(response.data)
        if(response.status === 201){
          message.success('Register Successfully');
          handleRegisterSuccess();
        }
      } 
      catch (error: any) {
        console.log(error.message) 
        message.error("Register Failed");

      }
  };
  
  // useEffect(() => {
  //   if (message) {
  //     window.alert(message);
  //   }
  // }, [message]);
  
  
  const handleChange =  (e : any) =>{
    setFormData({...formData, [e.target.name]: e.target.value})
    };

  return (
    <div>
      <Button className = "signup" type="primary" onClick={() => handleOpenRegister()}>
        Create an account
      </Button>
      <Modal         
        visible={openRegister}
        footer={null}
        onCancel={() => setOpenRegister(false)}
      >
        <div className="register-container">
          <h2 className = "register-title">Register</h2>
          <form >

            <div className="form-group">
              <label htmlFor="name">Userame</label>
              <input 
                name = "name"
                type="text" 
                id="name"
                placeholder="Username"
                onChange={handleChange} 
                required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input  
                type="email"
                name = "email"
                id="email"
                placeholder="Email"
                onChange={handleChange} 
                required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password" 
                name = "password"
                id="password" 
                placeholder="Password"
                onChange={handleChange}
                required />
            </div>

            <button className = "btn-register" type = "submit" onClick={() => signUp}>
              Register
            </button>
            
            <div className = "back">
              Already have an account? Just log in
            </div>
            <Button className = "back-login" type = "primary" onClick={() => handleGoBackLogin()}>
              Log in
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Register;