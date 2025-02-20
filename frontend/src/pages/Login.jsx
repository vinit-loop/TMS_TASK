// src/pages/Login.js
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button, Form, Card, Typography, message, Modal } from "antd";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: "", content: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/category/list");
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:8000/auth/login", values);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("user_id", response.data.userId);

        setModalMessage({
          title: "Login Successful",
          content: "You have successfully logged in!",
        });
        setIsModalVisible(true);

        setTimeout(() => {
          navigate("/category/list");
        }, 1500);
        window.location.reload()
      } catch (error) {
        setModalMessage({
          title: "Login Failed",
          content: "Invalid credentials. Please try again.",
        });
        setIsModalVisible(true);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <Card
        className="shadow-lg rounded-xl w-full max-w-md p-6 transition transform hover:scale-105 bg-white"
      >
        <Title level={2} className="text-center text-gray-800 mb-6">
          Login
        </Title>
        <Form layout="vertical" onFinish={formik.handleSubmit}>
          {/* Email Field */}
          <Form.Item
            label="Email"
            validateStatus={formik.touched.email && formik.errors.email ? "error" : ""}
            help={formik.touched.email && formik.errors.email}
          >
            <Input
              name="email"
              placeholder="Enter your email"
              size="large"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Password"
            validateStatus={formik.touched.password && formik.errors.password ? "error" : ""}
            help={formik.touched.password && formik.errors.password}
          >
            <Input.Password
              name="password"
              placeholder="Enter your password"
              size="large"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Item>

          {/* Submit Button */}
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 transition-all"
          >
            Login
          </Button>
        </Form>
      </Card>

      {/* Ant Design Modal for Login Success/Error */}
      <Modal
        title={modalMessage.title}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsModalVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <Text>{modalMessage.content}</Text>
      </Modal>
    </div>
  );
};

export default Login;
