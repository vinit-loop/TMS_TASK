// src/pages/Register.js
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button, Form, Card, Select, Typography, Modal } from "antd";

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: "", content: "" });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "user",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      role: Yup.string()
        .oneOf(["user", "admin"], "Invalid role")
        .required("Role is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/auth/register",
          values
        );
        if (response.status === 201) {
          setModalMessage({
            title: "Registration Successful",
            content: "User registered successfully!",
          });
          setIsModalVisible(true);

          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      } catch (error) {
        setModalMessage({
          title: "Registration Failed",
          content: error.response?.data?.message || "Error registering user.",
        });
        setIsModalVisible(true);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <Card className="shadow-lg rounded-xl w-full max-w-md p-6 transition transform hover:scale-105 bg-white">
        <Title level={2} className="text-center text-gray-800 mb-6">
          Register
        </Title>
        <Form layout="vertical" onFinish={formik.handleSubmit}>
          {/* Email Field */}
          <Form.Item
            label="Email"
            validateStatus={
              formik.touched.email && formik.errors.email ? "error" : ""
            }
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
            validateStatus={
              formik.touched.password && formik.errors.password ? "error" : ""
            }
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

          {/* Role Field */}
          <Form.Item label="Role">
            <Select
              name="role"
              size="large"
              value={formik.values.role}
              onChange={(value) => formik.setFieldValue("role", value)}
              onBlur={formik.handleBlur}
            >
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 transition-all"
          >
            Register
          </Button>
        </Form>
      </Card>

      {/* Ant Design Modal for Registration Success/Error */}
      <Modal
        title={modalMessage.title}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setIsModalVisible(false)}
          >
            OK
          </Button>,
        ]}
      >
        <Text>{modalMessage.content}</Text>
      </Modal>
    </div>
  );
};

export default Register;
