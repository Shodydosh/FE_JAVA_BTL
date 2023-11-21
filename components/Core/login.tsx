import React, { useState } from "react";
import ReactDOM from "react-dom";
import {Modal, Button, Input, message} from "antd";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styled from "@emotion/styled/macro";
import './app.css';
import Register from './register';
import { response } from "express";
import axios from 'axios';

const initialState = { email: '', password: '' };
interface formData  {
  email: string,
  password: string
}

const Login = () =>{
  const [formData, setFormData] = useState<formData>(initialState);
  const [openLogin, setOpenLogin] = useState<boolean>(false);

  const handleLogin = async (e : any) => {
    e.preventDefault();
    try {
      const  response = await axios.post('http://localhost:8080/api/auth/login', formData);
      localStorage.setItem("token",JSON.stringify(response.data))
      localStorage.setItem("user",JSON.stringify(response.config))
      message.success("Successfully Logged in 12333");
      setOpenLogin(false);
    } 
    catch (error: any) {
        console.log(error.message)
        message.error("Username or Password incorrect");
      }
  };

  const handleChange =  (e : any) =>{
    setFormData({...formData, [e.target.name]: e.target.value})
    };

  return(
    <div>
      <Button className = "title" type="primary" onClick={() => setOpenLogin(true)}>
        Log in / Sign up
      </Button>
      <Modal
        visible={openLogin}
        footer = {null} 
        onCancel={() => setOpenLogin(false)}
      >
        <div className = "login-container">
          <h2 className = 'login-title'>Log in</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Input
                type="text"
                id="email"
                name = "email"
                placeholder="Email"
                onChange = {handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Input
                type="password"
                id="password"
                name = "password"
                placeholder="Password"
                onChange = {handleChange}
              />
            </div>

            <button className = "btn-login" type = "submit">
              Log in
            </button>
            <div className="create">
              <p>Or <Register setOpenLogin={setOpenLogin} /></p>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}
export default Login;