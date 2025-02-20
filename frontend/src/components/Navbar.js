// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    setToken(tokenFromStorage);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-gray-100 to-gray-200 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-semibold text-gray-800">
          <Link to="/" className="hover:text-gray-600 transition">
            Management
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            type="text"
            icon={isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            onClick={toggleMobileMenu}
            className="text-2xl text-gray-700 hover:text-gray-900 transition"
          />
        </div>

        {/* Navigation Links */}
        <ul
          className={`lg:flex lg:space-x-6 items-center justify-end text-gray-700 font-medium transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "block" : "hidden"
          } lg:block absolute lg:static top-16 left-0 w-full bg-white lg:bg-transparent shadow-lg lg:shadow-none p-4 lg:p-0 rounded-lg`}
        >
          {!token && (
            <li>
              <Link
                to="/register"
                className="block px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Register
              </Link>
            </li>
          )}

          <li>
            <Link
              to="/category/list"
              className="block px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Category List
            </Link>
          </li>

          {token && (
            <li>
              <button
                onClick={handleLogout}
                className="block px-6 py-2   rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
